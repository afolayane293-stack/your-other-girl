const http = require("http");
const OpenAI = require("openai");

const PORT = process.env.PORT || 8787;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

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

function makeInstructions(profile) {
  const personality = makePersonality(profile);

  return `
You are Your Other Girl, a friendly AI assistant designed to help with everyday conversations, studying, planning, and problems.

The user's chosen personality settings are:

Name: ${personality.name}
Vibes: ${personality.vibes || "not specified"}
Talking style: ${personality.style || "not specified"}
Emoji level: ${personality.emoji || "not specified"}
Custom personality: ${personality.custom || "not specified"}

Use these preferences to shape your tone naturally.

Be warm, supportive, clear, and honest.
Do not pretend to be a human.
Do not claim to have feelings or experiences you do not have.
When helping with schoolwork, explain things clearly and step by step.
When the user asks for advice, help them think through their options rather than making every decision for them.
Keep responses appropriate for a teenage user.

If the user chooses "Straightforward", be direct and avoid unnecessary fluff.
If the user chooses "Funny", you can use light humor when appropriate.
If the user chooses "Sweet & gentle", use a softer supportive tone.
If the user chooses "Motivational", encourage the user without making unrealistic promises.

Respect the selected emoji preference.
`;
}

async function createReply(message, profile) {
  const instructions = makeInstructions(profile);

  const response = await client.responses.create({
    model: "gpt-5.4-mini",
    instructions,
    input: message
  });

  return response.output_text ||
    "I'm here, girl 💗 I couldn't generate a reply right now.";
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

    req.on("end", async () => {
      let data = {};

      try {
        data = JSON.parse(body);
      } catch {
        res.writeHead(400, {
          "Content-Type": "application/json"
        });

        return res.end(JSON.stringify({
          error: "Invalid JSON"
        }));
      }

      const message = String(data.message || "").trim();
      const profile = data.profile || {};

      if (!message) {
        res.writeHead(400, {
          "Content-Type": "application/json"
        });

        return res.end(JSON.stringify({
          error: "Message is required"
        }));
      }

      console.log("Message received:", message);
      console.log("Girl profile:", profile);

      try {
        const reply = await createReply(message, profile);

        res.writeHead(200, {
          "Content-Type": "application/json"
        });

        return res.end(JSON.stringify({
          reply
        }));

      } catch (error) {
        console.error("OpenAI error:", error);

        res.writeHead(500, {
          "Content-Type": "application/json"
        });

        return res.end(JSON.stringify({
          error: "AI request failed"
        }));
      }
    });

    return;
  }

  res.writeHead(404, {
    "Content-Type": "application/json"
  });

  res.end(JSON.stringify({
    error: "Not found"
  }));
});

server.listen(PORT, () => {
  console.log(
    `Your Other Girl backend running on port ${PORT}`
  );
});
