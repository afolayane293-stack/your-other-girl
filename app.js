async function sendMessage() {
  const input = $("#message");

  if (!input) return;

  const text = input.value.trim();

  if (!text) return;

  addMessage("you", text);
  input.value = "";

  addMessage("girl", "Thinking... 💗");

  try {
    const response = await fetch(
      (window.YOG_API || "https://your-other-girl.onrender.com") + "/api/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: text
        })
      }
    );

    const data = await response.json();

    const messages = $("#messages");
    const lastGirlMessage = messages?.querySelector(".msg.girl:last-child");

    if (lastGirlMessage) {
      lastGirlMessage.textContent =
        data.reply || "I couldn't get a reply right now. 💗";
    }

  } catch (error) {
    console.error(error);

    const messages = $("#messages");
    const lastGirlMessage = messages?.querySelector(".msg.girl:last-child");

    if (lastGirlMessage) {
      lastGirlMessage.textContent =
        "I couldn't connect to my AI brain right now. 💗";
    }
  }
}
