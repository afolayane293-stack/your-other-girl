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
