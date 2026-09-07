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
  const personality = makePersonality(profile);
  const text = message.toLowerCase();

  let reply;

  if (!message) {
    reply = "I'm listening, girl 💗";
  } else if (text.includes("hello") || text.includes("hi")) {
    reply = `Heyyy ${personality.name}! 💗 I'm here. What's on your mind?`;
  } else if (
    text.includes("study") ||
    text.includes("homework") ||
    text.includes("exam")
  ) {
    reply =
      "Absolutely 📚💗 Tell me the subject and topic, and we'll work through it step by step.";
  } else if (
    text.includes("sad") ||
    text.includes("upset") ||
    text.includes("bad day")
  ) {
    reply =
      "Aww, I'm here with you 💗 You don't have to explain everything perfectly. Tell me what happened.";
  } else if (
    text.includes("advice") ||
    text.includes("problem")
  ) {
    reply =
      "Okay girl, I'm listening. 💗 Tell me what happened, and we'll think through your options together.";
  } else {
    reply =
      "I'm here, girl 💗 Tell me more. I want to understand what's going on.";
  }

  // Small personality adjustments
  if (personality.style.includes("Straightforward")) {
    reply = reply.replace("Aww, ", "");
  }

  if (
    personality.emoji === "None" ||
    personality.emoji === "None "
  ) {
    reply = reply.replace(/[💗✨😭📚💡🎀🌸🫶😂😌]/g, "");
  }

  return reply.trim();
}

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  if (req.method === "POST" && req.url === "/api/chat") {
    let body = "";

    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", () => {
      let data = {};

      try {
        data = JSON.parse(body);
      } catch {
        res.writeHead(400, {
          "Content-Type": "application/json"
        });

        return res.end(
          JSON.stringify({
            error: "Invalid JSON"
          })
        );
      }

      const message = String(data.message || "").trim();
      const profile = data.profile || {};

      console.log("Message received:", message);
      console.log("Girl profile:", profile);

      const reply = createReply(message, profile);

      res.writeHead(200, {
        "Content-Type": "application/json"
      });

      res.end(
        JSON.stringify({
          reply
        })
      );
    });

    return;
  }

  res.writeHead(404, {
    "Content-Type": "application/json"
  });

  res.end(
    JSON.stringify({
      error: "Not found"
    })
  );
});

server.listen(PORT, () => {
  console.log(
    `Your Other Girl backend running on port ${PORT}`
  );
});
