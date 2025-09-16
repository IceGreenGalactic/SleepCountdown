const QSTASH_TOKEN = process.env.QSTASH_TOKEN;
const rawBase =
  process.env.SITE_URL || process.env.URL || process.env.DEPLOY_PRIME_URL || "";
const BASE_URL = rawBase.replace(/\/+$/, ""); 

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") return { statusCode: 405, body: "" };

    const body = JSON.parse(event.body || "{}");
    const { subscription, wakeAtIso, tag, gcAfterMs = 10800000 } = body;
    if (!subscription || !wakeAtIso) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "missing subscription or wakeAtIso" }),
      };
    }

    const baseUrl =
      process.env.SITE_URL ||
      process.env.URL ||
      process.env.DEPLOY_PRIME_URL ||
      "";

    const sendUrl = `${baseUrl.replace(/\/$/, "")}/.netlify/functions/send`;
    const cancelUrl = `${baseUrl.replace(/\/$/, "")}/.netlify/functions/cancel`;

    const publishResp = await fetch(
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

    const publishJson = await publishResp.json().catch(() => ({}));
    if (!publishResp.ok) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "qstash publish failed",
          details: publishJson,
        }),
      };
    }
    const messageId = publishJson.messageId;

    const gcResp = await fetch(
      `https://qstash.upstash.io/v2/publish/${encodeURIComponent(cancelUrl)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.QSTASH_TOKEN}`,
          "Content-Type": "application/json",
          "Upstash-Delay": `${Math.max(0, Math.floor(gcAfterMs / 1000))}s`,
        },
        body: JSON.stringify({ messageId }),
      }
    );
    const gcJson = await gcResp.json().catch(() => ({}));
    if (!gcResp.ok) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "qstash gc publish failed",
          details: gcJson,
        }),
      };
    }

    return {
      statusCode: 202,
      body: JSON.stringify({ messageId, gcMessageId: gcJson.messageId }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "schedule exception", details: String(e) }),
    };
  }
};

