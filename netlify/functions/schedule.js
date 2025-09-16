exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") return { statusCode: 405, body: "" };

    const body = JSON.parse(event.body || "{}");
    const { subscription, wakeAtIso, tag, gcAfterMs = 10800000 } = body;
    if (!subscription || !wakeAtIso) {
      return { statusCode: 400, body: JSON.stringify({ error: "missing subscription or wakeAtIso" }) };
    }

    const strip = (u) => (u || "").replace(/\/+$/, "");
    const baseUrl =
      strip(process.env.SITE_URL) ||
      strip(process.env.URL) ||
      strip(process.env.DEPLOY_PRIME_URL);

    const sendUrl = `${baseUrl}/.netlify/functions/send`;
    const cancelUrl = `${baseUrl}/.netlify/functions/cancel`;

    const pubResp = await fetch(
      `https://qstash.upstash.io/v2/publish/${encodeURIComponent(sendUrl)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.QSTASH_TOKEN}`,
          "Content-Type": "application/json",
          "Upstash-Schedule": new Date(wakeAtIso).toISOString(),
        },
        body: JSON.stringify({ subscription, tag }),
      }
    );
    const pubText = await pubResp.text();
    if (!pubResp.ok) {
      return {
        statusCode: 502,
        body: JSON.stringify({ stage: "publish", status: pubResp.status, text: pubText }),
      };
    }
    const { messageId } = JSON.parse(pubText);

    const delaySeconds = Math.max(0, Math.floor(gcAfterMs / 1000));
    const gcResp = await fetch(
      `https://qstash.upstash.io/v2/publish/${encodeURIComponent(cancelUrl)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.QSTASH_TOKEN}`,
          "Content-Type": "application/json",
          "Upstash-Delay": `${delaySeconds}s`,
        },
        body: JSON.stringify({ messageId }),
      }
    );
    const gcText = await gcResp.text();
    if (!gcResp.ok) {
      return {
        statusCode: 502,
        body: JSON.stringify({ stage: "gc", status: gcResp.status, text: gcText }),
      };
    }
    const { messageId: gcMessageId } = JSON.parse(gcText);

    return { statusCode: 202, body: JSON.stringify({ messageId, gcMessageId }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: "schedule exception", details: String(e) }) };
  }
};
