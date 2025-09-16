module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") return res.status(405).end();
    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body || "{}")
        : req.body || {};
    const { subscription, wakeAtIso, tag, gcAfterMs = 10800000 } = body;
    if (!subscription || !wakeAtIso)
      return res
        .status(400)
        .json({ error: "missing subscription or wakeAtIso" });

    const baseUrl =
      process.env.SITE_URL ||
      process.env.URL ||
      process.env.DEPLOY_PRIME_URL ||
      "";
    const sendUrl = `${baseUrl}/.netlify/functions/send`;
    const cancelUrl = `${baseUrl}/.netlify/functions/cancel`;

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
    const publishJson = await publishResp.json();
    if (!publishResp.ok)
      return res
        .status(500)
        .json({ error: "qstash publish failed", details: publishJson });
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
    const gcJson = await gcResp.json();
    if (!gcResp.ok)
      return res
        .status(500)
        .json({ error: "qstash gc publish failed", details: gcJson });

    return res.status(202).json({ messageId, gcMessageId: gcJson.messageId });
  } catch (e) {
    return res
      .status(500)
      .json({ error: "schedule exception", details: String(e) });
  }
};
