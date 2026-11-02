import { useRef, useState } from "react";
import scrollBackground from "../assets/miniGame/blank-scroll-nobg.png";
import journeyQuizTitle from "../assets/elements/journey quiz.png";
import "./JourneyKnowledgeQuiz.css";

const LEVEL_QUESTIONS = {
  pretoria: {
    name: "Pretoria",
    questions: [
      {
        prompt: "What famous landmark serves as the official seat of the South African government in Pretoria?",
        answer: "Union Buildings",
        explanation: "The Union Buildings in Pretoria are the official seat of the South African government.",
        options: ["The Big Hole", "Union Buildings", "Table Mountain", "Bain's Kloof Pass"],
      },
      {
        prompt: "Why is Pretoria commonly called the Jacaranda City?",
        answer: "Because of the beautiful jacaranda trees that flower throughout the city.",
        explanation: "Jacaranda trees bloom across Pretoria, giving the city its nickname.",
        options: [
          "Because of its many gold mines.",
          "Because of its large railway stations.",
          "Because of the beautiful jacaranda trees that flower throughout the city.",
          "Because it is surrounded by mountains.",
        ],
      },
    ],
  },
  kimberley: {
    name: "Kimberley",
    questions: [
      {
        prompt: "What is Kimberley famously known for following the discovery of diamonds?",
        answer: "The Big Hole",
        explanation: "The Big Hole is Kimberley's well-known landmark from its diamond-mining history.",
        options: ["The Karoo Fossil Trail", "The 12th Milepost", "The Big Hole", "Table Mountain"],
      },
      {
        prompt: "What major industry transformed Kimberley during the late 19th century?",
        answer: "Diamond mining.",
        explanation: "Diamond mining drove Kimberley's rapid growth in the late 19th century.",
        options: ["Diamond mining.", "Fishing.", "Shipbuilding.", "Automobile manufacturing."],
      },
    ],
  },
  "de-aar": {
    name: "De Aar",
    questions: [
      {
        prompt: "Which communities are associated with the ancient rock engravings found near De Aar?",
        answer: "San and Khoe communities.",
        explanation: "The engravings are associated with San and Khoe communities.",
        options: [
          "Zulu and Xhosa communities.",
          "San and Khoe communities.",
          "European railway workers.",
          "Modern mining communities.",
        ],
      },
      {
        prompt: "Why are the ancient rock engravings important?",
        answer: "They preserve evidence of ancient cultural expression and people's relationship with the natural world.",
        explanation: "The engravings preserve cultural expression and show people's relationship with nature.",
        options: [
          "They were used to construct railway lines.",
          "They mark the boundaries of modern farms.",
          "They show where diamonds were discovered.",
          "They preserve evidence of ancient cultural expression and people's relationship with the natural world.",
        ],
      },
    ],
  },
  "beaufort-west": {
    name: "Beaufort West",
    questions: [
      {
        prompt: "What can scientists learn from the fossils discovered in the Karoo?",
        answer: "What prehistoric life was like millions of years ago.",
        explanation: "Karoo fossils provide evidence about prehistoric life millions of years ago.",
        options: [
          "How modern trains were built.",
          "How people constructed old houses.",
          "What prehistoric life was like millions of years ago.",
          "How diamonds were mined.",
        ],
      },
      {
        prompt: "What is a fossil?",
        answer: "The preserved remains or traces of ancient living organisms.",
        explanation: "A fossil is preserved evidence of an ancient organism, including its remains or traces.",
        options: [
          "The preserved remains or traces of ancient living organisms.",
          "A type of desert plant.",
          "A naturally occurring diamond.",
          "A modern animal skeleton.",
        ],
      },
    ],
  },
  worcester: {
    name: "Worcester",
    questions: [
      {
        prompt: "What is the main purpose of the Karoo Desert National Botanical Garden?",
        answer: "To showcase indigenous plants, especially those adapted to dry environments.",
        explanation: "The garden showcases indigenous plants, including species adapted to dry conditions.",
        options: [
          "To display ancient railway equipment.",
          "To showcase indigenous plants, especially those adapted to dry environments.",
          "To protect diamond mines.",
          "To grow tropical rainforest trees.",
        ],
      },
      {
        prompt: "How do many succulents survive in dry environments?",
        answer: "By storing water in their leaves or stems.",
        explanation: "Many succulents store water in their leaves or stems to survive dry periods.",
        options: [
          "By absorbing water from the air only.",
          "By growing underwater.",
          "By storing water in their leaves or stems.",
          "By needing constant rainfall.",
        ],
      },
    ],
  },
  wellington: {
    name: "Wellington",
    questions: [
      {
        prompt: "Who designed and directed the construction of Bain's Kloof Pass?",
        answer: "Andrew Geddes Bain.",
        explanation: "Andrew Geddes Bain designed and directed the construction of the pass.",
        options: ["Olive Schreiner.", "Chris Barnard.", "Charles Bell.", "Andrew Geddes Bain."],
      },
      {
        prompt: "What was the historical importance of Bain's Kloof Pass?",
        answer: "It provided an important route connecting the Cape with the interior.",
        explanation: "The pass created an important route between the Cape and the interior.",
        options: [
          "It provided an important route connecting the Cape with the interior.",
          "It was South Africa's first railway station.",
          "It was built to transport diamonds underground.",
          "It connected Kimberley directly to Pretoria.",
        ],
      },
    ],
  },
  bellville: {
    name: "Bellville",
    questions: [
      {
        prompt: "What did the historic 12th Milepost represent?",
        answer: "A distance of twelve miles from Cape Town.",
        explanation: "The milepost marked a point twelve miles from Cape Town.",
        options: [
          "The twelfth railway station in South Africa.",
          "A distance of twelve miles from Cape Town.",
          "The entrance to a diamond mine.",
          "The distance between Bellville and Wellington.",
        ],
      },
      {
        prompt: "How did travellers commonly travel along the old routes before modern transport?",
        answer: "By ox-wagon.",
        explanation: "Ox-wagons were commonly used to travel along the old routes.",
        options: ["By aeroplane.", "By electric train.", "By ox-wagon.", "By motor vehicle."],
      },
    ],
  },
};

function shuffleOptions(options) {
  const shuffled = [...options];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

export default function JourneyKnowledgeQuiz({ scene, onComplete, onContinue }) {
  const level = LEVEL_QUESTIONS[scene];
  const [questions] = useState(() => level.questions.map((question) => ({
    ...question,
    options: shuffleOptions(question.options),
  })));
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const completionNotified = useRef(false);
  const question = questions[questionIndex];
  const answerIsCorrect = selectedAnswer === question.answer;

  const handleAnswer = (answer) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answer);
    if (answer === question.answer) {
      setScore((currentScore) => currentScore + 10);
    }
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    if (questionIndex === questions.length - 1) {
      if (!completionNotified.current) {
        completionNotified.current = true;
        onComplete(score);
      }
      setShowResult(true);
      return;
    }

    setQuestionIndex((currentIndex) => currentIndex + 1);
    setSelectedAnswer(null);
  };

  return (
    <div className="journey-quiz-overlay" role="dialog" aria-modal="true" aria-label={`${level.name} knowledge challenge`}>
      <section className="journey-quiz-scroll">
        <img className="journey-quiz-scroll-art" src={scrollBackground} alt="" />
        <div className="journey-quiz-content">
          <img className="journey-quiz-title" src={journeyQuizTitle} alt="Journey Quiz" />
          {showResult ? (
            <div className="journey-quiz-result">
              <p className="journey-quiz-eyebrow">{level.name} knowledge challenge</p>
              <h1>Level Quiz Complete!</h1>
              <p className="journey-quiz-score">Your score: {score} / 20</p>
              <p>Your quiz points have been saved.</p>
              <button type="button" className="journey-quiz-action" onClick={onContinue}>
                Continue to Level Complete
              </button>
            </div>
          ) : (
            <>
              <header className="journey-quiz-heading">
                <p className="journey-quiz-eyebrow">{level.name} knowledge challenge</p>
                <h1>Test Your Journey Knowledge</h1>
                <div className="journey-quiz-progress" aria-live="polite">
                  <span>Question {questionIndex + 1} of 2</span>
                  <strong>Score: {score} / 20</strong>
                </div>
              </header>
              <section className="journey-quiz-question" aria-label={`Question ${questionIndex + 1}`}>
                <h2>{question.prompt}</h2>
                <div className="journey-quiz-options">
                  {question.options.map((option) => {
                    const answered = selectedAnswer !== null;
                    const isCorrectOption = option === question.answer;
                    const isSelectedOption = option === selectedAnswer;
                    let className = "journey-quiz-option";
                    if (answered && isCorrectOption) className += " is-correct";
                    else if (isSelectedOption) className += " is-incorrect";

                    return (
                      <button
                        key={option}
                        type="button"
                        className={className}
                        disabled={answered}
                        aria-pressed={isSelectedOption}
                        onClick={() => handleAnswer(option)}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
                {selectedAnswer !== null && (
                  <p className={`journey-quiz-feedback${answerIsCorrect ? " is-correct" : " is-incorrect"}`} role="status">
                    {answerIsCorrect
                      ? "Correct! You earned 10 points."
                      : `Not quite. The correct answer is ${question.answer} ${question.explanation}`}
                  </p>
                )}
                <button
                  type="button"
                  className="journey-quiz-action"
                  disabled={selectedAnswer === null}
                  onClick={handleNext}
                >
                  {questionIndex === questions.length - 1 ? "See Quiz Results" : "Next Question"}
                </button>
              </section>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
