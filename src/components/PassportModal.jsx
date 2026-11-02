import passportTitle from "../assets/elements/passport.png";
import scrollBackground from "../assets/miniGame/blank-scroll-nobg.png";
import pretoriaStamp from "../assets/elements/pretoria_stamp.png";
import kimberleyStamp from "../assets/elements/kimberley_stamp.png";
import deAarStamp from "../assets/elements/de_aar_stamp.png";
import beaufortWestStamp from "../assets/elements/beaufort_west_stamp.png";
import worcesterStamp from "../assets/elements/worcester_stamp.png";
import wellingtonStamp from "../assets/elements/wellington_stamp.png";
import bellvilleStamp from "../assets/elements/bellville_stamp.png";
import capeTownStamp from "../assets/elements/cape_town_stamp.png";
import skin1 from "../assets/characters/players/skin1.png";
import skin2 from "../assets/characters/players/skin2.png";
import skin3 from "../assets/characters/players/skin3.png";
import skin4 from "../assets/characters/players/skin4.png";
import skin5 from "../assets/characters/players/skin5.png";
import skin6 from "../assets/characters/players/skin6.png";
import guideMamzo from "../assets/characters/guides/mamzo.png";
import guideMalume from "../assets/characters/guides/malume.png";
import "./PassportModal.css";

const PLAYER_SKINS = {
  skin_01: skin1,
  skin_02: skin2,
  skin_03: skin3,
  skin_04: skin4,
  skin_05: skin5,
  skin_06: skin6,
};

const STOPS = [
  ["pretoria", "Pretoria"],
  ["kimberley", "Kimberley"],
  ["de-aar", "De Aar"],
  ["beaufort-west", "Beaufort West"],
  ["worcester", "Worcester"],
  ["wellington", "Wellington"],
  ["bellville", "Bellville"],
  ["cape-town", "Cape Town"],
];

const STAMP_IMAGES = {
  pretoria: pretoriaStamp,
  kimberley: kimberleyStamp,
  "de-aar": deAarStamp,
  "beaufort-west": beaufortWestStamp,
  worcester: worcesterStamp,
  wellington: wellingtonStamp,
  bellville: bellvilleStamp,
  "cape-town": capeTownStamp,
};

export default function PassportModal({ player, onClose }) {
  const playerName = player?.name || "Traveller";
  const playerSkin = PLAYER_SKINS[player?.skin] || skin1;
  const guideName = player?.guide === "mamzo" ? "Mamzo" : "Malume";
  const guideImage = player?.guide === "mamzo" ? guideMamzo : guideMalume;
  const stamps = player?.passport || [];

  return (
    <div className="passport-backdrop" onClick={onClose}>
      <section
        className="passport-scroll"
        role="dialog"
        aria-label="Traveller passport"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <img className="passport-scroll-art" src={scrollBackground} alt="" />
        <button
          type="button"
          className="passport-close"
          onClick={onClose}
          aria-label="Close passport"
          title="Close passport"
        >
          ×
        </button>
        <div className="passport-content">
          <img className="passport-title" src={passportTitle} alt="Passport" />
          <section className="passport-traveller-card" aria-label="Registered traveller details">
            <img className="passport-traveller" src={playerSkin} alt={`${playerName}'s registered character`} />
            <div className="passport-details">
              <p><strong>Traveller</strong><span>{playerName}</span></p>
              <p><strong>Date of birth</strong><span>{player?.dateOfBirth || "Not provided"}</span></p>
              <p><strong>Gender</strong><span>{player?.gender || "Not provided"}</span></p>
              <p><strong>Province</strong><span>{player?.province || "Not provided"}</span></p>
              <div className="passport-guide">
                <img src={guideImage} alt={`${guideName}, registered tour guide`} />
                <p><strong>Tour guide</strong><span>{guideName}</span></p>
              </div>
            </div>
          </section>
          <section className="passport-stamps" aria-label="Journey stamps">
            <div className="passport-stamps-heading">
              <h2>Journey Stamps</h2>
              <strong>{stamps.length} / {STOPS.length}</strong>
            </div>
            <div className="passport-stamp-grid">
              {STOPS.map(([id, name]) => {
                const earned = stamps.some((stamp) => stamp.id === id);
                return (
                  <div
                    className={`passport-stamp${earned ? " earned" : ""}`}
                    key={id}
                    title={earned ? `${name} stamp earned` : `${name} stamp not earned`}
                    aria-label={`${name}: ${earned ? "stamp earned" : "not yet earned"}`}
                  >
                    {earned ? (
                      <img src={STAMP_IMAGES[id]} alt="" />
                    ) : (
                      <span className="passport-stamp-pending" aria-hidden="true">?</span>
                    )}
                    <span className="passport-stamp-name">{name}</span>
                    <small>{earned ? "Collected" : "Not yet visited"}</small>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
