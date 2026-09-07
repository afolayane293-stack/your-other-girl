const http = require("http");

const PORT = process.env.PORT || 8787;

const server = http.createServer((req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  // Browser preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  // Chat endpoint
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

      /*
        For now, we are NOT calling an AI API.
        This lets us safely build the personality system first.
      */

      let reply = "I'm here, girl 💗 Tell me what's on your mind.";

      if (!message) {
        reply = "I'm listening 💗";
      }

      if (message.toLowerCase().includes("hello")) {
        reply = "Heyyy girl 💗 I'm here. What's going on?";
      }

      if (message.toLowerCase().includes("study")) {
        reply = "Absolutely 📚💗 Tell me what you're studying and we'll work through it together.";
      }

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

  // Everything else
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
  console.log(`Your Other Girl backend running on port ${PORT}`);
});
