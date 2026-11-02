import wellingtonTrainStopImage from "../assets/Wellington/wellington train stop.webp";
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
      deAarMode
    />
  );
}
