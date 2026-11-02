import { useState } from "react";
import "./HomeScreen.css";
import PassportModal from "../components/PassportModal";
import welcomeMapperBackground from "../assets/elements/03_welcome_mapper.jpg";
import journeyMapImage from "../assets/elements/map.png";
import pretoriaJourney from "../assets/elements/scroll1.png";
import kimberleyToDeAarJourney from "../assets/elements/kimberley-to-de-aar-map-nobg.png";
import deAarJourney from "../assets/De_Aar_images/00_map_overview.png";
import beaufortWestJourney from "../assets/Beaufort West/00_map_overview.png";
import worcesterJourney from "../assets/Worcester/0_title.png";
import wellingtonJourney from "../assets/Wellington/00_wellington_to_bellville_overview.png";
import bellvilleJourney from "../assets/Bellville/00_bellville_to_cape_town_overview.png";

const JOURNEY_OVERVIEWS = [
  { title: "Pretoria to Kimberley", image: pretoriaJourney },
  { title: "Kimberley to De Aar", image: kimberleyToDeAarJourney },
  { title: "De Aar to Beaufort West", image: deAarJourney },
  { title: "Beaufort West to Worcester", image: beaufortWestJourney },
  { title: "Worcester to Wellington", image: worcesterJourney },
  { title: "Wellington to Bellville", image: wellingtonJourney },
  { title: "Bellville to Cape Town", image: bellvilleJourney },
];

export default function HomeScreen({ player, onStartJourney, onContinueJourney, onOpenSettings, onOpenMiniGames }) {
  const [showPassport, setShowPassport] = useState(false);
  const [showRouteMap, setShowRouteMap] = useState(false);
  const [showJourneys, setShowJourneys] = useState(false);
  const [journeyIndex, setJourneyIndex] = useState(0);

  return (
    <main className="home-screen" aria-label="Welcome mapper">
      <div className="home-scene">
        <img
          className="home-background"
          src={welcomeMapperBackground}
          alt="Train Journey Mapper. Start Journey or Continue."
        />
        <button
          type="button"
          className="home-background-action home-background-action-start"
          aria-label="Start journey at Pretoria"
          onClick={onStartJourney}
        />
        <button
          type="button"
          className="home-background-action home-background-action-continue"
          aria-label="Continue your journey"
          onClick={onContinueJourney}
        />
        <button
          type="button"
          className="home-background-action home-background-action-journeys"
          aria-label="View journey overviews"
          onClick={() => {
            setJourneyIndex(0);
            setShowJourneys(true);
          }}
        />
        <button
          type="button"
          className="home-background-action home-background-action-settings"
          aria-label="Open settings"
          onClick={onOpenSettings}
        />
        <button
          type="button"
          className="home-mini-games-button"
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
          type="button"
          className="home-background-action home-background-action-map"
          aria-label="Open journey map"
          onClick={() => setShowRouteMap(true)}
        />
        <button
          type="button"
          className="home-background-action home-background-action-collection"
          aria-label="Open passport collection"
          onClick={() => setShowPassport(true)}
        />
      </div>
      {showPassport && (
        <PassportModal player={player} onClose={() => setShowPassport(false)} />
      )}
      {showRouteMap && (
        <div
          className="home-map-backdrop"
          role="presentation"
          onClick={() => setShowRouteMap(false)}
        >
          <section
            className="home-map-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Train Journey Mapper route map"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="home-map-close"
              aria-label="Close map"
              onClick={() => setShowRouteMap(false)}
            >
              ×
            </button>
            <img src={journeyMapImage} alt="Train Journey Mapper route from Pretoria to Cape Town" />
          </section>
        </div>
      )}
      {showJourneys && (
        <div
          className="home-map-backdrop"
          role="presentation"
          onClick={() => setShowJourneys(false)}
        >
          <section
            className="home-map-dialog home-journeys-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Journey overviews"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="home-map-close"
              aria-label="Close journeys"
              onClick={() => setShowJourneys(false)}
            >
              ×
            </button>
            <h2 className="home-journeys-title">{JOURNEY_OVERVIEWS[journeyIndex].title}</h2>
            <img
              src={JOURNEY_OVERVIEWS[journeyIndex].image}
              alt={`${JOURNEY_OVERVIEWS[journeyIndex].title} journey overview`}
            />
            <div className="home-journeys-controls">
              <button
                type="button"
                aria-label="Previous journey overview"
                disabled={journeyIndex === 0}
                onClick={() => setJourneyIndex((index) => Math.max(0, index - 1))}
              >
                Previous
              </button>
              <span aria-live="polite">
                {journeyIndex + 1} / {JOURNEY_OVERVIEWS.length}
              </span>
              <button
                type="button"
                aria-label="Next journey overview"
                disabled={journeyIndex === JOURNEY_OVERVIEWS.length - 1}
                onClick={() => setJourneyIndex((index) => Math.min(JOURNEY_OVERVIEWS.length - 1, index + 1))}
              >
                Next
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
