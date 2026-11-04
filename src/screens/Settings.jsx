import { useEffect, useRef, useState } from "react";
import parchmentScroll from "../assets/miniGame/blank-scroll-nobg.png";
import { DEFAULT_SETTINGS, loadSettings, notifySettingsChanged, saveSettings } from "../settings";
import GameActionDialog from "../components/GameActionDialog";
import AccountAccess from "./AccountAccess";
import LegalDocument from "./LegalDocument";
import "./Settings.css";

export default function Settings({
  onBack,
  onResetProgress,
  onLogOut,
  onDeleteAccount,
  onAuthenticationFlowChange,
}) {
  const [settings, setSettings] = useState(() => {
    try {
      return loadSettings();
    } catch (error) {
      console.error("Could not load settings:", error);
      return { ...DEFAULT_SETTINGS };
    }
  });
  const savedSettingsRef = useRef(settings);
  const [modal, setModal] = useState(null);
  const [saveError, setSaveError] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  const closeTimer = useRef(null);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const closeSettings = (callback = onBack) => {
    if (isClosing) return;
    if (settings.musicVolume !== savedSettingsRef.current.musicVolume) {
      notifySettingsChanged(savedSettingsRef.current);
    }
    setIsClosing(true);
    closeTimer.current = window.setTimeout(callback, 180);
  };

  const updateSetting = (key, value) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    if (key === "musicVolume") {
      notifySettingsChanged({
        ...next,
        effectsVolume: savedSettingsRef.current.effectsVolume,
      });
    }
    setSaveError("");
  };

  const handleSave = () => {
    try {
      const savedSettings = saveSettings(settings);
      savedSettingsRef.current = savedSettings;
      setSettings(savedSettings);
      closeSettings();
    } catch (error) {
      console.error("Could not save settings:", error);
      setSaveError("Settings could not be saved. Check your browser storage and try again.");
    }
  };

  const handleActionConfirm = async ({ password }) => {
    if (modal === "reset") await onResetProgress();
    if (modal === "logout") await onLogOut();
    if (modal === "delete") await onDeleteAccount(password);
    onAuthenticationFlowChange?.(false);
    setModal(null);
  };

  const handleCloseModal = () => {
    onAuthenticationFlowChange?.(false);
    setModal(null);
  };

  return (
    <main className={`settings-screen${isClosing ? " is-closing" : ""}`} aria-label="Settings">
      <section className="settings-scroll" aria-labelledby="settings-title">
        <img className="settings-scroll-art" src={parchmentScroll} alt="" />
        <div className="settings-scroll-content">
          <header className="settings-header">
            <button
              className="settings-back"
              type="button"
              aria-label="Back without saving"
              title="Back without saving"
              onClick={() => closeSettings()}
            >
              <span aria-hidden="true">&#8592;</span>
            </button>
            <div className="settings-heading">
              <span className="settings-kicker"><span aria-hidden="true">&#10022;</span> Traveller&apos;s handbook <span aria-hidden="true">&#10022;</span></span>
              <h1 id="settings-title">Journey Settings</h1>
              <p>Make this adventure your own</p>
            </div>
            <span className="settings-header-spacer" aria-hidden="true" />
          </header>

          <section className="settings-section" aria-labelledby="settings-audio-title">
            <h2 id="settings-audio-title"><span aria-hidden="true">&#9835;</span> Sound on the Rails</h2>
            <label className="settings-slider-row">
              <span><span aria-hidden="true">&#127925;</span> Music volume</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={settings.musicVolume}
                aria-label="Music volume"
                onChange={(event) => updateSetting("musicVolume", Number(event.target.value))}
              />
              <output>{Math.round(settings.musicVolume * 100)}%</output>
            </label>
            <label className="settings-slider-row">
              <span><span aria-hidden="true">&#128266;</span> Sound effects</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={settings.effectsVolume}
                aria-label="Sound effects volume"
                onChange={(event) => updateSetting("effectsVolume", Number(event.target.value))}
              />
              <output>{Math.round(settings.effectsVolume * 100)}%</output>
            </label>
          </section>

          <section className="settings-section" aria-labelledby="settings-preferences-title">
            <h2 id="settings-preferences-title"><span aria-hidden="true">&#9881;</span> Journey Preferences</h2>
            <label className="settings-select-row">
              <span><span aria-hidden="true">&#127760;</span> Language</span>
              <span className="settings-language-control">
                <select
                  value={settings.language}
                  aria-label="Language"
                  onChange={(event) => updateSetting("language", event.target.value)}
                >
                  <option value="English">English</option>
                  <option value="Setswana" disabled>Setswana (Coming soon)</option>
                </select>
                <span className="settings-language-spinner" aria-hidden="true" />
              </span>
            </label>
            <button
              className="settings-toggle-row"
              type="button"
              aria-pressed={settings.notifications}
              onClick={() => updateSetting("notifications", !settings.notifications)}
            >
              <span><span aria-hidden="true">&#128276;</span> Notifications</span>
              <span className={`settings-toggle${settings.notifications ? " is-on" : ""}`} aria-hidden="true">
                <i />
              </span>
              <span className="settings-toggle-value">{settings.notifications ? "On" : "Off"}</span>
            </button>
            <button
              className="settings-toggle-row"
              type="button"
              aria-pressed={settings.vibration}
              onClick={() => updateSetting("vibration", !settings.vibration)}
            >
              <span><span aria-hidden="true">&#128243;</span> Vibration</span>
              <span className={`settings-toggle${settings.vibration ? " is-on" : ""}`} aria-hidden="true">
                <i />
              </span>
              <span className="settings-toggle-value">{settings.vibration ? "On" : "Off"}</span>
            </button>
          </section>

          <section className="settings-section settings-resources" aria-labelledby="settings-resources-title">
            <h2 id="settings-resources-title"><span aria-hidden="true">&#10070;</span> Traveller Resources</h2>
            <button
              type="button"
              className="settings-resource-button"
              onClick={() => {
                onAuthenticationFlowChange?.(true);
                setModal("account");
              }}
            >
              <span aria-hidden="true">&#128279;</span> Sync Account
            </button>
            <div className="settings-resource-links">
              <button type="button" onClick={() => setModal("help")}><span aria-hidden="true">?</span> How to play</button>
              <button type="button" onClick={() => setModal("credits")}><span aria-hidden="true">&#9733;</span> Credits</button>
            </div>
          </section>

          {saveError && <p className="settings-error" role="alert">{saveError}</p>}
          <footer className="settings-footer">
            <p className="settings-save-hint">Your preferences are saved on this device.</p>
            <button className="settings-save" type="button" onClick={handleSave}>
              <span aria-hidden="true">&#10003;</span> Save Settings
            </button>
            <nav className="settings-legal-links" aria-label="Legal information">
              <button type="button" onClick={() => setModal("privacy")}>Privacy Policy</button>
              <span aria-hidden="true">|</span>
              <button type="button" onClick={() => setModal("terms")}>Terms &amp; Conditions</button>
            </nav>
          </footer>

          <section className="settings-section settings-account-section" aria-labelledby="settings-account-title">
            <h2 id="settings-account-title"><span aria-hidden="true">&#9873;</span> Account Management</h2>
            <div className="settings-action-buttons" aria-label="Account actions">
              <button
                className="settings-action-icon"
                type="button"
                aria-label="Log out"
                title="Log out"
                onClick={() => setModal("logout")}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M10 4H5v16h5M14 8l4 4-4 4m4-4H9" />
                </svg>
              </button>
              <button
                className="settings-action-icon"
                type="button"
                aria-label="Reset progress"
                title="Reset progress"
                onClick={() => setModal("reset")}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20 7v5h-5M4.9 9a7 7 0 0 1 11.6-2L20 12M4 17v-5h5m10.1 3a7 7 0 0 1-11.6 2L4 12" />
                </svg>
              </button>
              <button
                className="settings-action-icon settings-action-delete"
                type="button"
                aria-label="Delete account"
                title="Delete account"
                onClick={() => setModal("delete")}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 7h16M9 7V4h6v3m3 0-1 13H7L6 7m4 4v5m4-5v5" />
                </svg>
              </button>
            </div>
          </section>
        </div>
      </section>
      {modal && !["privacy", "terms", "reset", "logout", "delete"].includes(modal) && (
        <div className="settings-dialog-backdrop" role="presentation" onClick={handleCloseModal}>
          <section
            className="settings-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-dialog-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className="settings-dialog-close" onClick={handleCloseModal} aria-label="Close dialog">
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
                  onCancel={handleCloseModal}
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
      {["reset", "logout", "delete"].includes(modal) && (
        <GameActionDialog
          action={modal}
          onCancel={handleCloseModal}
          onConfirm={handleActionConfirm}
          onReauthenticationChange={onAuthenticationFlowChange}
        />
      )}
    </main>
  );
}