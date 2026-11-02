import { useState } from "react";
import "./JourneyMap.css";
import passportIcon from "../assets/elements/passporticon.png";
import skyGradient from "../assets/elements/sky_gradient.png";
import savannaGround from "../assets/elements/savanna_ground.png";
import acaciaTree from "../assets/elements/acacia_tree.png";
import smallClouds from "../assets/elements/small_clouds.png";
import starBadge from "../assets/elements/star_badge.png";
import trainJourneyLogo from "../assets/elements/title_train_journey_logo.png";
import welcomeMapper from "../assets/elements/title_welcome_mapper.png";
import lock1 from "../assets/elements/lock_1.png";
import lock2 from "../assets/elements/lock_2.png";
import lock3 from "../assets/elements/lock_3.png";
import lock4 from "../assets/elements/lock_4.png";
import PassportModal from "../components/PassportModal";

const LOCK_IMAGES = [lock1, lock2, lock3, lock4];

const JOURNEY_STOPS = [
  {
    id: "pretoria",
    name: "Pretoria",
    province: "Gauteng",
    title: "The Journey Begins",
    unlocked: true,
    completed: false,
  },
  {
    id: "kimberley",
    name: "Kimberley",
    province: "Northern Cape",
    title: "Diamond City",
    unlocked: false,
    completed: false,
  },
  {
    id: "de-aar",
    name: "De Aar",
    province: "Northern Cape",
    title: "Railway Crossroads",
    unlocked: false,
    completed: false,
  },
  {
    id: "beaufort-west",
    name: "Beaufort West",
    province: "Western Cape",
    title: "Into the Karoo",
    unlocked: false,
    completed: false,
  },
  {
    id: "worcester",
    name: "Worcester",
    province: "Western Cape",
    title: "Where the Valley Opens",
    unlocked: false,
    completed: false,
  },
  {
    id: "wellington",
    name: "Wellington",
    province: "Western Cape",
    title: "Between Mountains and Vineyards",
    unlocked: false,
    completed: false,
  },
  {
    id: "bellville",
    name: "Bellville",
    province: "Western Cape",
    title: "The Cape Gateway",
    unlocked: false,
    completed: false,
  },
  {
    id: "cape-town",
    name: "Cape Town",
    province: "Western Cape",
    title: "The Journey's End",
    unlocked: false,
    completed: false,
  },
];

export default function JourneyMap({
  player,
  onBack,
  onOpenLevel,
  onOpenInfo,
  onOpenMiniGames,
}) {
  const [showPassport, setShowPassport] = useState(false);
  const completedLevels = player?.completedLevels || [];
  return (
    <main className="journey-map-screen">
      <img className="journey-map-sky" src={skyGradient} alt="" aria-hidden="true" />
      <img className="journey-map-ground" src={savannaGround} alt="" aria-hidden="true" />
      <img className="journey-map-clouds journey-map-clouds--left" src={smallClouds} alt="" aria-hidden="true" />
      <img className="journey-map-clouds journey-map-clouds--right" src={smallClouds} alt="" aria-hidden="true" />
      <img className="journey-map-tree journey-map-tree--one" src={acaciaTree} alt="" aria-hidden="true" />
      <img className="journey-map-tree journey-map-tree--two" src={acaciaTree} alt="" aria-hidden="true" />
      <img className="journey-map-tree journey-map-tree--three" src={acaciaTree} alt="" aria-hidden="true" />

      <header className="journey-map-header">
        <button type="button" className="journey-map-back" onClick={onBack} aria-label="Back to home">
          <span aria-hidden="true">←</span><small>HOME</small>
        </button>
        <div className="journey-map-title">
          <img className="journey-map-logo" src={trainJourneyLogo} alt="Train Journey" />
          <img className="journey-map-welcome-art" src={welcomeMapper} alt="Welcome, mapper!" />
        </div>
        <div className="journey-map-actions">
          <button
            type="button"
            className="journey-map-action"
            onClick={() => setShowPassport(true)}
          >
            <img src={passportIcon} alt="" aria-hidden="true" />
            <span>Passport</span>
          </button>
          <button
            type="button"
            className="journey-map-action"
            onClick={onOpenInfo}
          >
            <b aria-hidden="true">?</b>
            <span>Info</span>
          </button>
          <button
            type="button"
            className="journey-map-action journey-map-mini-games"
            onClick={onOpenMiniGames}
            aria-label="Open Mini Games"
            title="Mini Games"
          >
            <svg viewBox="0 0 48 36" aria-hidden="true">
              <path d="M13 5h22c5 0 8 4 9 10l2 10c1 5-5 8-9 4l-6-6H17l-6 6c-4 4-10 1-9-4l2-10C5 9 8 5 13 5Z" />
              <path d="M14 12v10m-5-5h10" />
              <circle cx="34" cy="15" r="1.8" />
              <circle cx="39" cy="20" r="1.8" />
            </svg>
            <span>Games</span>
          </button>
        </div>
      </header>

      <section className="journey-map-status" aria-label="Journey progress">
        <span>PRETORIA</span>
        <div><strong>{Math.min(completedLevels.length + 1, JOURNEY_STOPS.length)}</strong><small>/ {JOURNEY_STOPS.length} STOPS</small></div>
        <span>CAPE TOWN</span>
      </section>

      <section className="journey-route" aria-label="South Africa journey route">
        {JOURNEY_STOPS.map((stop, index) => {
          const completed = completedLevels.includes(stop.id);
          const unlocked = index === 0 || completedLevels.includes(JOURNEY_STOPS[index - 1].id);
          const isCurrent = unlocked && !completed;

          return (
            <article key={stop.id} className={`journey-stop journey-stop--${index + 1} ${isCurrent ? "current" : ""} ${unlocked ? "unlocked" : "locked"}`}>
              <button
                type="button"
                className="journey-stop-marker"
                onClick={() => unlocked && onOpenLevel(stop)}
                disabled={!unlocked}
                aria-label={`${stop.name}, ${unlocked ? "open stop" : "locked stop"}`}
              >
                {unlocked ? (
                  <img src={starBadge} alt="" className="journey-stop-star" />
                ) : (
                  <img src={LOCK_IMAGES[index % LOCK_IMAGES.length]} alt="" className="journey-stop-lock" />
                )}
              </button>
              <div className="journey-stop-label">
                <small>STOP {String(index + 1).padStart(2, "0")}</small>
                <strong>{stop.name}</strong>
                <span>{isCurrent ? "BOARD HERE" : completed ? "COMPLETED" : "LOCKED"}</span>
              </div>
            </article>
          );
        })}
      </section>

      <footer className="journey-map-footer">
        <p>Complete each stop to unlock the next story.</p><span aria-hidden="true">✦</span>
      </footer>

      {showPassport && (
        <PassportModal player={player} onClose={() => setShowPassport(false)} />
      )}
    </main>
  );
}