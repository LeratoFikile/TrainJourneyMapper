import { useEffect, useState } from "react";
import "./SplashScreen.css";

import landingImage from "../assets/elements/landing.jpg";

export default function SplashScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 3000;

    const timer = setTimeout(() => {
      onFinish();
    }, duration);

    const progressTimer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const nextProgress = Math.min(100, (elapsed / duration) * 100);
      setProgress(nextProgress);

      if (nextProgress >= 100) {
        clearInterval(progressTimer);
      }
    }, 30);

    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, [onFinish]);

  return (
    <main className="splash-screen" aria-label="Train Journey Mapper loading screen">
      <img className="splash-landing-image" src={landingImage} alt="Train Journey Mapper — Adventure Awaits" />
      <div
        className="splash-loading"
        role="progressbar"
        aria-label="Loading game"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
      >
        <span className="loading-text">Loading game... {Math.round(progress)}%</span>
        <div className="loading-track">
          <div className="loading-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </main>
  );
}