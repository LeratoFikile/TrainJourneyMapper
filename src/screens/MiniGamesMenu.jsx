import "./MiniGamesMenu.css";
import scrollBackground from "../assets/miniGame/blank-scroll-nobg.png";
import monumentLogo from "../assets/miniGame/match_monument.png";
import trainMatchLogo from "../assets/miniGame/train_match_logo.png";

export default function MiniGamesMenu({ onBack, onOpenTrainMatch, onOpenMonument }) {
  return (
    <main className="mini-games-menu" aria-label="Mini Games">
      <section className="mini-games-scroll">
        <img className="mini-games-scroll-art" src={scrollBackground} alt="" />
        <div className="mini-games-menu-content">
          <button type="button" className="mini-games-menu-back" onClick={onBack}>
            <span aria-hidden="true">&#8592;</span> Back
          </button>
          <h1>Mini Games</h1>
          <p>Choose a game to play</p>
          <button type="button" className="mini-games-choice" onClick={onOpenTrainMatch}>
            <img src={trainMatchLogo} alt="" />
            <span>Train Match</span>
          </button>
          <button type="button" className="mini-games-choice" onClick={onOpenMonument}>
            <img src={monumentLogo} alt="" />
            <span>Match the Monument</span>
          </button>
        </div>
      </section>
    </main>
  );
}
