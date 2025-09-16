exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") return { statusCode: 405, body: "" };

    const body = JSON.parse(event.body || "{}");
    const { messageId } = body;
    if (!messageId) return { statusCode: 400, body: JSON.stringify({ error: "missing messageId" }) };

    const resp = await fetch(
      `https://qstash.upstash.io/v2/messages/${encodeURIComponent(messageId)}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${process.env.QSTASH_TOKEN}` },
      }
    );
    const txt = await resp.text();
    if (!resp.ok) {
      return { statusCode: 502, body: JSON.stringify({ error: "qstash cancel failed", details: txt }) };
    }
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: "cancel exception", details: String(e) }) };
  }
};
