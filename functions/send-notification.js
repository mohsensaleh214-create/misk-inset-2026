const { GoogleAuth } = require('google-auth-library');

const ADMIN_KEY = "misk-admin-2026";
const PROJECT_ID = "misk-inset-2026";

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  let body;
  try { body = JSON.parse(event.body); }
  catch (e) { return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) }; }

  const { adminKey, school, message, tokens } = body;

  if (adminKey !== ADMIN_KEY) {
    return { statusCode: 403, body: JSON.stringify({ error: "Unauthorised" }) };
  }
  if (!message || !tokens || tokens.length === 0) {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing message or tokens" }) };
  }

  // Credentials from Netlify environment variable — never in code
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

  try {
    const auth = new GoogleAuth({
      credentials: serviceAccount,
      scopes: ["https://www.googleapis.com/auth/firebase.messaging"],
    });
    const accessToken = await auth.getAccessToken();

    const results = await Promise.allSettled(
      tokens.map(token =>
        fetch(`https://fcm.googleapis.com/v1/projects/${PROJECT_ID}/messages:send`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: {
              token,
              notification: { title: "Misk Schools — INSET 2026", body: message },
              webpush: {
                notification: {
                  title: "Misk Schools — INSET 2026",
                  body: message,
                  icon: "/icon-192.png",
                  tag: "misk-inset",
                  renotify: true,
                  vibrate: [200, 100, 200],
                }
              }
            }
          })
        }).then(r => r.json())
      )
    );

    const sent = results.filter(r => r.status === "fulfilled").length;
    const failed = results.filter(r => r.status === "rejected").length;
    return { statusCode: 200, headers: {"Content-Type":"application/json"}, body: JSON.stringify({ success: true, sent, failed }) };

  } catch (err) {
    console.error("FCM error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
