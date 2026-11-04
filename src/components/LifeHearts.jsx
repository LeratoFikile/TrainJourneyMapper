import { useEffect, useState } from "react";
import "./LifeHearts.css";
import { getActiveHeartLosses, HEART_REGENERATION_MS, MAX_HEARTS } from "../gameplay/lives";

export default function LifeHearts({ lossTimestamps = [] }) {
  const [now, setNow] = useState(0);
  const activeLosses = getActiveHeartLosses(lossTimestamps, now);
  const availableHearts = MAX_HEARTS - activeLosses.length;
  const nextHeartAt = (activeLosses[0] || 0) + HEART_REGENERATION_MS;
  const timeUntilNextHeart = Math.max(0, nextHeartAt - now);
  const hours = String(Math.floor(timeUntilNextHeart / 3_600_000)).padStart(2, "0");
  const minutes = String(Math.floor((timeUntilNextHeart % 3_600_000) / 60_000)).padStart(2, "0");
  const seconds = String(Math.floor((timeUntilNextHeart % 60_000) / 1000)).padStart(2, "0");

  useEffect(() => {
    const initialTimer = window.setTimeout(() => setNow(Date.now()), 0);
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div className="life-hearts" role="img" aria-label={`${availableHearts} of ${MAX_HEARTS} hearts remaining`}>
      <span className="life-hearts-icons" aria-hidden="true">
        {Array.from({ length: MAX_HEARTS }, (_, index) => (
          <span className={index < availableHearts ? "life-heart-full" : "life-heart-empty"} key={index}>
            {index < availableHearts ? "\u2665" : "\u2661"}
          </span>
        ))}
      </span>
      {activeLosses.length > 0 && (
        <span className="life-hearts-timer">
          Next heart in {hours}:{minutes}:{seconds}
        </span>
      )}
    </div>
  );
}
