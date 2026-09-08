const http = require("http");

const PORT = process.env.PORT || 8787;

const sessions = new Map();

function makePersonality(profile) {
  return {
    name: profile?.name || "girl",
    vibes: Array.isArray(profile?.vibes)
      ? profile.vibes.join(", ")
      : "",
    style: profile?.style || "",
    emoji: profile?.emoji || "",
    custom: profile?.custom || ""
  };
}

const quizzes = {
  "government:colonialism": [
    {
      question: "What is colonialism?",
      options: [
        "A. The system where one country controls another territory",
        "B. A system of electing a president",
        "C. A form of traditional marriage",
        "D. A type of economic market"
      ],
      answer: "a"
    },
    {
      question: "Which European country colonized Nigeria?",
      options: [
        "A. France",
        "B. Britain",
        "C. Germany",
        "D. Portugal"
      ],
      answer: "b"
    },
    {
      question: "In which year was Nigeria amalgamated?",
      options: [
        "A. 1900",
        "B. 1914",
        "C. 1922",
        "D. 1960"
      ],
      answer: "b"
    }
  ],

  "government:nationalism": [
    {
      question: "What is nationalism?",
      options: [
        "A. Love and devotion to one's nation",
        "B. Control of a country by another country",
        "C. A type of court",
        "D. A system of taxation"
      ],
      answer: "a"
    },
    {
      question: "Which of these can encourage nationalism?",
      options: [
        "A. National unity",
        "B. Political apathy",
        "C. Foreign domination",
        "D. Disunity"
      ],
      answer: "a"
    }
  ],

  "government:constitution": [
    {
      question: "What is a constitution?",
      options: [
        "A. A set of fundamental rules by which a country is governed",
        "B. A political party",
        "C. A court judgment",
        "D. A type of election"
      ],
      answer: "a"
    },
    {
      question: "Which constitution was introduced in Nigeria in 1922?",
      options: [
        "A. Clifford Constitution",
        "B. Richards Constitution",
        "C. Macpherson Constitution",
        "D. Lyttleton Constitution"
      ],
      answer: "a"
    }
  ],

  "maths:trigonometry": [
    {
      question: "If sin θ = 3/5 and θ is acute, what is cos θ?",
      options: [
        "A. 2/5",
        "B. 3/5",
        "C. 4/5",
        "D. 5/3"
      ],
      answer: "c"
    },
    {
      question: "Which ratio represents opposite ÷ hypotenuse?",
      options: [
        "A. Cosine",
        "B. Sine",
        "C. Tangent",
        "D. Secant"
      ],
      answer: "b"
    }
  ],

  "maths:bearings": [
    {
      question: "Bearings are measured clockwise from which direction?",
      options: [
        "A. South",
        "B. East",
        "C. North",
        "D. West"
      ],
      answer: "c"
    },
    {
      question: "A bearing is normally written using how many figures?",
      options: [
        "A. One",
        "B. Two",
        "C. Three",
        "D. Four"
      ],
      answer: "c"
    }
  ],

  "economics:market failure": [
    {
      question: "What is market failure?",
      options: [
        "A. When resources are not allocated efficiently by the market",
        "B. When every business makes a profit",
        "C. When prices never change",
        "D. When consumers stop buying goods"
      ],
      answer: "a"
    }
  ],

  "literature:an inspector calls": [
    {
      question: "Who visits the Birling family in An Inspector Calls?",
      options: [
        "A. Inspector Goole",
        "B. Inspector Smith",
        "C. Inspector Evans",
        "D. Inspector Wilson"
      ],
      answer: "a"
    }
  ]
};

function normalizeTopic(text) {
  return text
    .toLowerCase()
    .replace(/[?.!,]/g, "")
    .trim();
}

function startQuiz(subject, topic, session) {
  const key = `${subject}:${topic}`;
  const quiz = quizzes[key];

  if (!quiz) {
    return `I can quiz you on that! 📚💗 I don't have that topic built in yet. Try another topic or send me the exact question you want help with.`;
  }

  session.quizKey = key;
  session.quizIndex = 0;
  session.score = 0;

  return formatQuestion(quiz[0], 1, quiz.length);
}

function formatQuestion(item, number, total) {
  return `Okayyy! 📝💗 Question ${number} of ${total}:

${item.question}

${item.options.join("\n")}

Reply with A, B, C, or D.`;
}

function handleQuizAnswer(text, session) {
  if (!session.quizKey) return null;

  const answer = normalizeTopic(text);

  if (!["a", "b", "c", "d"].includes(answer)) {
    return `Just send me **A, B, C, or D** for the quiz answer. 💗`;
  }

  const quiz = quizzes[session.quizKey];
  const current = quiz[session.quizIndex];

  if (answer === current.answer) {
    session.score++;
    session.quizIndex++;

    if (session.quizIndex >= quiz.length) {
      const score = session.score;
      session.quizKey = null;
      session.quizIndex = 0;
      session.score = 0;

      return `YESSS! 🎉💗 You finished the quiz!

You scored **${score}/${quiz.length}**.

Want another quiz? Tell me the subject and topic! 📚`;
    }

    return `Correct! 🎉💗 Good job!

Your score: **${session.score}/${session.quizIndex}**

${formatQuestion(
      quiz[session.quizIndex],
      session.quizIndex + 1,
      quiz.length
    )}`;
  }

  session.quizIndex++;

  if (session.quizIndex >= quiz.length) {
    const score = session.score;
    session.quizKey = null;
    session.quizIndex = 0;
    session.score = 0;

    return `Not quite, but that's okay! 💗 Learning is about practice.

You finished with **${score}/${quiz.length}**.

Want to try another topic? 📚`;
  }

  return `Not quite! 💗 The correct answer was **${current.answer.toUpperCase()}**.

Let's keep going!

${
