const JSON_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Content-Type": "application/json",
};

exports.handler = async (event) => {
  try {
    if (event.httpMethod === "OPTIONS")
      return { statusCode: 204, headers: JSON_HEADERS, body: "" };
    if (event.httpMethod !== "POST")
      return { statusCode: 405, headers: JSON_HEADERS, body: "" };

    const token = process.env.QSTASH_TOKEN || "";
    if (!token) {
      return {
        statusCode: 500,
        headers: JSON_HEADERS,
        body: JSON.stringify({ error: "QSTASH_TOKEN missing" }),
      };
    }

    const body = JSON.parse(event.body || "{}");
    const { subscription, wakeAtIso, tag, gcAfterMs = 10800000 } = body;
    if (!subscription || !wakeAtIso) {
      return {
        statusCode: 400,
        headers: JSON_HEADERS,
        body: JSON.stringify({ error: "missing subscription or wakeAtIso" }),
      };
    }

    const ts = new Date(wakeAtIso).getTime();
    if (!Number.isFinite(ts)) {
      return {
        statusCode: 400,
        headers: JSON_HEADERS,
        body: JSON.stringify({ error: "invalid wakeAtIso" }),
      };
    }
    const notBefore = Math.floor(ts / 1000).toString();

    const strip = (u) => (u || "").replace(/\/+$/, "");
    const baseUrl = strip(
      process.env.SITE_URL || process.env.URL || process.env.DEPLOY_PRIME_URL
    );
    if (!baseUrl) {
      return {
        statusCode: 500,
        headers: JSON_HEADERS,
        body: JSON.stringify({ error: "SITE_URL/URL not resolved" }),
      };
    }

    const sendUrl = `${baseUrl}/.netlify/functions/send`;
    const cancelUrl = `${baseUrl}/.netlify/functions/cancel`;

    const pubResp = await fetch(
      `https://qstash.upstash.io/v2/publish/${encodeURIComponent(sendUrl)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token.trim()}`,
          "Content-Type": "application/json",
          "Upstash-Not-Before": notBefore,
        },
        body: JSON.stringify({ subscription, tag }),
      }
    );
    const pubText = await pubResp.text();
    if (!pubResp.ok) {
      return {
        statusCode: 502,
        headers: JSON_HEADERS,
        body: JSON.stringify({
          stage: "publish",
          status: pubResp.status,
          text: pubText,
        }),
      };
    }
    const { messageId } = JSON.parse(pubText);

    const delaySeconds = Math.max(0, Math.floor(gcAfterMs / 1000));
    const gcResp = await fetch(
      `https://qstash.upstash.io/v2/publish/${encodeURIComponent(cancelUrl)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token.trim()}`,
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
        headers: JSON_HEADERS,
        body: JSON.stringify({
          stage: "gc",
          status: gcResp.status,
          text: gcText,
        }),
      };
    }
    const { messageId: gcMessageId } = JSON.parse(gcText);

    return {
      statusCode: 202,
      headers: JSON_HEADERS,
      body: JSON.stringify({ messageId, gcMessageId }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: JSON_HEADERS,
      body: JSON.stringify({ error: "schedule exception", details: String(e) }),
    };
  }
};
