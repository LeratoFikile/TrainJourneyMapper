import { useState } from "react";
import capeTownArrivalImage from "../assets/Cape Town/cape_town_train_stop.webp";
import capeTownExploreVideo from "../assets/Cape Town/capetown_explore.mp4";
import guideMamzoHalf from "../assets/characters/guides/mamzohalf.png";
import guideMalumeHalf from "../assets/characters/guides/malumehalf.png";
import "./KimberleyLevel.css";
import "./TrainInside.css";
import "./BellvilleLevel.css";

const FINAL_DIALOGUES = [
  "Goeie dag, reisiger! Welcome to Cape Town! Congratulations on completing your journey across South Africa! You've explored incredible places, discovered our heritage and reached your final destination. Well done!",
  "Your journey doesn't have to end here! You can start a new adventure by resetting your progress, revisit places you've already explored, or enjoy the mini-games. There's always more to discover!",
];

export default function CapeTownLevel({ player, onBack, onOpenMiniGames }) {
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [dialogueStep, setDialogueStep] = useState(0);
  const guide = player?.guide === "mamzo" ? guideMamzoHalf : guideMalumeHalf;

  return (
    <main className="bellville-level" aria-label="Cape Town level">
      <img
        className="cape-town-level-background"
        src={capeTownArrivalImage}
        alt="Cape Town train station"
      />
      <button className="bellville-level-back" type="button" onClick={onBack}>
        <span aria-hidden="true">&#8592;</span> Journey map
      </button>
      <button
        className="cape-town-mini-games-button"
        type="button"
        aria-label="Open Mini Games"
        title="Mini Games"
        onClick={onOpenMiniGames}
      >
        <svg viewBox="0 0 48 36" aria-hidden="true">
          <path d="M13 5h22c5 0 8 4 9 10l2 10c1 5-5 8-9 4l-6-6H17l-6 6c-4 4-10 1-9-4l2-10C5 9 8 5 13 5Z" />
          <path d="M14 12v10m-5-5h10" />
          <circle cx="34" cy="15" r="1.8" />
          <circle cx="39" cy="20" r="1.8" />
        </svg>
      </button>
      <button
        className="kimberley-explore-button"
        type="button"
        aria-label="Explore Cape Town"
        title="Explore Cape Town"
        onClick={() => setIsExploreOpen(true)}
      >
        <span aria-hidden="true">&#128065;</span>
        <small>Explore</small>
      </button>
      {dialogueStep < FINAL_DIALOGUES.length && (
        <>
          <img
            className="train-inside-guide"
            src={guide}
            alt={player?.guide === "mamzo" ? "Mamzo" : "Malume"}
          />
          <div className="train-inside-guide-dialog">
            <div className="train-inside-guide-message" role="note" aria-label="Tour guide message">
              <p><span>{FINAL_DIALOGUES[dialogueStep]}</span></p>
            </div>
            <button
              className="train-inside-guide-ok"
              type="button"
              aria-label="Continue"
              title="Continue"
              onClick={() => setDialogueStep((step) => step + 1)}
            >
              <span aria-hidden="true">&#10003;</span>
            </button>
          </div>
        </>
      )}
      {isExploreOpen && (
        <div className="kimberley-video-overlay" role="dialog" aria-label="Explore Cape Town" aria-modal="true">
          <video
            className="kimberley-fullscreen-video"
            src={capeTownExploreVideo}
            autoPlay
            playsInline
            preload="auto"
            onEnded={() => setIsExploreOpen(false)}
          />
          <button
            className="kimberley-video-close"
            type="button"
            aria-label="Close Cape Town exploration"
            onClick={() => setIsExploreOpen(false)}
          >
            <span aria-hidden="true">&#10005;</span>
          </button>
        </div>
      )}
    </main>
  );
}
