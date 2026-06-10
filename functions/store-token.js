const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  const store = getStore("fcm-tokens");

  // GET — retrieve tokens for a school
  if (event.httpMethod === "GET") {
    const school = event.queryStringParameters?.school || "all";
    try {
      const existing = await store.get("tokens", { type: "json" }).catch(() => ({}));
      const allTokens = existing || {};
      let tokens = [];
      if (school === "all") {
        tokens = Object.values(allTokens).flat();
      } else {
        tokens = allTokens[school] || [];
      }
      // Deduplicate
      tokens = [...new Set(tokens)];
      return { statusCode: 200, headers, body: JSON.stringify({ tokens }) };
    } catch (e) {
      return { statusCode: 200, headers, body: JSON.stringify({ tokens: [] }) };
    }
  }

  // POST — store a token
  if (event.httpMethod === "POST") {
    const { token, school } = JSON.parse(event.body || "{}");
    if (!token || !school) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Missing token or school" }) };
    }
    try {
      const existing = await store.get("tokens", { type: "json" }).catch(() => ({}));
      const allTokens = existing || {};
      if (!allTokens[school]) allTokens[school] = [];
      if (!allTokens[school].includes(token)) {
        allTokens[school].push(token);
      }
      await store.setJSON("tokens", allTokens);
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    } catch (e) {
      console.error("Store error:", e);
      return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
    }
  }

  return { statusCode: 405, headers, body: "Method not allowed" };
};
