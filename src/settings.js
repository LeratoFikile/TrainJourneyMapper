export const DEFAULT_SETTINGS = {
  musicVolume: 0.73,
  effectsVolume: 0.82,
  notifications: true,
  vibration: true,
  language: "English",
};

const SETTINGS_STORAGE_KEY = "trainJourneySettings";

export function loadSettings() {
  const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
  if (!savedSettings) return { ...DEFAULT_SETTINGS };

  const parsedSettings = JSON.parse(savedSettings);
  return {
    musicVolume: clampVolume(parsedSettings.musicVolume, DEFAULT_SETTINGS.musicVolume),
    effectsVolume: clampVolume(parsedSettings.effectsVolume, DEFAULT_SETTINGS.effectsVolume),
    notifications: typeof parsedSettings.notifications === "boolean"
      ? parsedSettings.notifications
      : DEFAULT_SETTINGS.notifications,
    vibration: typeof parsedSettings.vibration === "boolean"
      ? parsedSettings.vibration
      : DEFAULT_SETTINGS.vibration,
    language: parsedSettings.language === "Setswana" ? "Setswana" : "English",
  };
}

function clampVolume(value, fallback) {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.min(1, Math.max(0, value))
    : fallback;
}

export function saveSettings(settings) {
  const safeSettings = {
    musicVolume: clampVolume(settings.musicVolume, DEFAULT_SETTINGS.musicVolume),
    effectsVolume: clampVolume(settings.effectsVolume, DEFAULT_SETTINGS.effectsVolume),
    notifications: Boolean(settings.notifications),
    vibration: Boolean(settings.vibration),
    language: settings.language === "Setswana" ? "Setswana" : "English",
  };

  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(safeSettings));
  window.dispatchEvent(new CustomEvent("train-journey-settings-changed", { detail: safeSettings }));
  return safeSettings;
}

export function createConfiguredAudio(source, category = "effects") {
  const audio = new Audio(source);
  const applySettings = (settings) => {
    const volume = category === "music" ? settings.musicVolume : settings.effectsVolume;
    audio.volume = volume;
    audio.muted = volume === 0;
  };

  try {
    applySettings(loadSettings());
  } catch (error) {
    console.error("Could not load audio settings:", error);
    applySettings(DEFAULT_SETTINGS);
  }

  const handleSettingsChange = (event) => applySettings(event.detail);
  const removeSettingsListener = () => {
    window.removeEventListener("train-journey-settings-changed", handleSettingsChange);
    audio.removeEventListener("ended", removeSettingsListener);
    audio.removeEventListener("pause", removeSettingsListener);
  };

  window.addEventListener("train-journey-settings-changed", handleSettingsChange);
  audio.addEventListener("ended", removeSettingsListener, { once: true });
  audio.addEventListener("pause", removeSettingsListener, { once: true });

  return audio;
}

export function notificationsEnabled() {
  try {
    return loadSettings().notifications;
  } catch (error) {
    console.error("Could not read notification setting:", error);
    return DEFAULT_SETTINGS.notifications;
  }
}

export function triggerVibration(pattern = 40) {
  try {
    if (loadSettings().vibration && "vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  } catch (error) {
    console.error("Could not read vibration setting:", error);
  }
}
