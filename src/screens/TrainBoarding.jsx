import { useEffect, useRef } from "react";
import boardingVideo from "../assets/videos/train_boarding.mp4";
import trainSound from "../assets/sounds/train_sound_chu_chu.mp3";
import "./TrainBoarding.css";
import { createConfiguredAudio } from "../settings";

export default function TrainBoarding({ onComplete, videoSource = boardingVideo }) {
  const soundRef = useRef(null);

  useEffect(() => {
    const sound = createConfiguredAudio(trainSound);
    soundRef.current = sound;

    return () => {
      sound.pause();
      sound.currentTime = 0;
    };
  }, []);

  const handleVideoPlay = () => {
    const sound = soundRef.current;
    if (!sound) return;

    sound.currentTime = 0;
    sound.play().catch(() => undefined);
  };

  return (
    <main className="train-boarding" aria-label="Boarding train">
      <video
        className="train-boarding-video"
        src={videoSource}
        autoPlay
        playsInline
        preload="auto"
        onPlay={handleVideoPlay}
        onEnded={onComplete}
      />
    </main>
  );
}
