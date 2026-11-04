import { useEffect, useRef, useState } from "react";
import scrollBackground from "../assets/miniGame/blank-scroll-nobg.png";
import monumentLogo from "../assets/miniGame/match_monument.png";
import bigHole from "../assets/miniGame/big_hole.jfif";
import brainskloof from "../assets/miniGame/brainskloof.jfif";
import karooDesert from "../assets/miniGame/Karoo_desert.jfif";
import unionBuilding from "../assets/miniGame/union_building.jfif";
import khoisanDrawings from "../assets/miniGame/khoisan_drawings.jfif";
import karooFossil from "../assets/miniGame/karoo_fossil.jfif";
import milepost from "../assets/miniGame/The 12th Milepost.jfif";
import tableMountain from "../assets/miniGame/table mountain.jfif";
import coinBadgeIcon from "../assets/elements/coin_badge_icon.png";
import miniGameMusic from "../assets/miniGame/miniGame_music.mp3";
import { createConfiguredAudio } from "../settings";
import { MINI_GAME_REWARD } from "../gameConstants";
import "./MatchMonument.css";

const REWARD = MINI_GAME_REWARD;
const DESTINATIONS = [
  "Pretoria",
  "Kimberley",
  "De Aar",
  "Beaufort West",
  "Worcester",
  "Wellington",
  "Bellville",
  "Cape Town",
];
const LANDMARKS = [
  { name: "Big Hole", image: bigHole, destination: "Kimberley" },
  { name: "Brainskloof", image: brainskloof, destination: "Wellington" },
  { name: "Karoo Desert", image: karooDesert, destination: "Beaufort West" },
  { name: "Union Building", image: unionBuilding, destination: "Pretoria" },
  { name: "Khoisan Drawings", image: khoisanDrawings, destination: "De Aar" },
  { name: "Karoo Fossil", image: karooFossil, destination: "Worcester" },
  { name: "The 12th Milepost", image: milepost, destination: "Bellville" },
  { name: "Table Mountain", image: tableMountain, destination: "Cape Town" },
];

function shuffled(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function createRound() {
  return shuffled(LANDMARKS).map((landmark) => ({
    landmark,
    options: shuffled(DESTINATIONS),
  }));
}

function performanceMessage(score) {
  if (score >= 70) return "Outstanding Explorer!";
  if (score >= 50) return "Great Journey!";
  if (score >= 30) return "Keep Exploring!";
  return "Time for Another Journey!";
}

export default function MatchMonument({
  player,
  availableHearts = 3,
  onBack,
  onPlayerStateChange,
}) {
  const [questions, setQuestions] = useState(createRound);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [roundReward, setRoundReward] = useState(0);
  const rewardClaimedRef = useRef(false);
  const money = Number.isFinite(player?.money) ? player.money : 250;
  const currentQuestion = questions[questionIndex];

  useEffect(() => {
    const music = createConfiguredAudio(miniGameMusic, "music");
    music.loop = true;
    music.play().catch(() => undefined);

    return () => {
      music.pause();
      music.currentTime = 0;
    };
  }, []);

  const handleAnswer = (destination) => {
    if (availableHearts === 0 || selectedDestination !== null || gameComplete) return;
    setSelectedDestination(destination);
    if (destination === currentQuestion.landmark.destination) {
      setScore((currentScore) => currentScore + 10);
    }
  };

  const handleNext = () => {
    if (availableHearts === 0 || selectedDestination === null) return;
    if (questionIndex === questions.length - 1) {
      if (!rewardClaimedRef.current) {
        rewardClaimedRef.current = true;
        const earnedReward = Math.round((score / 80) * REWARD);
        setRoundReward(earnedReward);
        if (earnedReward > 0) onPlayerStateChange({ money: money + earnedReward });
      }
      setGameComplete(true);
      return;
    }

    setQuestionIndex((index) => index + 1);
    setSelectedDestination(null);
  };

  const handlePlayAgain = () => {
    if (availableHearts === 0) return;
    setQuestions(createRound());
    setQuestionIndex(0);
    setScore(0);
    setRoundReward(0);
    setSelectedDestination(null);
    setGameComplete(false);
    rewardClaimedRef.current = false;
  };

  const isCorrect = selectedDestination === currentQuestion.landmark.destination;
  const displayMoney = money;

  return (
    <main className="match-monument" aria-label="Match the Monument mini-game">
      <img className="match-monument-scroll" src={scrollBackground} alt="" />
      <div className="match-monument-content">
        <button className="match-monument-exit" type="button" onClick={onBack}>
          <span aria-hidden="true">&#8592;</span> Exit
        </button>
        <div className="match-monument-money" aria-label={`Current money R${displayMoney}`}>
          <img src={coinBadgeIcon} alt="" />
          <strong>R{displayMoney}</strong>
        </div>
        <img className="match-monument-logo" src={monumentLogo} alt="Match the Monument" />

        {availableHearts === 0 ? (
          <section className="match-monument-result" role="dialog" aria-modal="true" aria-labelledby="match-monument-result-title">
            <h1 id="match-monument-result-title">All hearts lost</h1>
            <p>Wait for a heart to regenerate before continuing.</p>
            <div className="match-monument-result-actions">
              <button type="button" onClick={onBack}>Exit</button>
            </div>
          </section>
        ) : gameComplete ? (
          <section className="match-monument-result" role="dialog" aria-modal="true" aria-labelledby="match-monument-result-title">
            <h1 id="match-monument-result-title">{performanceMessage(score)}</h1>
            <p className="match-monument-final-score">Final score: {score} / 80</p>
            <p>You earned R{roundReward}.</p>
            <div className="match-monument-result-actions">
              <button type="button" onClick={handlePlayAgain}>Play Again</button>
              <button type="button" onClick={onBack}>Exit</button>
            </div>
          </section>
        ) : (
          <>
            <header className="match-monument-heading">
              <p>Match each landmark to its destination</p>
              <div className="match-monument-progress" aria-live="polite">
                Question {questionIndex + 1} of {questions.length}
                <strong>Score: {score}</strong>
              </div>
            </header>
            <section className="match-monument-question" aria-label={`Question ${questionIndex + 1}`}>
              <img
                className="match-monument-landmark"
                src={currentQuestion.landmark.image}
                alt={currentQuestion.landmark.name}
              />
              <h2>{currentQuestion.landmark.name}</h2>
              <p>Which destination does this landmark belong to?</p>
              <div className="match-monument-options">
                {currentQuestion.options.map((destination) => {
                  const answered = selectedDestination !== null;
                  const correctAnswer = destination === currentQuestion.landmark.destination;
                  const selectedAnswer = destination === selectedDestination;
                  let className = "match-monument-option";
                  if (answered && correctAnswer) className += " is-correct";
                  else if (selectedAnswer) className += " is-incorrect";

                  return (
                    <button
                      key={destination}
                      className={className}
                      type="button"
                      disabled={answered}
                      aria-pressed={selectedAnswer}
                      onClick={() => handleAnswer(destination)}
                    >
                      {destination}
                    </button>
                  );
                })}
              </div>
              {selectedDestination !== null && (
                <p className={`match-monument-feedback${isCorrect ? " is-correct" : " is-incorrect"}`} role="status">
                  {isCorrect
                    ? "Correct! You found the right destination!"
                    : `Not quite! This landmark belongs to ${currentQuestion.landmark.destination}.`}
                </p>
              )}
              <button
                className="match-monument-next"
                type="button"
                disabled={selectedDestination === null}
                onClick={handleNext}
              >
                {questionIndex === questions.length - 1 ? "Finish" : "Next"}
              </button>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
