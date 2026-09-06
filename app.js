// YOUR OTHER GIRL 💗
// Clean front-end version

const state = JSON.parse(localStorage.getItem("yog_state") || "{}");

function saveState() {
  localStorage.setItem("yog_state", JSON.stringify(state));
}

function $(selector) {
  return document.querySelector(selector);
}

function $$(selector) {
  return Array.from(document.querySelectorAll(selector));
}

// ---------- NAVIGATION ----------

function go(id) {
  const screen = document.getElementById(id);

  if (!screen) {
    console.error("Screen not found:", id);
    return;
  }

  $$(".screen").forEach(section => {
    section.classList.remove("active");
  });

  screen.classList.add("active");

  if (id === "home") renderHome();
  if (id === "profile") renderProfile();
  if (id === "customize") renderCustomize();
}

// ---------- WELCOME / NAV BUTTONS ----------

$$("[data-go]").forEach(button => {
  button.addEventListener("click", function () {
    go(this.dataset.go);
  });
});

// ---------- CUSTOMIZE ----------

const vibes = [
  "🎀 Girly Girl",
  "🖤 Goth",
  "🧸 Soft & Cozy",
  "💅 Confident & Sassy",
  "😂 Funny & Chaotic",
  "📚 Smart & Focused",
  "🌿 Calm & Peaceful",
  "🪩 Energetic & Bubbly",
  "🌙 Quiet & Mysterious",
  "✨ Custom"
];

const styles = [
  "💗 Sweet & gentle",
  "🎯 Straightforward",
  "😂 Funny",
  "🌟 Motivational",
  "😌 Chill",
  "💅 A little sassy",
  "✨ Mix it up"
];

const emojiLevels = [
  "Lots 💗✨😭",
  "Sometimes",
  "None"
];

const studyModes = [
  "🌱 Beginner",
  "📚 Standard",
  "🔥 Exam Mode",
  "🧠 Challenge Me"
];

function renderChoices(id, items, key, multiple = false) {
  const box = $(id);

  if (!box) return;

  box.innerHTML = "";

  items.forEach(item => {
    const button = document.createElement("button");

    button.textContent = item;

    const selected = Array.isArray(state[key])
      ? state[key].includes(item)
      : false;

    if (selected) {
      button.classList.add("selected");
    }

    button.addEventListener("click", function () {
      if (!Array.isArray(state[key])) {
        state[key] = [];
      }

      if (multiple) {
        if (state[key].includes(item)) {
          state[key] = state[key].filter(x => x !== item);
        } else {
          state[key].push(item);
        }
      } else {
        state[key] = [item];
      }

      saveState();
      renderChoices(id, items, key, multiple);
    });

    box.appendChild(button);
  });
}

function renderCustomize() {
  renderChoices("#vibes", vibes, "vibes", true);
  renderChoices("#styles", styles, "style");
  renderChoices("#emoji", emojiLevels, "emoji");

  if ($("#girlName")) {
    $("#girlName").value = state.name || "";
  }

  if ($("#custom")) {
    $("#custom").value = state.custom || "";
  }
}

renderCustomize();

// SAVE PROFILE

if ($("#saveProfile")) {
  $("#saveProfile").addEventListener("click", function () {
    state.name = $("#girlName").value.trim();
    state.custom = $("#custom").value.trim();

    saveState();

    go("home");
  });
}

// ---------- HOME ----------

function renderHome() {
  const hour = new Date().getHours();

  let greeting;

  if (hour < 12) {
    greeting = "Good morning";
  } else if (hour < 18) {
    greeting = "Good afternoon";
  } else {
    greeting = "Good evening";
  }

  if ($("#greeting")) {
    $("#greeting").textContent =
      greeting + ", " + (state.name || "girl") + " 💗";
  }

  if ($("#mood")) {
    $("#mood").textContent = state.mood
      ? "Today you said: " + state.mood + " 💗"
      : "";
  }

  renderPlans();
}

function renderPlans() {
  const plans = $("#plans");

  if (!plans) return;

  const items = state.plans || [];

  if (items.length === 0) {
    plans.innerHTML = "<p>No plans yet.</p>";
    return;
  }

  plans.innerHTML = "";

  items.forEach(item => {
    const p = document.createElement("p");
    p.textContent = "☐ " + item;
    plans.appendChild(p);
  });
}

// MOODS

if ($("#moods")) {
  const moods = [
    ["😊", "Great"],
    ["🙂", "Okay"],
    ["😐", "Meh"],
    ["😔", "Not great"],
    ["😭", "Rough day"]
  ];

  $("#moods").innerHTML = "";

  moods.forEach(([emoji, name]) => {
    const button = document.createElement("button");

    button.textContent = emoji;

    button.addEventListener("click", function () {
      state.mood = name;
      saveState();
      renderHome();
    });

    $("#moods").appendChild(button);
  });
}

// ADD PLAN

if ($("#addPlan")) {
  $("#addPlan").addEventListener("click", function () {
    const plan = prompt("What do you want to add to your day?");

    if (!plan || !plan.trim()) return;

    if (!Array.isArray(state.plans)) {
      state.plans = [];
    }

    state.plans.push(plan.trim());

    saveState();
    renderPlans();
  });
}

// ---------- PROFILE ----------

function renderProfile() {
  if ($("#profileName")) {
    $("#profileName").textContent =
      state.name || "Your Other Girl";
  }

  if ($("#profileVibe")) {
    $("#profileVibe").textContent =
      (state.vibes || []).join(" • ") ||
      "Your pocket girl is here.";
  }
}

// ---------- CHAT ----------

function addMessage(type, text) {
  const messages = $("#messages");

  if (!messages) return;

  const message = document.createElement("div");

  message.className = "msg " + type;
  message.textContent = text;

  messages.appendChild(message);
  messages.scrollTop = messages.scrollHeight;
}

function sendMessage() {
  const input = $("#message");

  if (!input) return;

  const text = input.value.trim();

  if (!text) return;

  addMessage("you", text);

  input.value = "";

  setTimeout(function () {
    addMessage(
      "girl",
      "I'm here, girl 💗 Tell me more. Do you want me to just listen, help you understand, or help you figure out what to do?"
    );
  }, 400);
}

if ($("#send")) {
  $("#send").addEventListener("click", sendMessage);
}

if ($("#message")) {
  $("#message").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  });
}

$$("[data-starter]").forEach(button => {
  button.addEventListener("click", function () {
    if ($("#message")) {
      $("#message").value = this.dataset.starter;
      sendMessage();
    }
  });
});

// ---------- STUDY ----------

$$("[data-study]").forEach(button => {
  button.addEventListener("click", function () {
    const box = $("#studyBox");

    if (!box) return;

    box.classList.remove("hidden");

    box.innerHTML = "";

    const title = document.createElement("h3");
    title.textContent = this.dataset.study + " 💗";

    const text = document.createElement("p");
    text.textContent =
      "Tell me the subject, topic and what you need help with.";

    const input = document.createElement("textarea");
    input.id = "studyText";
    input.placeholder = "Type here...";

    const ask = document.createElement("button");
    ask.className = "primary";
    ask.textContent = "Ask my pocket girl →";

    ask.addEventListener("click", function () {
      const request = input.value.trim();

      if (!request) {
        box.innerHTML =
          "<h3>Tell me a little more 💗</h3><p>Type the subject and topic you need help with.</p>";
        return;
      }

      box.innerHTML =
        "<h3>Study help 💗</h3>" +
        "<p>Let's work through <b>" +
        escapeHTML(request) +
        "</b> step by step. 📚</p>";
    });

    box.appendChild(title);
    box.appendChild(text);
    box.appendChild(input);
    box.appendChild(ask);
  });
});

// STUDY MODES

renderChoices("#modes", studyModes, "studyMode");

// ---------- TOOLS ----------

const toolNames = {
  journal: "📔 Journal",
  todo: "📝 To-do list",
  planner: "📅 Planner",
  goals: "🎯 Goals",
  routine: "⏰ Routines",
  brain: "💡 Brain dump"
};

$$("[data-tool]").forEach(button => {
  button.addEventListener("click", function () {
    openTool(this.dataset.tool);
  });
});

function openTool(tool) {
  const box = $("#toolBox");

  if (!box) return;

  box.classList.remove("hidden");

  box.innerHTML = "";

  const title = document.createElement("h3");
  title.textContent = toolNames[tool] || "✨ Tool";

  const textarea = document.createElement("textarea");
  textarea.id = "toolText";
  textarea.placeholder = "Write here...";

  if (state.tools && state.tools[tool]) {
    textarea.value = state.tools[tool];
  }

  const saveButton = document.createElement("button");
  saveButton.className = "primary";
  saveButton.textContent = "Save";

  saveButton.addEventListener("click", function () {
    if (!state.tools) {
      state.tools = {};
    }

    state.tools[tool] = textarea.value;

    saveState();

    alert("Saved on this device 💗");
  });

  box.appendChild(title);
  box.appendChild(textarea);
  box.appendChild(saveButton);
}

// ---------- PROBLEMS ----------

$$("[data-problem]").forEach(button => {
  button.addEventListener("click", function () {
    const box = $("#problemBox");

    if (!box) return;

    box.innerHTML = "";

    const card = document.createElement("div");
    card.className = "card";

    const title = document.createElement("b");
    title.textContent = this.dataset.problem;

    const text = document.createElement("p");
    text.textContent =
      "I'm listening. 💗 Do you want me to just listen, help you understand, or help you think through what to do?";

    const talk = document.createElement("button");
    talk.textContent = "Talk to me →";

    talk.addEventListener("click", function () {
      go("chat");
    });

    card.appendChild(title);
    card.appendChild(text);
    card.appendChild(talk);

    box.appendChild(card);
  });
});

// ---------- MODALS ----------

function showModal(content) {
  const modal = $("#modal");

  if (!modal) return;

  modal.classList.remove("hidden");

  modal.innerHTML =
    '<div class="modalbox">' +
    content +
    "</div>";
}

function closeModal() {
  if ($("#modal")) {
    $("#modal").classList.add("hidden");
  }
}

function clearSavedData() {
  localStorage.removeItem("yog_state");
  location.reload();
}

if ($("#privacy")) {
  $("#privacy").addEventListener("click", function () {
    showModal(
      "<h2>🔒 Private Girl Mode</h2>" +
      "<p>Your Other Girl should keep personal content private. This prototype stores your notes locally on this device.</p>" +
      "<button onclick='closeModal()'>Close</button>"
    );
  });
}

if ($("#memory")) {
  $("#memory").addEventListener("click", function () {
    showModal(
      "<h2>🧠 What does she remember?</h2>" +
      "<p>This prototype remembers your selected preferences and notes on this device.</p>" +
      "<button onclick='clearSavedData()'>Delete my saved data</button> " +
      "<button onclick='closeModal()'>Close</button>"
    );
  });
}

if ($("#premium")) {
  $("#premium").addEventListener("click", function () {
    showModal(
      "<h2>💎 Premium</h2>" +
      "<p><b>No advertisements at all.</b></p>" +
      "<p>Advanced features can be optional. Your core Your Other Girl experience does not need Premium.</p>" +
      "<button onclick='closeModal()'>Close</button>"
    );
  });
}

if ($("#about")) {
  $("#about").addEventListener("click", function () {
    showModal(
      "<h2>Your Other Girl 💗</h2>" +
      "<p>I'm your pocket girl — here to help you talk, study, organise and work through everyday problems.</p>" +
      "<button onclick='closeModal()'>Close</button>"
    );
  });
}

window.closeModal = closeModal;
window.clearSavedData = clearSavedData;

// ---------- HELPERS ----------

function escapeHTML(text) {
  return String(text).replace(/[&<>"']/g, function (character) {
    const characters = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };

    return characters[character];
  });
}

// ---------- START APP ----------

renderHome();
renderProfile();
go("welcome");
