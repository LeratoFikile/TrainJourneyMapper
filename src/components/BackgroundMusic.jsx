import { useEffect, useRef } from "react";
import backgroundMusic from "../assets/music/background_music.mp3";
import { loadSettings } from "../settings";

export default function BackgroundMusic({ active }) {
  const audioRef = useRef(null);
  const activeRef = useRef(active);
  const gestureHandlerRef = useRef(null);
  const playbackRef = useRef(null);

  useEffect(() => {
    const handleSettingsChange = (event) => {
      const audio = audioRef.current;
      if (!audio) return;

      audio.volume = event.detail.musicVolume;
      audio.muted = event.detail.musicVolume === 0;
      if (audio.muted) {
        audio.pause();
      } else if (activeRef.current && audio.paused) {
        playbackRef.current?.();
      }
    };

    window.addEventListener("train-journey-settings-changed", handleSettingsChange);
    return () => window.removeEventListener("train-journey-settings-changed", handleSettingsChange);
  }, []);

  useEffect(() => {
    activeRef.current = active;
    let audio = audioRef.current;
    if (!active) {
      audio?.pause();
      return undefined;
    }

    if (!audio) {
      audio = new Audio(backgroundMusic);
      audio.loop = true;
      audio.preload = "auto";
      audio.addEventListener("error", () => {
        console.error("Could not load background music:", audio.error);
      });
      audioRef.current = audio;
    }

    const removeGestureHandlers = () => {
      if (!gestureHandlerRef.current) return;
      window.removeEventListener("pointerdown", gestureHandlerRef.current);
      window.removeEventListener("keydown", gestureHandlerRef.current);
      gestureHandlerRef.current = null;
    };

    const startPlayback = () => {
      if (!activeRef.current || audio.muted) return;
      audio.play().then(removeGestureHandlers).catch((error) => {
        if (error.name === "AbortError") return;
        if (error.name === "NotAllowedError") {
          if (gestureHandlerRef.current) return;
          gestureHandlerRef.current = () => {
            removeGestureHandlers();
            audio.play().catch((playError) => {
              if (playError.name === "AbortError") return;
              console.error("Could not play background music after user interaction:", playError);
            });
          };
          window.addEventListener("pointerdown", gestureHandlerRef.current, { once: true });
          window.addEventListener("keydown", gestureHandlerRef.current, { once: true });
          return;
        }
        console.error("Could not play background music:", error);
      });
    };
    playbackRef.current = startPlayback;

    try {
      const settings = loadSettings();
      audio.volume = settings.musicVolume;
      audio.muted = settings.musicVolume === 0;
      if (!audio.muted) startPlayback();
    } catch (error) {
      console.error("Could not load background music settings:", error);
      audio.volume = 0;
      audio.muted = true;
    }

    return () => {
      removeGestureHandlers();
      playbackRef.current = null;
      audio.pause();
    };
  }, [active]);

  return null;
}
