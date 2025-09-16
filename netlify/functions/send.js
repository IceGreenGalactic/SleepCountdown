const webpush = require("web-push");

webpush.setVapidDetails(
  "mailto:admin@example.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") return res.status(405).end();
    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body || "{}")
        : req.body || {};
    const { subscription, tag } = body || {};
    if (!subscription)
      return res.status(400).json({ error: "missing subscription" });

    const payload = JSON.stringify({
      title: "Tid for oppvåkning",
      body: "Barn skal vekkes nå",
      tag: tag || "wake-generic",
    });

    await webpush.sendNotification(subscription, payload, { TTL: 600 });
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: "push failed", details: String(e) });
  }
};
