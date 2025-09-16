const QSTASH_TOKEN = process.env.QSTASH_TOKEN;
const rawBase =
  process.env.SITE_URL || process.env.URL || process.env.DEPLOY_PRIME_URL || "";
const BASE_URL = rawBase.replace(/\/+$/, ""); 

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405 };
  try {
    const {
      subscription,
      wakeAtIso,
      tag,
      gcAfterMs = 10800000,
    } = JSON.parse(event.body || "{}");
    if (!subscription || !wakeAtIso)
      return {
        statusCode: 400,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ error: "missing subscription or wakeAtIso" }),
      };

    const sendUrl = `${BASE_URL}/.netlify/functions/send`;
    const cancelUrl = `${BASE_URL}/.netlify/functions/cancel`;

    const pubResp = await fetch(
      `https://qstash.upstash.io/v2/publish/${encodeURIComponent(sendUrl)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${QSTASH_TOKEN}`,
          "Content-Type": "application/json",
          "Upstash-Schedule": new Date(wakeAtIso).toISOString(),
        },
        body: JSON.stringify({ subscription, tag }),
      }
    );
    const pubJson = await pubResp.json();
    if (!pubResp.ok)
      return {
        statusCode: 500,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          error: "qstash publish failed",
          details: pubJson,
        }),
      };
    const messageId = pubJson.messageId;

    const gcResp = await fetch(
      `https://qstash.upstash.io/v2/publish/${encodeURIComponent(cancelUrl)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${QSTASH_TOKEN}`,
          "Content-Type": "application/json",
          "Upstash-Delay": `${Math.max(0, Math.floor(gcAfterMs / 1000))}s`,
        },
        body: JSON.stringify({ messageId }),
      }
    );
    const gcJson = await gcResp.json();
    if (!gcResp.ok)
      return {
        statusCode: 500,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          error: "qstash gc publish failed",
          details: gcJson,
        }),
      };

    return {
      statusCode: 202,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ messageId, gcMessageId: gcJson.messageId }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "schedule exception", details: String(e) }),
    };
  }
};
