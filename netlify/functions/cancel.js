const QSTASH_TOKEN = process.env.QSTASH_TOKEN;

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405 };
  try {
    const { messageId } = JSON.parse(event.body || "{}");
    if (!messageId)
      return {
        statusCode: 400,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ error: "missing messageId" }),
      };

    const resp = await fetch(
      `https://qstash.upstash.io/v2/messages/${encodeURIComponent(messageId)}`,
      { method: "DELETE", headers: { Authorization: `Bearer ${QSTASH_TOKEN}` } }
    );

    if (!resp.ok) {
      const txt = await resp.text();
      return {
        statusCode: 500,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ error: "qstash cancel failed", details: txt }),
      };
    }

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ok: true }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "cancel exception", details: String(e) }),
    };
  }
};
