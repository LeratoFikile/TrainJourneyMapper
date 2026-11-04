import wellingtonTrainStopImage from "../assets/Wellington/wellington train stop.webp";
import wellingtonExploreVideo from "../assets/Wellington/wellington_explore.mp4";
import PretoriaLevel from "./PretoriaLevel";

export default function WellingtonLevel({
  player,
  onBack,
  onBoardTrain,
  onPlayerStateChange,
  onOpenMiniGame,
}) {
  return (
    <PretoriaLevel
      player={player}
      onBack={onBack}
      onBoardTrain={onBoardTrain}
      onPlayerStateChange={onPlayerStateChange}
      onOpenMiniGame={onOpenMiniGame}
      location="Wellington"
      levelImage={wellingtonTrainStopImage}
      exploreVideoSource={wellingtonExploreVideo}
      deAarMode
    />
  );
}
