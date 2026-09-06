// YOUR OTHER GIRL 💗
// Frontend — navigation + customization + chat prototype

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

// =========================
// NAVIGATION
// =========================

function go(id) {
  const target = document.getElementById(id);

  if (!target) return;

  $$(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  target.classList.add("active");

  if (id === "home") renderHome();
  if (id === "profile") renderProfile();
  if (id === "customize") renderCustomize();
}

// Attach navigation
$$("[data-go]").forEach(button => {
  button.addEventListener("click", () => {
    go(button.dataset.go);
  });
});

// =========================
// MAKE HER YOURS 🎀
// =========================

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

const talkingStyles = [
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

function renderChoices(selector, items, key, multiple = false) {
  const container = $(selector);

  if (!container) return;

  container.innerHTML = "";

  const selectedValues = Array.isArray(state[key])
    ? state[key]
    : [];

  items.forEach(item => {
    const button = document.createElement("button");

    button.type = "button";
    button.textContent = item;

    if (selectedValues.includes(item)) {
      button.classList.add("selected");
    }

    button.addEventListener("click", () => {

      if (multiple) {
        if (selectedValues.includes(item)) {
          state[key] = selectedValues.filter(value => value !== item);
        } else {
          state[key] = [...selectedValues, item];
        }
      } else {
        state[key] = [item];
      }

      saveState();

      // Re-render immediately so the selected option visibly changes
      renderChoices(selector, items, key, multiple);
    });

    container.appendChild(button);
  });
}

function renderCustomize() {
  renderChoices("#vibes", vibes, "vibes", true);
  renderChoices("#styles", talkingStyles, "style", false);
  renderChoices("#emoji", emojiLevels, "emoji", false);

  if ($("#girlName")) {
    $("#girlName").value = state.name || "";
  }

  if ($("#custom")) {
    $("#custom").value = state.custom || "";
  }
}

// Save customization
if ($("#saveProfile")) {
  $("#saveProfile").addEventListener("click", () => {

    state.name = $("#girlName").value.trim();
    state.custom = $("#custom").value.trim();

    saveState();

    alert("Your girl has been saved! 💗");

    go("home");
  });
}

// =========================
// HOME
// =========================

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
  const container = $("#plans");

  if (!container) return;

  const plans = state.plans || [];

  if (!plans.length) {
    container.innerHTML = "<p>No plans yet.</p>";
    return;
  }

  container.innerHTML = "";

  plans.forEach(plan => {
    const p = document.createElement("p");
    p.textContent = "☐ " + plan;
    container.appendChild(p);
  });
}

// =========================
// MOODS
// =========================

if ($("#moods")) {

  const moods = [
    ["😊", "Great"],
    ["🙂", "Okay"],
    ["😐", "Meh"],
    ["😔", "Not great"],
    ["😭", "Rough day"]
  ];

  $("#moods").innerHTML = "";

  moods.forEach(([emoji, mood]) => {

    const button = document.createElement("button");

    button.type = "button";
    button.textContent = emoji;

    button.addEventListener("click", () => {
      state.mood = mood;
      saveState();
      renderHome();
    });

    $("#moods").appendChild(button);
  });
}

// =========================
// ADD PLAN
// =========================

if ($("#addPlan")) {

  $("#addPlan").addEventListener("click", () => {

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

// =========================
// CHAT
// =========================

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

  setTimeout(() => {

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

  $("#message").addEventListener("keydown", event => {

    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }

  });
}

$$("[data-starter]").forEach(button => {

  button.addEventListener("click", () => {

    if ($("#message")) {
      $("#message").value = button.dataset.starter;
      sendMessage();
    }

  });

});

// =========================
// STUDY
// =========================

$$("[data-study]").forEach(button => {

  button.addEventListener("click", () => {

    const box = $("#studyBox");

    if (!box) return;

    box.classList.remove("hidden");

    box.innerHTML = `
      <h3>${button.dataset.study} 💗</h3>
      <p>Tell me the subject, topic and what you need help with.</p>
      <textarea id="studyText" placeholder="Type here..."></textarea>
      <button class="primary" id="askStudy">Ask my pocket girl →</button>
    `;

    $("#askStudy").addEventListener("click", () => {

      const text = $("#studyText").value.trim();

      if (!text) {
        box.innerHTML +=
          "<p>Please type what you want help with. 📚</p>";
        return;
      }

      box.innerHTML = `
        <h3>Study help 💗</h3>
        <p>
          I got you! 📚 You asked about:
          <b>${escapeHTML(text)}</b>
        </p>
        <p>
          The real AI study engine will be connected in the backend next.
        </p>
      `;
    });

  });

});

renderChoices("#modes", studyModes, "studyMode", false);

// =========================
// TOOLS
// =========================

const toolNames = {
  journal: "📔 Journal",
  todo: "📝 To-do list",
  planner: "📅 Planner",
  goals: "🎯 Goals",
  routine: "⏰ Routines",
  brain: "💡 Brain dump"
};

$$("[data-tool]").forEach(button => {

  button.addEventListener("click", () => {

    const box = $("#toolBox");

    if (!box) return;

    const tool = button.dataset.tool;

    box.classList.remove("hidden");

    box.innerHTML = `
      <h3>${toolNames[tool]}</h3>
      <textarea id="toolText" placeholder="Write here..."></textarea>
      <button class="primary" id="saveToolButton">Save</button>
    `;

    $("#toolText").value =
      (state.tools && state.tools[tool]) || "";

    $("#saveToolButton").addEventListener("click", () => {

      if (!state.tools) {
        state.tools = {};
      }

      state.tools[tool] = $("#toolText").value;

      saveState();

      alert("Saved on this device 💗");
    });

  });

});

// =========================
// PROBLEMS
// =========================

$$("[data-problem]").forEach(button => {

  button.addEventListener("click", () => {

    const box = $("#problemBox");

    if (!box) return;

    box.innerHTML = `
      <div class="card">
        <b>${button.dataset.problem}</b>
        <p>
          I'm listening. 💗 Do you want me to just listen,
          help you understand, or help you think through
          what to do?
        </p>
        <button id="problemTalk">Talk to me →</button>
      </div>
    `;

    $("#problemTalk").addEventListener("click", () => {
      go("chat");
    });

  });

});

// =========================
// PROFILE
// =========================

function renderProfile() {

  if ($("#profileName")) {
    $("#profileName").textContent =
      state.name || "Your Other Girl";
  }

  if ($("#profileVibe")) {

    const selectedVibes = state.vibes || [];

    $("#profileVibe").textContent =
      selectedVibes.length
        ? selectedVibes.join(" • ")
        : "Your pocket girl is here.";
  }
}

// =========================
// MODALS
// =========================

function showModal(html) {

  const modal = $("#modal");

  if (!modal) return;

  modal.classList.remove("hidden");

  modal.innerHTML = `
    <div class="modalbox">
      ${html}
    </div>
  `;
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

window.closeModal = closeModal;
window.clearSavedData = clearSavedData;

if ($("#privacy")) {

  $("#privacy").addEventListener("click", () => {

    showModal(`
      <h2>🔒 Private Girl Mode</h2>
      <p>
        Your Other Girl should keep personal content private.
        This prototype stores your information locally on this device.
      </p>
      <button onclick="closeModal()">Close</button>
    `);

  });

}

if ($("#memory")) {

  $("#memory").addEventListener("click", () => {

    showModal(`
      <h2>🧠 What does she remember?</h2>
      <p>
        Your selected preferences and notes are saved on this device.
      </p>
      <button onclick="clearSavedData()">Delete my saved data</button>
      <button onclick="closeModal()">Close</button>
    `);

  });

}

if ($("#premium")) {

  $("#premium").addEventListener("click", () => {

    showModal(`
      <h2>💎 Premium</h2>
      <p><b>No advertisements at all.</b></p>
      <p>
        Advanced features can be optional.
        Core help should remain useful without Premium.
      </p>
      <button onclick="closeModal()">Close</button>
    `);

  });

}

if ($("#about")) {

  $("#about").addEventListener("click", () => {

    showModal(`
      <h2>Your Other Girl 💗</h2>
      <p>
        I'm your pocket girl — here to help you talk,
        study, organise and work through everyday problems.
      </p>
      <button onclick="closeModal()">Close</button>
    `);

  });

}

// =========================
// SECURITY-SAFE HTML HELPER
// =========================

function escapeHTML(text) {

  return String(text).replace(/[&<>"']/g, character => {

    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };

    return map[character];
  });
}

// =========================
// START
// =========================

renderCustomize();
renderHome();
renderProfile();

go("welcome");
