const http = require("http");

const PORT = process.env.PORT || 8787;

function makePersonality(profile) {
  const vibes = Array.isArray(profile.vibes)
    ? profile.vibes.join(", ")
    : "";

  return {
    name: profile.name || "girl",
    vibes,
    style: profile.style || "",
    emoji: profile.emoji || "",
    custom: profile.custom || ""
  };
}

function createReply(message, profile) {
  const text = message.toLowerCase().trim();
  const personality = makePersonality(profile || {});
  const name = personality.name;

  // =========================
  // GENERAL CHAT
  // =========================

  if (
    text === "hello" ||
    text === "hi" ||
    text === "hey" ||
    text === "heyy" ||
    text === "hey girl"
  ) {
    return `Hey ${name}! 💗 What's on your mind?`;
  }

  if (
    text.includes("how are you") ||
    text.includes("how r you") ||
    text.includes("how are u")
  ) {
    return `I'm here, girl 💗 Tell me what's going on.`;
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
    text === "vent"
  ) {
    return `Of course. 💗 Get it all out. I'm listening.`;
  }

  if (
    text.includes("make a plan") ||
    text.includes("help me plan")
  ) {
    return `Absolutely 💗 Tell me what you're trying to accomplish, and we'll break it into simple steps.`;
  }

  if (
    text.includes("sad") ||
    text.includes("upset") ||
    text.includes("stressed") ||
    text.includes("overwhelmed")
  ) {
    return `I'm sorry you're feeling this way, ${name}. 💗 Tell me what's been going on, and we'll take it one step at a time.`;
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

  // =========================
  // STUDY MODE
  // =========================

  if (
    text === "study" ||
    text === "let's study" ||
    text === "lets study"
  ) {
    return `Yesss, study time! 📚💗 What subject are we working on?`;
  }

  // QUIZ ME
  if (
    text.includes("quiz me") ||
    text.includes("quiz me on")
  ) {
    return `Absolutely! 📝💗 What subject and topic should I quiz you on? For example: "Government - Colonialism" or "Maths - Trigonometry".`;
  }

  // GOVERNMENT
  if (text === "government") {
    return `Government? Got you! 📚💗 What topic should we work on? Try "Colonialism", "Nationalism", "Constitution", or "Pre-colonial Yoruba administration".`;
  }

  if (
    text.includes("government") &&
    text.includes("colonial")
  ) {
    return `Okay! 🇳🇬📚 Let's quiz you on Colonialism.

Question 1:
What is colonialism?

A. The system where one country controls another territory
B. A system of electing a president
C. A form of traditional marriage
D. A type of economic market

Reply with A, B, C, or D. 💗`;
  }

  if (
    text.includes("government") &&
    text.includes("nationalism")
  ) {
    return `Let's work on Nationalism! 📚💗

Question 1:
What is nationalism?

A. Love and devotion to one's nation
B. The control of a country by another country
C. A type of court
D. A system of taxation

Reply with A, B, C, or D.`;
  }

  if (
    text.includes("government") &&
    text.includes("constitution")
  ) {
    return `Constitution time! 📚💗

Question 1:
What is a constitution?

A. A set of fundamental rules and principles by which a country is governed
B. A political party
C. A court judgment
D. A type of election

Reply with A, B, C, or D.`;
  }

  // =========================
  // MATHS
  // =========================

  if (text === "maths" || text === "math") {
    return `Maths? Let's gooo 🧮💗 What topic are we doing? Try Trigonometry, Bearings, Variance, Standard Deviation, or Surds.`;
  }

  if (
    text.includes("math") &&
    text.includes("trigonometry")
  ) {
    return `Trigonometry! 🧮💗

Question 1:
If sin θ = 3/5, what is the value of cos θ for an acute angle?

A. 2/5
B. 3/5
C. 4/5
D. 5/3

Reply with A, B, C, or D.`;
  }

  if (
    text.includes("math") &&
    text.includes("bearing")
  ) {
    return `Let's do Bearings! 🧭📚

Question 1:
Bearings are measured clockwise from which direction?

A. South
B. East
C. North
D. West

Reply with A, B, C, or D.`;
  }

  // =========================
  // ECONOMICS
  // =========================

  if (text === "economics" || text === "economic") {
    return `Economics? I got you! 📈💗 What topic? Try Market Failure, Money, Banks, Workers, Trade Unions, or Firms and Industries.`;
  }

  if (
    text.includes("economics") &&
    text.includes("market failure")
  ) {
    return `Let's do Market Failure! 📈💗

Question 1:
What is market failure?

A. When the market fails to allocate resources efficiently
B. When prices always increase
C. When a business makes a profit
D. When consumers stop buying food

Reply with A, B, C, or D.`;
  }

  // =========================
  // LITERATURE
  // =========================

  if (text === "literature" || text === "lit") {
    return `Literature time! 📖💗 What are we studying? You can tell me the book, play, poem, character, theme, or topic.`;
  }

  if (
    text.includes("inspector calls") ||
    text.includes("an inspector calls")
  ) {
    return `Let's work on *An Inspector Calls*! 📖💗

Question 1:
Who is the Inspector who visits the Birling family?

A. Inspector Goole
B. Inspector Smith
C. Inspector Evans
D. Inspector Wilson

Reply with A, B, C, or D.`;
  }

  // =========================
  // CIVIC EDUCATION
  // =========================

  if (
    text === "civic" ||
    text.includes("civic education")
  ) {
    return `Civic Education! 🇳🇬📚 What topic should we study? Try Democracy, Constitution, Federalism, Youth Empowerment, or Nationalism.`;
  }

  // =========================
  // HISTORY
  // =========================

  if (text === "history") {
    return `History time! 📚💗 What topic? Try the British conquest of Nigeria, Royal Niger Company, Benin, Aro Confederacy, Sokoto Caliphate, or Amalgamation of 1914.`;
  }

  // =========================
  // ICT
  // =========================

  if (
    text === "ict" ||
    text === "digital technology"
  ) {
    return `ICT time! 💻💗 What topic are we doing? Try Internet, WWW, Networking, Excel, Logic Circuits, or Java.`;
  }

  // =========================
  // STUDY ACTIONS
  // =========================

  if (
    text.includes("assignment") ||
    text.includes("homework")
  ) {
    return `Got you! 📚💗 Send me the assignment question or tell me the subject and topic, and we'll work through it step by step.`;
  }

  if (text.includes("practice")) {
    return `Let's practice! 📝💗 Tell me the subject and topic, and I'll give you a question to try.`;
  }

  if (
    text.includes("explain") ||
    text.includes("explain something")
  ) {
    return `Of course! 💗 Tell me the subject and the exact topic you want explained, and I'll break it down simply.`;
  }

  if (
    text.includes("study plan") ||
    text.includes("study schedule")
  ) {
    return `Let's make your study plan! 📚💗 Tell me the subjects you need to study and how much time you have.`;
  }

  if (text === "beginner") {
    return `Beginner mode activated 🌱📚 I'll keep the questions simple and explain things step by step. Choose a subject to start.`;
  }

  if (text === "standard") {
    return `Standard mode activated 📚💗 I'll give you normal school-level questions. Choose a subject to start.`;
  }

  if (
    text.includes("exam mode") ||
    text.includes("exam")
  ) {
    return `Exam Mode activated! 📝🔥 I'll give you questions without immediately giving away the answers. Choose your subject and topic.`;
  }

  if (
    text.includes("challenge me") ||
    text.includes("challenge")
  ) {
    return `Challenge Mode! 🔥📚 Ready for harder questions? Tell me your subject and topic.`;
  }

  // =========================
  // QUIZ ANSWERS
  // =========================

  if (text === "a") {
    return `Good attempt! 💗 Let's keep going. Send me the next answer or tell me the subject/topic you're working on.`;
  }

  if (text === "b") {
    return `Nice! 💗 Let's keep going. Send me the next answer or tell me the subject/topic you're working on.`;
  }

  if (text === "c") {
    return `Got your answer! 💗 Let's keep going. Send me the next answer or tell me the subject/topic you're working on.`;
  }

  if (text === "d") {
    return `Answer received! 💗 Let's keep going. Send me the next answer or tell me the subject/topic you're working on.`;
  }

  // =========================
  // FALLBACK
  // =========================

  return `I'm listening, ${name}. 💗 Tell me a little more about that, and I'll help however I can.`;
}

function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });

  res.end(JSON
