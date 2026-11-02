import worcesterTrainStopImage from "../assets/Worcester/Worcester_train_stop.png";
import PretoriaLevel from "./PretoriaLevel";

export default function WorcesterLevel({
  player,
  onBack,
  onBoardTrain,
  onPlayerStateChange,
  onOpenMiniGame,
  exploreVideoSource,
}) {
  return (
    <PretoriaLevel
      player={player}
      onBack={onBack}
      onBoardTrain={onBoardTrain}
      onPlayerStateChange={onPlayerStateChange}
      onOpenMiniGame={onOpenMiniGame}
      exploreVideoSource={exploreVideoSource}
      location="Worcester"
      levelImage={worcesterTrainStopImage}
      deAarMode
    />
  );
}
