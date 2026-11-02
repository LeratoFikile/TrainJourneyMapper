import { useEffect, useRef, useState } from "react";
import trainInsideImage from "../assets/elements/train_inside.png";
import kimberleyTrainInsideImage from "../assets/elements/kimberley_train_inside_1.png";
import kimberleyTrainInsideFinishedImage from "../assets/elements/kimberley_train_inside_2.png";
import deAarTrainInsideOneImage from "../assets/De_Aar_images/de_aar_train_inside_1.png";
import deAarTrainInsideTwoImage from "../assets/De_Aar_images/de_aar_train_inside_2.png";
import deAarTrainInsideVideo from "../assets/De_Aar_images/de_aar_train_inside_video.mp4";
import deAarTrainMovingVideo from "../assets/De_Aar_images/de_aar_train_moving.mp4";
import deAarScroll00 from "../assets/De_Aar_images/00_map_overview.png";
import deAarScroll01 from "../assets/De_Aar_images/01_de_aar.png";
import deAarScroll02 from "../assets/De_Aar_images/02_hillsdene.png";
import deAarScroll03 from "../assets/De_Aar_images/03_moddersdale.png";
import deAarScroll04 from "../assets/De_Aar_images/04_nelsville.png";
import deAarScroll05 from "../assets/De_Aar_images/05_middleburg.png";
import deAarScroll06 from "../assets/De_Aar_images/06_beaufort_west.png";
import beaufortWestTrainInsideOneImage from "../assets/Beaufort West/Beaufort_West_tain_inside_1.png";
import beaufortWestTrainInsideTwoImage from "../assets/Beaufort West/Beaufort_West_tain_inside_2.png";
import beaufortWestInsideVideo from "../assets/Beaufort West/train_inside.mp4";
import beaufortWestTrainMovingVideo from "../assets/Beaufort West/Beaufort_West_train_leaving.mp4";
import worcesterTrainInsideOneImage from "../assets/Worcester/train_inside_1.webp";
import worcesterTrainInsideTwoImage from "../assets/Worcester/Worcester_train_insife_2.png";
import worcesterTrainInsideVideo from "../assets/Worcester/trains_inside.mp4";
import worcesterTrainMovingVideo from "../assets/Worcester/worcester_train_leaving.mp4";
import worcesterScroll00 from "../assets/Worcester/0_title.png";
import worcesterScroll01 from "../assets/Worcester/1_worcester.png";
import worcesterScroll02 from "../assets/Worcester/2_breede_river_valley.png";
import worcesterScroll03 from "../assets/Worcester/3_paarl.png";
import worcesterScroll04 from "../assets/Worcester/4_paarl_mountain.png";
import worcesterScroll05 from "../assets/Worcester/5_afrikaans_language_monument.png";
import worcesterScroll06 from "../assets/Worcester/6_wellington.png";
import wellingtonTrainInsideOneImage from "../assets/Wellington/wellington_train_inside_1.webp";
import wellingtonTrainInsideTwoImage from "../assets/Wellington/wellington_train_inside_2.webp";
import wellingtonTrainMovingVideo from "../assets/Wellington/wellington_train_moving.mp4";
import bellvilleTrainInsideOneImage from "../assets/Bellville/Bellville_train_inside_1.webp";
import bellvilleTrainInsideTwoImage from "../assets/Bellville/Bellville_train_inside_2.webp";
import bellvilleTrainInsideVideo from "../assets/Bellville/Bellvile_train_inside.mp4";
import bellvilleTrainMovingVideo from "../assets/Bellville/Bellville_train_moving.mp4";
import bellvilleScroll00 from "../assets/Bellville/00_bellville_to_cape_town_overview.png";
import bellvilleScroll01 from "../assets/Bellville/01_bellville.png";
import bellvilleScroll02 from "../assets/Bellville/02_goodwood.png";
import bellvilleScroll03 from "../assets/Bellville/03_cape_town.png";
import wellingtonScroll00 from "../assets/Wellington/00_wellington_to_bellville_overview.png";
import wellingtonScroll01 from "../assets/Wellington/01_wellington.png";
import wellingtonScroll02 from "../assets/Wellington/02_paarl.png";
import wellingtonScroll03 from "../assets/Wellington/03_stellenbosch.png";
import wellingtonScroll04 from "../assets/Wellington/04_kuilsrivier.png";
import wellingtonScroll05 from "../assets/Wellington/05_bellville.png";
import beaufortWestScroll00 from "../assets/Beaufort West/00_map_overview.png";
import beaufortWestScroll01 from "../assets/Beaufort West/01_beaufort_west.png";
import beaufortWestScroll02 from "../assets/Beaufort West/02_laingsburg.png";
import beaufortWestScroll03 from "../assets/Beaufort West/03_matjiesfontein.png";
import beaufortWestScroll04 from "../assets/Beaufort West/04_touws_river.png";
import beaufortWestScroll05 from "../assets/Beaufort West/05_de_doorns.png";
import beaufortWestScroll06 from "../assets/Beaufort West/06_worcester.png";
import trainSceneImage from "../assets/elements/train_scene.png";
import journeyOverviewScroll from "../assets/elements/scroll1.png";
import scrollPretoria from "../assets/elements/scroll_1_pretoria.png";
import scrollVaalRiver from "../assets/elements/scroll_2_vaal_river.png";
import scrollJohannesburg from "../assets/elements/scroll_3_johannesburg.png";
import scrollFreeState from "../assets/elements/scroll_4_free_state_landscapes.png";
import scrollBloemfontein from "../assets/elements/scroll_5_bloemfontein.png";
import scrollKimberley from "../assets/elements/scroll_6_kimberley.png";
import kimberleyToDeAarMap from "../assets/elements/kimberley-to-de-aar-map-nobg.png";
import scrollKimberleyStop from "../assets/elements/1-kimberley-nobg.png";
import scrollOrangeRiver from "../assets/elements/2-orange-river-nobg.png";
import scrollHopetown from "../assets/elements/3-hopetown-nobg.png";
import scrollStrydenburg from "../assets/elements/4-strydenburg-nobg.png";
import scrollBritstown from "../assets/elements/5-britstown-nobg.png";
import scrollDeAar from "../assets/elements/6-de-aar-nobg.png";
import trophyImage from "../assets/elements/trophy.png";
import navIconCollection from "../assets/elements/navicon_collection.png";
import phoneImage from "../assets/elements/phone.png";
import guideMamzoHalf from "../assets/characters/guides/mamzohalf.png";
import guideMalumeHalf from "../assets/characters/guides/malumehalf.png";
import skin1 from "../assets/characters/players/skin1.png";
import skin2 from "../assets/characters/players/skin2.png";
import skin3 from "../assets/characters/players/skin3.png";
import skin4 from "../assets/characters/players/skin4.png";
import skin5 from "../assets/characters/players/skin5.png";
import skin6 from "../assets/characters/players/skin6.png";
import phoneRingSound from "../assets/sounds/phone_ring.mp3";
import drinkingWaterSound from "../assets/sounds/drinking_water.mp3";
import eatingSound from "../assets/sounds/eating.mp3";
import trainTalksVideo from "../assets/videos/train_talks_video.mp4";
import kimberleyTrainInsideVideo from "../assets/videos/kimberley_train_inside_video.mp4";
import leavingPretoriaTrainVideo from "../assets/videos/leaving_pretoria_train.mp4";
import trainTalksSound from "../assets/sounds/train_talks_sound.mp3";
import trainStopSound from "../assets/sounds/train_stop.mp3";
import "./TrainInside.css";
import { createConfiguredAudio, triggerVibration } from "../settings";
import JourneyKnowledgeQuiz from "./JourneyKnowledgeQuiz";

const PLAYER_SKINS = {
  skin_01: skin1,
  skin_02: skin2,
  skin_03: skin3,
  skin_04: skin4,
  skin_05: skin5,
  skin_06: skin6,
};
const ITEM_LABELS = {
  water: ["Water bottle", "\uD83D\uDCA7"],
  wallet: ["Wallet", "\uD83D\uDCB0"],
  sandwich: ["Sandwich", "\uD83C\uDF54"],
  map: ["Map", "\uD83D\uDDFA"],
  ticket: ["Ticket", "\uD83C\uDF9F\uFE0F"],
};
const JOURNEY_SCROLLS = [
  journeyOverviewScroll,
  scrollPretoria,
  scrollVaalRiver,
  scrollJohannesburg,
  scrollFreeState,
  scrollBloemfontein,
  scrollKimberley,
];
const KIMBERLEY_JOURNEY_SCROLLS = [
  kimberleyToDeAarMap,
  scrollKimberleyStop,
  scrollOrangeRiver,
  scrollHopetown,
  scrollStrydenburg,
  scrollBritstown,
  scrollDeAar,
];
const DE_AAR_JOURNEY_SCROLLS = [
  deAarScroll00,
  deAarScroll01,
  deAarScroll02,
  deAarScroll03,
  deAarScroll04,
  deAarScroll05,
  deAarScroll06,
];
const BEAUFORT_WEST_JOURNEY_SCROLLS = [
  beaufortWestScroll00,
  beaufortWestScroll01,
  beaufortWestScroll02,
  beaufortWestScroll03,
  beaufortWestScroll04,
  beaufortWestScroll05,
  beaufortWestScroll06,
];
const WORCESTER_JOURNEY_SCROLLS = [
  worcesterScroll00,
  worcesterScroll01,
  worcesterScroll02,
  worcesterScroll03,
  worcesterScroll04,
  worcesterScroll05,
  worcesterScroll06,
];
const WELLINGTON_JOURNEY_SCROLLS = [
  wellingtonScroll00,
  wellingtonScroll01,
  wellingtonScroll02,
  wellingtonScroll03,
  wellingtonScroll04,
  wellingtonScroll05,
];
const BELLVILLE_JOURNEY_SCROLLS = [
  bellvilleScroll00,
  bellvilleScroll01,
  bellvilleScroll02,
  bellvilleScroll03,
];
const SCROLL_READING_COST = 1;
const PHONE_CALL_MESSAGES = {
  pretoria: [
    "Lena, leeto ke la hao.",
    "Re tla kopana Kimberley.",
    "Hona le motho o rekisang; fa o lapile,",
    "reka selo sa go ja mme o tshware dilo tsa hao sentle.",
    "Sharp!",
  ],
  kimberley: [
    "Before we leave, here's something interesting:",
    "Kimberley's Big Hole was dug by thousands",
    "of miners searching for diamonds!",
  ],
  "de-aar": [
    "Did you know? The San and Khoe people",
    "left ancient rock engravings here, preserving",
    "traces of their history and culture!",
  ],
  "beaufort-west": [
    "Here's something to remember:",
    "Karoo fossils help scientists understand",
    "creatures that lived millions of years ago!",
  ],
  worcester: [
    "A little nature fact: Karoo succulents",
    "store water in their leaves and stems",
    "to survive dry conditions!",
  ],
  wellington: [
    "Did you know? Bain's Kloof Pass was built",
    "using convict labour and helped connect",
    "the Cape with the interior!",
  ],
  bellville: [
    "Here's a fun fact: Bellville's historic",
    "12th Milepost marked a distance of",
    "twelve miles from Cape Town!",
  ],
};

export default function TrainInside({ player, needs, acquiredItems = [], onBack, onPlayerStateChange, onKnowledgeQuizComplete, onComplete, scene = "pretoria" }) {
  const [currentNeeds, setCurrentNeeds] = useState(needs || { life: 100, hunger: 86, water: 92 });
  const traveller = PLAYER_SKINS[player?.skin] || skin1;
  const isDeAar = scene === "de-aar";
  const isBeaufortWest = scene === "beaufort-west";
  const isWorcester = scene === "worcester";
  const isWellington = scene === "wellington";
  const isBellville = scene === "bellville";
  const hasStopInteriorSequence = isDeAar || isBeaufortWest || isWorcester || isWellington || isBellville;
  const hasJourneyScrolls = isDeAar || isBeaufortWest || isWorcester || isWellington || isBellville;
  const insideTrainImage = scene === "kimberley"
    ? kimberleyTrainInsideImage
    : isBellville ? bellvilleTrainInsideOneImage
      : isWellington ? wellingtonTrainInsideOneImage
      : isWorcester ? worcesterTrainInsideOneImage
      : isBeaufortWest ? beaufortWestTrainInsideOneImage
      : isDeAar ? deAarTrainInsideOneImage : trainInsideImage;
  const finishedTrainImage = scene === "kimberley" ? kimberleyTrainInsideFinishedImage : trainSceneImage;
  const journeyScrolls = isBeaufortWest
    ? BEAUFORT_WEST_JOURNEY_SCROLLS
    : isWorcester ? WORCESTER_JOURNEY_SCROLLS
      : isWellington ? WELLINGTON_JOURNEY_SCROLLS
    : isBellville ? BELLVILLE_JOURNEY_SCROLLS
    : isDeAar ? DE_AAR_JOURNEY_SCROLLS
      : scene === "kimberley" ? KIMBERLEY_JOURNEY_SCROLLS : JOURNEY_SCROLLS;
  const trainTalksVideoSource = scene === "kimberley"
    ? kimberleyTrainInsideVideo
    : isBellville ? bellvilleTrainInsideVideo
      : isWorcester ? worcesterTrainInsideVideo
      : isBeaufortWest ? beaufortWestInsideVideo
      : isDeAar ? deAarTrainInsideVideo : trainTalksVideo;
  const stopTrainMovingVideo = isBellville ? bellvilleTrainMovingVideo
    : isWellington ? wellingtonTrainMovingVideo
    : isWorcester ? worcesterTrainMovingVideo
      : isBeaufortWest ? beaufortWestTrainMovingVideo : deAarTrainMovingVideo;
  const secondInteriorImage = isBellville ? bellvilleTrainInsideTwoImage
    : isWellington ? wellingtonTrainInsideTwoImage
    : isWorcester ? worcesterTrainInsideTwoImage
      : isBeaufortWest ? beaufortWestTrainInsideTwoImage : deAarTrainInsideTwoImage;
  const guide = player?.guide === "mamzo" ? guideMamzoHalf : guideMalumeHalf;
  const phoneCallMessage = PHONE_CALL_MESSAGES[scene] || PHONE_CALL_MESSAGES.pretoria;
  const phoneSoundRef = useRef(null);
  const trainTalksSoundRef = useRef(null);
  const trainStopSoundRef = useRef(null);
  const [phoneAnswered, setPhoneAnswered] = useState(false);
  const [guideMessageVisible, setGuideMessageVisible] = useState(true);
  const [trainTalksPlaying, setTrainTalksPlaying] = useState(false);
  const [trainTalksFinished, setTrainTalksFinished] = useState(false);
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const [currentScroll, setCurrentScroll] = useState(0);
  const [isScrollOpen, setIsScrollOpen] = useState(false);
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [deAarInsideIndex, setDeAarInsideIndex] = useState(0);
  const [deAarMoving, setDeAarMoving] = useState(false);

  const stopTrainTalksSound = () => {
    const sound = trainTalksSoundRef.current;
    if (!sound) return;

    sound.pause();
    sound.currentTime = 0;
    trainTalksSoundRef.current = null;
  };

  const stopTrainStopSound = () => {
    const sound = trainStopSoundRef.current;
    if (!sound) return;

    sound.pause();
    sound.currentTime = 0;
    trainStopSoundRef.current = null;
  };

  const stopPhoneSound = () => {
    const sound = phoneSoundRef.current;
    if (!sound) return;

    sound.pause();
    sound.currentTime = 0;
  };

  useEffect(() => {
    const sound = createConfiguredAudio(phoneRingSound);
    sound.preload = "auto";
    sound.loop = true;
    phoneSoundRef.current = sound;
    sound.play().catch(() => undefined);

    return () => {
      stopPhoneSound();
      stopTrainTalksSound();
      stopTrainStopSound();
      phoneSoundRef.current = null;
    };
  }, []);

  const handleAnswerPhone = () => {
    stopPhoneSound();
    setPhoneAnswered(true);
  };

  const handleGuideMessageOk = () => {
    setGuideMessageVisible(false);
    setTrainTalksFinished(false);
    setTrainTalksPlaying(true);
  };

  const handleTrainTalksPlay = () => {
    const sound = createConfiguredAudio(trainTalksSound);
    sound.preload = "auto";
    trainTalksSoundRef.current = sound;
    sound.play().catch(() => undefined);
  };

  const handleTrainTalksEnded = () => {
    stopTrainTalksSound();
    setTrainTalksPlaying(false);
    setTrainTalksFinished(true);
  };

  const handleDeAarNext = () => {
    setDeAarMoving(true);
  };

  const handleDeAarMovingEnded = () => {
    setDeAarInsideIndex(1);
    setDeAarMoving(false);
    if (isDeAar || isBeaufortWest) {
      setCurrentScroll(0);
      setIsScrollOpen(true);
    }
  };

  const handleOpenDeAarScrolls = () => {
    setCurrentScroll(0);
    setIsScrollOpen(true);
  };

  const handleNextScroll = () => {
    if (currentScroll >= journeyScrolls.length - 1) return;

    const nextNeeds = {
      ...currentNeeds,
      hunger: Math.max(0, currentNeeds.hunger - SCROLL_READING_COST),
      water: Math.max(0, currentNeeds.water - SCROLL_READING_COST),
    };

    setCurrentNeeds(nextNeeds);
    onPlayerStateChange({ needs: nextNeeds });
    setCurrentScroll((scrollIndex) => scrollIndex + 1);
  };

  const startLevelCompletion = () => {
    setIsQuizOpen(false);
    setIsLevelComplete(true);
    const sound = createConfiguredAudio(trainStopSound);
    sound.preload = "auto";
    trainStopSoundRef.current = sound;
    sound.play().catch(() => undefined);
  };

  const handleScrollComplete = () => {
    setIsScrollOpen(false);
    const completedQuizzes = player?.completedKnowledgeQuizzes || [];
    if (!completedQuizzes.includes(scene)) {
      setIsQuizOpen(true);
      return;
    }

    startLevelCompletion();
  };

  const handleCompletionVideoEnded = () => {
    stopTrainStopSound();
    onComplete({ needs: currentNeeds, scene });
  };

  const handleConsumeItem = (itemId) => {
    if (itemId !== "water" && itemId !== "sandwich") return;

    const nextNeeds = {
      ...currentNeeds,
      life: Math.min(100, currentNeeds.life + 10),
      hunger: itemId === "sandwich" ? Math.min(100, currentNeeds.hunger + 30) : currentNeeds.hunger,
      water: itemId === "water" ? Math.min(100, currentNeeds.water + 30) : currentNeeds.water,
    };
    const nextInventory = acquiredItems.filter((inventoryItem) => inventoryItem !== itemId);

    setCurrentNeeds(nextNeeds);
    onPlayerStateChange({ needs: nextNeeds, inventory: nextInventory });

    triggerVibration();
    const sound = createConfiguredAudio(itemId === "water" ? drinkingWaterSound : eatingSound);
    sound.play().catch(() => undefined);
  };

  return (
    <main className="train-inside" aria-label="Inside the train">
      {isLevelComplete ? (
        <>
          <video
            className="train-leaving-video"
            src={hasStopInteriorSequence ? stopTrainMovingVideo : leavingPretoriaTrainVideo}
            autoPlay
            playsInline
            onEnded={handleCompletionVideoEnded}
          />
          <div className="train-completion-overlay" role="status" aria-live="polite">
            <div className="train-completion-card">
              <img src={trophyImage} alt="Trophy" />
              <h1>
                {scene === "kimberley"
                  ? "Welcome to De Aar"
                  : isDeAar ? "Welcome to Beaufort West"
                    : isBeaufortWest ? "Welcome to Worcester"
                        : isWorcester ? "Welcome to Wellington"
                          : isWellington ? "Welcome to Bellville"
                            : isBellville ? "Welcome to Cape Town" : "Level Complete!"}
              </h1>
              <p>
                {scene === "kimberley"
                  ? "Welcome to De Aar."
                  : isDeAar ? "You have arrived in Beaufort West."
                    : isBeaufortWest ? "You have arrived in Worcester."
                        : isWorcester ? "You have arrived in Wellington."
                          : isWellington ? "You have arrived in Bellville."
                            : isBellville ? "You have arrived in Cape Town." : "You have arrived in Kimberley."}
              </p>
            </div>
          </div>
        </>
      ) : deAarMoving ? (
        <video
          className="train-leaving-video"
          src={stopTrainMovingVideo}
          autoPlay
          playsInline
          onEnded={handleDeAarMovingEnded}
        />
      ) : trainTalksPlaying ? (
        <video
          className="train-talks-video"
          src={trainTalksVideoSource}
          autoPlay
          playsInline
          onPlay={handleTrainTalksPlay}
          onEnded={handleTrainTalksEnded}
        />
      ) : hasStopInteriorSequence && trainTalksFinished ? (
        <div className="de-aar-train-interior">
          <img
            className="train-scene-image"
            src={deAarInsideIndex === 0 ? insideTrainImage : secondInteriorImage}
            alt={`Inside the train, view ${deAarInsideIndex + 1}`}
          />
          <img className="train-inside-traveller" src={traveller} alt={player?.name || "Traveller"} />
          <img className="train-inside-guide" src={guide} alt="Tour guide" />
          {deAarInsideIndex === 0 && (
            <button className="de-aar-train-next" type="button" onClick={handleDeAarNext}>
              NEXT
            </button>
          )}
          {deAarInsideIndex === 1 && !isScrollOpen && hasJourneyScrolls && (
            <button className="de-aar-train-next" type="button" onClick={handleOpenDeAarScrolls}>
              NEXT
            </button>
          )}
        </div>
      ) : trainTalksFinished ? (
        <button
          className="train-scene-button"
          type="button"
          aria-label="Open journey scrolls"
          onClick={() => {
            setCurrentScroll(0);
            setIsScrollOpen(true);
          }}
        >
          <img className="train-scene-image" src={finishedTrainImage} alt="Inside the train" />
        </button>
      ) : (
        <>
          <img src={insideTrainImage} alt="Inside the train" />
          <img className="train-inside-traveller" src={traveller} alt={player?.name || "Traveller"} />
          {hasStopInteriorSequence && !phoneAnswered && (
            <img className="train-inside-guide" src={guide} alt="Tour guide" />
          )}
        </>
      )}
      {!isLevelComplete && !deAarMoving && !trainTalksPlaying && !phoneAnswered && (
        <button
          className="train-inside-phone"
          type="button"
          onClick={handleAnswerPhone}
          aria-label="Answer the phone"
        >
          <img src={phoneImage} alt="Phone" />
          <span>Answer the phone</span>
        </button>
      )}
      {!isLevelComplete && !deAarMoving && !trainTalksPlaying && phoneAnswered && guideMessageVisible && (
        <>
          <img className="train-inside-guide" src={guide} alt="Tour guide" />
          <div className="train-inside-guide-dialog">
            <div className="train-inside-guide-message" role="note" aria-label="Guide message">
              <p>
                {phoneCallMessage.map((line) => <span key={line}>{line}</span>)}
              </p>
            </div>
            <button
              className="train-inside-guide-ok"
              type="button"
              aria-label="OK"
              title="OK"
              onClick={handleGuideMessageOk}
            >
              <span aria-hidden="true">&#10003;</span>
            </button>
          </div>
        </>
      )}
      {!isLevelComplete && !deAarMoving && (
        <>
          <button className="train-inside-back-button" onClick={onBack} type="button">
            <span aria-hidden="true">&#8592;</span> Levels
          </button>
          <div className="train-inside-needs" aria-label="Traveller status">
            <div className="need-meter need-life" title={`Life ${Math.round(currentNeeds.life)}%`}>
              <span aria-hidden="true">&#10084;</span>
              <div className="need-track"><i style={{ width: `${currentNeeds.life}%` }} /></div>
            </div>
            <div className="need-meter need-hunger" title={`Hunger ${Math.round(currentNeeds.hunger)}%`}>
              <span aria-hidden="true">&#127830;</span>
              <div className="need-track"><i style={{ width: `${currentNeeds.hunger}%` }} /></div>
            </div>
            <div className="need-meter need-water" title={`Water ${Math.round(currentNeeds.water)}%`}>
              <span aria-hidden="true">&#128167;</span>
              <div className="need-track"><i style={{ width: `${currentNeeds.water}%` }} /></div>
            </div>
          </div>
          <button
            className="train-inside-collection-button"
            type="button"
            aria-label="Open collection"
            aria-expanded={isCollectionOpen}
            onClick={() => setIsCollectionOpen(true)}
          >
            <img src={navIconCollection} alt="" />
          </button>
        </>
      )}
      {!isLevelComplete && !deAarMoving && isCollectionOpen && (
        <div className="train-inside-collection" role="dialog" aria-label="Collection" aria-modal="true">
          <div className="train-inside-collection-heading">
            <h2>Collection</h2>
            <button type="button" aria-label="Close collection" onClick={() => setIsCollectionOpen(false)}>
              <span aria-hidden="true">&#10005;</span>
            </button>
          </div>
          {acquiredItems.length === 0 ? (
            <p>Your collection is empty.</p>
          ) : (
            <div className="train-inside-collection-items">
              {acquiredItems.map((itemId) => {
                const [label, icon] = ITEM_LABELS[itemId] || [itemId, "\uD83D\uDCE6"];
                const isConsumable = itemId === "water" || itemId === "sandwich";
                return (
                  <div className="train-inside-collection-item" key={itemId}>
                    <span>{icon} {label}</span>
                    {isConsumable && (
                      <button type="button" onClick={() => handleConsumeItem(itemId)}>
                        {itemId === "water" ? "Drink" : "Eat"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
      {isScrollOpen && (
        <div className="train-scroll-overlay" role="dialog" aria-label="Journey scrolls" aria-modal="true">
          <div className="train-scroll-popup">
            <button
              className="train-scroll-close"
              type="button"
              aria-label="Close journey scrolls"
              onClick={() => setIsScrollOpen(false)}
            >
              <span aria-hidden="true">&#10005;</span>
            </button>
            <img
              className="train-scroll-image"
              src={journeyScrolls[currentScroll]}
              alt={`Journey scroll ${currentScroll + 1} of ${journeyScrolls.length}`}
            />
            <button
              className="train-scroll-navigation train-scroll-previous"
              type="button"
              aria-label="Previous scroll"
              disabled={currentScroll === 0}
              onClick={() => setCurrentScroll((scrollIndex) => scrollIndex - 1)}
            >
              <span aria-hidden="true">&#8592;</span>
            </button>
            <button
              className="train-scroll-navigation train-scroll-next"
              type="button"
              aria-label={currentScroll === journeyScrolls.length - 1 && hasStopInteriorSequence ? "Complete journey" : "Next scroll"}
              disabled={currentScroll === journeyScrolls.length - 1 && !hasStopInteriorSequence}
              onClick={currentScroll === journeyScrolls.length - 1 && hasStopInteriorSequence ? handleScrollComplete : handleNextScroll}
            >
              <span aria-hidden="true">&#8594;</span>
            </button>
            {currentScroll === journeyScrolls.length - 1 && !hasStopInteriorSequence && (
              <button
                className="train-scroll-ok"
                type="button"
                aria-label="Close journey scrolls"
                title="OK"
                onClick={handleScrollComplete}
              >
                <span aria-hidden="true">&#10003;</span>
              </button>
            )}
          </div>
        </div>
      )}
      {isQuizOpen && (
        <JourneyKnowledgeQuiz
          scene={scene}
          onComplete={(score) => onKnowledgeQuizComplete(scene, score)}
          onContinue={startLevelCompletion}
        />
      )}
    </main>
  );
}
