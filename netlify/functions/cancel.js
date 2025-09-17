const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
};

exports.handler = async (event) => {
  try {
    if (event.httpMethod === "OPTIONS")
      return { statusCode: 204, headers: CORS, body: "" };
    if (event.httpMethod !== "POST")
      return { statusCode: 405, headers: CORS, body: "" };

    if (!process.env.QSTASH_TOKEN) {
      return {
        statusCode: 500,
        headers: CORS,
        body: JSON.stringify({ error: "QSTASH_TOKEN missing" }),
      };
    }

    const body = JSON.parse(event.body || "{}");
    const { messageId } = body;
    if (!messageId) {
      return {
        statusCode: 400,
        headers: CORS,
        body: JSON.stringify({ error: "missing messageId" }),
      };
    }

    const resp = await fetch(
      `https://qstash.upstash.io/v2/messages/${encodeURIComponent(messageId)}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${process.env.QSTASH_TOKEN}` },
      }
    );

    if (!resp.ok) {
      const txt = await resp.text();
      return {
        statusCode: 502,
        headers: CORS,
        body: JSON.stringify({ error: "qstash cancel failed", details: txt }),
      };
    }

    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({ ok: true }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ error: "cancel exception", details: String(e) }),
    };
  }
};
