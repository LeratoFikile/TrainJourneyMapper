import { useState } from "react";
import "./WelcomeJourney.css";
import scrollBackground from "../assets/miniGame/blank-scroll-nobg.png";

const PAGE_COUNT = 4;

export default function WelcomeJourney({ player, onComplete }) {
  const [page, setPage] = useState(0);
  const playerName = player?.name || "Traveller";
  const isLastPage = page === PAGE_COUNT - 1;

  const handleNext = () => {
    if (isLastPage) {
      onComplete();
      return;
    }
    setPage((currentPage) => currentPage + 1);
  };

  return (
    <main className="welcome-journey" aria-label="Journey information">
      <section className="welcome-scroll" role="region" aria-label={`Traveller's guide, page ${page + 1} of ${PAGE_COUNT}`}>
        <img className="welcome-scroll-art" src={scrollBackground} alt="" />
        <div className="welcome-scroll-content">
          <div className="welcome-page-copy" key={page}>
            {page === 0 && (
              <>
                <header className="welcome-heading">
                  <p className="welcome-small-label">YOUR TRAVELLER'S GUIDE</p>
                  <h1>🚂 AHOOY, TRAVELLER! YOUR ADVENTURE AWAITS!</h1>
                  <h2>Welcome aboard, {playerName}!</h2>
                  <p>
                    Tickets, please! Well, not just yet! Before we whistle our way across South
                    Africa, there are a few things you need to know. Every station has a story
                    waiting for you. Grab your bags, keep your eyes open and let's get ready!
                  </p>
                </header>
                <section className="welcome-guide-section">
                  <h2>🎟️ First Things First: Get Your Ticket!</h2>
                  <p>
                    No ticket, no train! You'll need enough money to buy a ticket before boarding.
                    Keep an eye on your funds so you are ready for the next trip.
                  </p>
                </section>
                <section className="welcome-guide-section">
                  <h2>🚂 All Aboard!</h2>
                  <p>
                    Travel across South Africa through towns and cities. Every destination brings
                    places to explore, landmarks to discover and stories to uncover.
                  </p>
                </section>
              </>
            )}

            {page === 1 && (
              <>
                <header className="welcome-heading">
                  <p className="welcome-small-label">ON THE ROAD</p>
                  <h1>Discover as You Travel</h1>
                </header>
                <section className="welcome-guide-section">
                  <h2>🌍 A Little Language Adventure</h2>
                  <p>
                    You may hear greetings and words in indigenous languages spoken in different
                    regions. Don't worry if you don't recognise a word—learn as you go and discover
                    the languages and cultures that make South Africa special.
                  </p>
                </section>
                <section className="welcome-guide-section">
                  <h2>📖 Don't Lose Your Passport!</h2>
                  <p>
                    Complete a level to earn its destination stamp. Check your passport along the
                    way and collect stamps for the stops you explore.
                  </p>
                </section>
              </>
            )}

            {page === 2 && (
              <>
                <header className="welcome-heading">
                  <p className="welcome-small-label">LOOK AFTER YOUR TRAVELLER</p>
                  <h1>Keep Your Supplies Ready</h1>
                </header>
                <section className="welcome-guide-section">
                  <h2>⚡ Keep Your Energy Up!</h2>
                  <p>
                    Travelling and exploring uses energy and your hearts are your lives. If your
                    food or water runs out, you will lose a heart and need to recover before continuing.
                    Keep an eye on your hearts and supplies.
                  </p>
                </section>
                <section className="welcome-guide-section">
                  <h2>🍔 Hungry? Thirsty? Make a Stop!</h2>
                  <p>
                    Hunger and thirst matter too. Visit the shop at each destination to stock up
                    on food and water before setting off again.
                  </p>
                </section>
                <section className="welcome-guide-section">
                  <h2>💰 Running Low on Cash?</h2>
                  <p>
                    Visit the Mini-Games section and play to earn money. A little extra cash can go
                    a long way when you're travelling!
                  </p>
                </section>
              </>
            )}

            {page === 3 && (
              <>
                <header className="welcome-heading">
                  <p className="welcome-small-label">THE FINAL STRETCH</p>
                  <h1>Ready to Prove Yourself?</h1>
                </header>
                <section className="welcome-guide-section">
                  <h2>🧠 Remember What You Discover</h2>
                  <p>
                    At the end of each level, you'll face a short quiz based on what you've
                    learned. Pay attention to the discoveries and see how much you remember!
                  </p>
                </section>
                <section className="welcome-guide-section">
                  <h2>🗺️ Your Mission</h2>
                  <p>
                    Explore every destination, collect passport stamps, learn about South Africa
                    and make it all the way to Cape Town!
                  </p>
                </section>
                <footer className="welcome-farewell">
                  <p><strong>And remember, traveller:</strong></p>
                  <p>Keep your ticket handy, your passport close and your supplies stocked.</p>
                  <p><strong>The whistle is about to blow... ALL ABOARD!</strong></p>
                </footer>
              </>
            )}
          </div>

          <div className="welcome-navigation">
            <button
              type="button"
              className="welcome-page-button"
              onClick={() => setPage((currentPage) => Math.max(0, currentPage - 1))}
              disabled={page === 0}
            >
              <span aria-hidden="true">←</span> Previous
            </button>
            <span className="welcome-page-count" aria-live="polite">
              {page + 1} / {PAGE_COUNT}
            </span>
            <button type="button" className="welcome-page-button welcome-continue" onClick={handleNext}>
              {isLastPage ? "BEGIN JOURNEY" : "Next"} <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
