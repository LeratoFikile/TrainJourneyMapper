import bellvilleTrainStopImage from "../assets/Bellville/Bellville_train_stop.webp";
import PretoriaLevel from "./PretoriaLevel";

export default function BellvilleLevel({
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
      location="Bellville"
      levelImage={bellvilleTrainStopImage}
      deAarMode
    />
  );
}
