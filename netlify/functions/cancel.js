module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") return res.status(405).end();
    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body || "{}")
        : req.body || {};
    const { messageId } = body;
    if (!messageId) return res.status(400).json({ error: "missing messageId" });

    const resp = await fetch(
      `https://qstash.upstash.io/v2/messages/${encodeURIComponent(messageId)}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${process.env.QSTASH_TOKEN}` },
      }
    );
    if (!resp.ok) {
      const txt = await resp.text();
      return res
        .status(500)
        .json({ error: "qstash cancel failed", details: txt });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res
      .status(500)
      .json({ error: "cancel exception", details: String(e) });
  }
};
