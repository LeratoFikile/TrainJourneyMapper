import { useState } from "react";
import settingsBackground from "../assets/elements/settings.jpg";
import { DEFAULT_SETTINGS, loadSettings, saveSettings } from "../settings";
import AccountAccess from "./AccountAccess";
import LegalDocument from "./LegalDocument";
import "./Settings.css";

export default function Settings({ onBack, onResetProgress }) {
  const [settings, setSettings] = useState(() => {
    try {
      return loadSettings();
    } catch (error) {
      console.error("Could not load settings:", error);
      return { ...DEFAULT_SETTINGS };
    }
  });
  const [modal, setModal] = useState(null);
  const [saveError, setSaveError] = useState("");

  const updateSetting = (key, value) => {
    setSettings((current) => ({ ...current, [key]: value }));
    setSaveError("");
  };

  const handleSave = () => {
    try {
      const savedSettings = saveSettings(settings);
      setSettings(savedSettings);
      onBack();
    } catch (error) {
      console.error("Could not save settings:", error);
      setSaveError("Settings could not be saved. Check your browser storage and try again.");
    }
  };

  return (
    <main className="settings-screen" aria-label="Settings">
      <div className="settings-artboard">
        <img className="settings-background" src={settingsBackground} alt="" />
        <button
          className="settings-hit settings-back"
          type="button"
          aria-label="Back without saving"
          onClick={onBack}
        />
        <label className="settings-control settings-music">
          <span className="settings-visually-hidden">Music volume</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={settings.musicVolume}
            onChange={(event) => updateSetting("musicVolume", Number(event.target.value))}
          />
        </label>
        <label className="settings-control settings-effects">
          <span className="settings-visually-hidden">Sound effects volume</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={settings.effectsVolume}
            onChange={(event) => updateSetting("effectsVolume", Number(event.target.value))}
          />
        </label>
        <button
          className={`settings-hit settings-notifications${settings.notifications ? " is-on" : ""}`}
          type="button"
          aria-pressed={settings.notifications}
          aria-label={`Notifications ${settings.notifications ? "on" : "off"}`}
          onClick={() => updateSetting("notifications", !settings.notifications)}
        />
        <button
          className={`settings-hit settings-vibration${settings.vibration ? " is-on" : ""}`}
          type="button"
          aria-pressed={settings.vibration}
          aria-label={`Vibration ${settings.vibration ? "on" : "off"}`}
          onClick={() => updateSetting("vibration", !settings.vibration)}
        />
        <label className="settings-control settings-language">
          <span className="settings-visually-hidden">Language</span>
          <select
            value={settings.language}
            onChange={(event) => updateSetting("language", event.target.value)}
          >
            <option>English</option>
            <option>Setswana</option>
          </select>
        </label>
        <button
          className="settings-account-action"
          type="button"
          onClick={() => setModal("account")}
        >
          Sync Account
        </button>
        <button
          className="settings-hit settings-help"
          type="button"
          aria-label="How to play"
          onClick={() => setModal("help")}
        />
        <button
          className="settings-hit settings-credits"
          type="button"
          aria-label="Credits"
          onClick={() => setModal("credits")}
        />
        <button
          className="settings-hit settings-reset"
          type="button"
          aria-label="Reset progress"
          onClick={() => setModal("reset")}
        />
        <button
          className="settings-hit settings-save"
          type="button"
          aria-label="Save settings and go back"
          onClick={handleSave}
        />
        {saveError && <p className="settings-error" role="alert">{saveError}</p>}
      </div>
      {modal && modal !== "privacy" && modal !== "terms" && (
        <div className="settings-dialog-backdrop" role="presentation" onClick={() => setModal(null)}>
          <section
            className="settings-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-dialog-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className="settings-dialog-close" onClick={() => setModal(null)} aria-label="Close dialog">
              ×
            </button>
            {modal === "help" && (
              <>
                <h2 id="settings-dialog-title">How to play</h2>
                <p>Explore each station, manage your inventory and traveller needs, and buy supplies before boarding the train.</p>
                <p>Use the phone and guide on board, then read each journey scroll in order to reach the next stop.</p>
              </>
            )}
            {modal === "account" && (
              <>
                <h2 id="settings-dialog-title">Sync your journey</h2>
                <AccountAccess
                  mode="link"
                  embedded
                  onCancel={() => setModal(null)}
                />
              </>
            )}
            {modal === "credits" && (
              <div className="settings-credits-content">
                <h2 id="settings-dialog-title">Credits &amp; Acknowledgements</h2>
                <h3>Game Concept &amp; Development</h3>
                <p>Conceptualised and developed by <strong>Lerato Malatjie</strong>.</p>

                <h3>Research &amp; Educational Content</h3>
                <p>
                  The educational information presented in this game is based on research into South African
                  history, geography, towns, landmarks, railway heritage and cultural heritage.
                </p>
                <p>Research and reference sources include:</p>
                <ul>
                  <li>Beaufort West Municipality</li>
                  <li>Beaufort West Tourism</li>
                  <li>Laingsburg Municipality</li>
                  <li>South African History Online</li>
                  <li>Official Matjiesfontein Website</li>
                  <li>Touwsrivier Tourism</li>
                  <li>Breede Valley Municipality</li>
                  <li>Hex River Valley Tourism</li>
                  <li>Worcester Tourism</li>
                </ul>
                <p>Additional research sources will be acknowledged as new routes and educational content are added.</p>

                <h3>AI-Generated Artwork &amp; Media</h3>
                <p>
                  The images, illustrations and videos featured in this game were generated using artificial
                  intelligence tools. They were not originally drawn, photographed, filmed or designed by the developer.
                </p>
                <p>AI tools used include:</p>
                <ul>
                  <li>Pixa</li>
                  <li>Arena AI</li>
                  <li>Claude AI</li>
                  <li>ChatGPT by OpenAI</li>
                </ul>
                <p>These tools assisted in generating visual assets and supporting the creative development of the game.</p>

                <h3>Sound Effects &amp; Music</h3>
                <p>
                  Sound effects and audio resources, including background music, were sourced from <strong>Pixabay</strong>
                  {" "}and are used in accordance with the platform&apos;s content licence.
                </p>

                <h3>Special Acknowledgements</h3>
                <p>
                  This is an independent educational game created to celebrate South Africa&apos;s diverse history,
                  landscapes, communities and cultural heritage.
                </p>
                <p>
                  Special appreciation goes to the organisations, researchers and information platforms whose
                  resources contributed to the educational content of this project.
                </p>

                <h3>Disclaimer</h3>
                <p>
                  This project is independently developed and is not affiliated with or officially endorsed by any
                  of the organisations or platforms mentioned above.
                </p>
                <p>
                  All educational information is based on research and referenced sources. AI-generated media is used
                  for illustrative and educational purposes.
                </p>
              </div>
            )}
            {modal === "reset" && (
              <>
                <h2 id="settings-dialog-title">Reset progress?</h2>
                <p>This clears your completed stops, passport stamps, inventory, and money. This cannot be undone.</p>
                <div className="settings-dialog-actions">
                  <button type="button" onClick={() => setModal(null)}>Cancel</button>
                  <button type="button" onClick={() => { onResetProgress(); setModal(null); }}>
                    Reset progress
                  </button>
                </div>
              </>
            )}
            <nav className="settings-legal-links" aria-label="Legal information">
              <button type="button" onClick={() => setModal("privacy")}>Privacy Policy</button>
              <span aria-hidden="true">|</span>
              <button type="button" onClick={() => setModal("terms")}>Terms &amp; Conditions</button>
            </nav>
          </section>
        </div>
      )}
      {(modal === "privacy" || modal === "terms") && (
        <LegalDocument type={modal} onBack={() => setModal(null)} />
      )}
    </main>
  );
}