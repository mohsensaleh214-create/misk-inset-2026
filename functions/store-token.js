const SITE_ID = "1aefefd7-9bc6-4af5-8384-9ea6f936f72b";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

async function getTokens(authToken) {
  const url = `https://api.netlify.com/api/v1/sites/${SITE_ID}/blobs/fcm-tokens`;
  const resp = await fetch(url, {
    headers: { "Authorization": `Bearer ${authToken}` }
  });
  if (!resp.ok) return {};
  const text = await resp.text();
  try { return JSON.parse(text); } catch(e) { return {}; }
}

async function saveTokens(authToken, data) {
  const url = `https://api.netlify.com/api/v1/sites/${SITE_ID}/blobs/fcm-tokens`;
  await fetch(url, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${authToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  const authToken = process.env.NETLIFY_AUTH_TOKEN;
  if (!authToken) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: "NETLIFY_AUTH_TOKEN not set" }) };
  }

  if (event.httpMethod === "GET") {
    const school = event.queryStringParameters?.school || "all";
    try {
      const allTokens = await getTokens(authToken);
      let tokens = school === "all"
        ? Object.values(allTokens).flat()
        : (allTokens[school] || []);
      tokens = [...new Set(tokens)];
      return { statusCode: 200, headers, body: JSON.stringify({ tokens }) };
    } catch(e) {
      return { statusCode: 200, headers, body: JSON.stringify({ tokens: [] }) };
    }
  }

  if (event.httpMethod === "POST") {
    const { token, school } = JSON.parse(event.body || "{}");
    if (!token || !school) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Missing token or school" }) };
    }
    try {
      const allTokens = await getTokens(authToken);
      if (!allTokens[school]) allTokens[school] = [];
      if (!allTokens[school].includes(token)) allTokens[school].push(token);
      await saveTokens(authToken, allTokens);
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    } catch(e) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
    }
  }

  return { statusCode: 405, headers, body: "Method not allowed" };
};
