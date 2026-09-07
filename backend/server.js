const http = require("http");

const PORT = process.env.PORT || 8787;

function makePersonality(profile) {
  const vibes = Array.isArray(profile.vibes)
    ? profile.vibes.join(", ")
    : "";

  const style = profile.style || "";
  const emoji = profile.emoji || "";
  const custom = profile.custom || "";

  return {
    name: profile.name || "girl",
    vibes,
    style,
    emoji,
    custom
  };
}

function createReply(message, profile) {
  const text = message.toLowerCase().trim();
  const personality = makePersonality(profile || {});
  const name = personality.name;

  if (
    text === "hello" ||
    text === "hi" ||
    text === "hey" ||
    text === "heyy" ||
    text === "hey girl"
  ) {
    return `Heyyy ${name}! 💗 I'm here. What's on your mind?`;
  }

  if (
    text.includes("how are you") ||
    text.includes("how r you") ||
    text.includes("how are u")
  ) {
    return `I'm here, girl 💗 Tell me more. I want to understand what's going on.`;
  }

  if (
    text.includes("need advice") ||
    text.includes("give me advice") ||
    text.includes("i need help")
  ) {
    return `Okay girl, I'm listening. 💗 Tell me what happened, and we'll think through your options together.`;
  }

  if (
    text.includes("need to vent") ||
    text.includes("i want to vent") ||
    text.includes("let me vent") ||
    text.includes("vent")
  ) {
    return `Of course. 💗 You can get it all out. I'm listening, and I won't rush you.`;
  }

  if (
    text.includes("make a plan") ||
    text.includes("help me plan") ||
    text.includes("plan for")
  ) {
    return `Absolutely 💗 Tell me what you're trying to accomplish, and we'll break it into simple steps.`;
  }

  if (
    text.includes("sad") ||
    text.includes("upset") ||
    text.includes("stressed") ||
    text.includes("overwhelmed")
  ) {
    return `I'm sorry you're feeling this way, ${name}. 💗 Tell me what's been going on, and we can take it one step at a time.`;
  }

  if (
    text.includes("happy") ||
    text.includes("excited") ||
    text.includes("good news")
  ) {
    return `Awww, I love that for you! 💗 Tell me what happened!`;
  }

  if (text === "ok" || text === "okay" || text === "k") {
    return `Okayyy 💗 I'm still here if you want to talk.`;
  }

  return `I'm listening, ${name}. 💗 Tell me a little more about that, and I'll help however I can.`;
}

function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });

  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    });

    res.end();
    return;
  }

  // Health check
  if (req.method === "GET" && req.url === "/") {
    sendJSON(res, 200, {
      status: "Your Other Girl backend is running 💗"
    });
    return;
  }

  // Chat endpoint
  if (req.method === "POST" && req.url === "/api/chat") {
    let body = "";

    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const data = JSON.parse(body);

        const message =
          typeof data.message === "string"
            ? data.message.trim()
            : "";

        const profile = data.profile || {};

        if (!message) {
          sendJSON(res, 400, {
            error: "Please enter a message."
          });
          return;
        }

        const reply = createReply(message, profile);

        sendJSON(res, 200, {
          reply
        });
      } catch (error) {
        console.error("Request error:", error);

        sendJSON(res, 400, {
          error: "Invalid request."
        });
      }
    });

    return;
  }

  sendJSON(res, 404, {
    error: "Not found."
  });
});

server.listen(PORT, () => {
  console.log(`Your Other Girl backend running on port ${PORT}`);
});
