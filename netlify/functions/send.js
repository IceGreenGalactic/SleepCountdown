const webpush = require("web-push");

webpush.setVapidDetails(
  "mailto:admin@example.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") return { statusCode: 405, body: "" };

    const body = JSON.parse(event.body || "{}");
    const { subscription, tag } = body || {};
    if (!subscription) return { statusCode: 400, body: JSON.stringify({ error: "missing subscription" }) };

    const payload = JSON.stringify({
      title: "Tid for oppvåkning",
      body: "Barn skal vekkes nå",
      tag: tag || "wake-generic",
    });

    await webpush.sendNotification(subscription, payload, { TTL: 600 });
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: "push failed", details: String(e) }) };
  }
};
