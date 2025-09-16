const webpush = require("web-push");

webpush.setVapidDetails(
  "mailto:admin@example.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405 };
  try {
    const { subscription, tag } = JSON.parse(event.body || "{}");
    if (!subscription)
      return {
        statusCode: 400,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ error: "missing subscription" }),
      };

    const payload = JSON.stringify({
      title: "Tid for oppvåkning",
      body: "Barn skal vekkes nå",
      tag: tag || "wake-generic",
    });

    await webpush.sendNotification(subscription, payload, { TTL: 600 });

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ok: true }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "push failed", details: String(e) }),
    };
  }
};
