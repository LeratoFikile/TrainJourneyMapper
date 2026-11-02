import { useEffect, useRef, useState } from "react";
import pretoriaLevelImage from "../assets/elements/pretoria_level.png";
import "./PretoriaLevel.css";
import guideMamzo from "../assets/characters/guides/mamzo.png";
import guideMalume from "../assets/characters/guides/malume.png";
import skin1 from "../assets/characters/players/skin1.png";
import skin2 from "../assets/characters/players/skin2.png";
import skin3 from "../assets/characters/players/skin3.png";
import skin4 from "../assets/characters/players/skin4.png";
import skin5 from "../assets/characters/players/skin5.png";
import skin6 from "../assets/characters/players/skin6.png";
import navIconCollection from "../assets/elements/navicon_collection.png";
import coinBadgeIcon from "../assets/elements/coin_badge_icon.png";
import coinMoneySound from "../assets/sounds/cartoon_coin_money.mp3";
import drinkingWaterSound from "../assets/sounds/drinking_water.mp3";
import eatingSound from "../assets/sounds/eating.mp3";
import purchaseSound from "../assets/sounds/purchase_sound.mp3";
import { createConfiguredAudio, notificationsEnabled, triggerVibration } from "../settings";

const SKINS = { skin_01: skin1, skin_02: skin2, skin_03: skin3, skin_04: skin4, skin_05: skin5, skin_06: skin6 };
const DEFAULT_NEEDS = { life: 100, hunger: 86, water: 92 };
const INVENTORY_ITEMS = [
  { id: "water", label: "Water bottle", icon: "\uD83D\uDCA7", message: "water levels are on the top right", position: "inventory-water" },
  { id: "wallet", label: "Wallet", icon: "\uD83D\uDCB0", message: "wallet accuired, use money wisely", position: "inventory-wallet" },
  { id: "sandwich", label: "Sandwich", icon: "\uD83C\uDF54", message: "hunger levels are on the top right", position: "inventory-sandwich" },
  { id: "map", label: "Map", icon: "\uD83D\uDDFA", message: "map accuired", position: "inventory-map" },
  { id: "ticket", label: "Ticket", icon: "\uD83C\uDF9F\uFE0F", message: "ticket accuired", position: "inventory-ticket" },
];
const SHOP_ITEMS = [
  { id: "ticket", label: "Train ticket", icon: "\uD83C\uDF9F\uFE0F", price: 150 },
  { id: "sandwich", label: "Sandwich", icon: "\uD83C\uDF54", price: 50 },
  { id: "water", label: "Water bottle", icon: "\uD83D\uDCA7", price: 30 },
];
const LEVEL_DIALOGUES = {
  "De Aar": [
    ["Goeie môre! Welcome to De Aar!"],
    ["This town is known for its important", "railway connections and ancient", "rock engravings."],
  ],
  "Beaufort West": [
    ["Goeie môre! Welcome to Beaufort West!"],
    ["We're in the heart of the Karoo,", "a region filled with fascinating", "natural history."],
  ],
  Worcester: [
    ["Goeie môre! Welcome to Worcester!"],
    ["This beautiful town is surrounded", "by mountains and is home to a", "remarkable botanical garden."],
  ],
  Wellington: [
    ["Goeie môre! Welcome to Wellington!"],
    ["This town is home to the historic", "Bain's Kloof Pass, a remarkable", "route through the mountains."],
  ],
  Bellville: [
    ["Goeie môre! Welcome to Bellville!"],
    ["Today we'll discover a little piece", "of history hidden in this busy town."],
  ],
};

export default function PretoriaLevel({
  player,
  onBack,
  onBoardTrain,
  onPlayerStateChange,
  onOpenMiniGame,
  location = "Pretoria",
  levelImage = pretoriaLevelImage,
  exploreVideoSource,
  deAarMode = false,
}) {
  const startingNeeds = useRef(player?.needs || DEFAULT_NEEDS);
  const [needs, setNeeds] = useState(player?.needs || DEFAULT_NEEDS);
  const [speechStep, setSpeechStep] = useState(0);
  const [countdownSeconds, setCountdownSeconds] = useState(null);
  const [collectedItems, setCollectedItems] = useState(player?.inventory || []);
  const [pickupMessage, setPickupMessage] = useState("");
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState(Number.isFinite(player?.money) ? player.money : 250);
  const guide = player?.guide === "mamzo" ? guideMamzo : guideMalume;
  const traveller = SKINS[player?.skin] || skin1;
  const [welcomeDialogue, discoveryDialogue] = LEVEL_DIALOGUES[location] || [
    ["Ashe ngwanaka,", "phakisa tereni", "tlabe yao siya"],
    ["Phakisa hape train", "is leaving in 1 minute", "tsaya dilo tsahao ketse"],
  ];

  useEffect(() => {
    setNeeds(player?.needs || { life: 100, hunger: 86, water: 92 });
  }, [player?.needs]);

  useEffect(() => {
    setCollectedItems(player?.inventory || []);
  }, [player?.inventory]);

  useEffect(() => {
    setWalletBalance(Number.isFinite(player?.money) ? player.money : 250);
  }, [player?.money]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNeeds((current) => {
        const nextNeeds = {
          life: Math.max(0, current.life - 0.2),
          hunger: Math.max(0, current.hunger - 0.7),
          water: Math.max(0, current.water - 0.9),
        };
        onPlayerStateChange({ needs: nextNeeds });
        return nextNeeds;
      });
    }, 5000);

    return () => window.clearInterval(timer);
  }, [onPlayerStateChange]);

  useEffect(() => {
    if (countdownSeconds === null || countdownSeconds === 0 || isExploreOpen) return undefined;

    const timer = window.setInterval(() => {
      setCountdownSeconds((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [countdownSeconds, isExploreOpen]);

  const handleSpeechNext = () => {
    if (speechStep === 0) {
      setSpeechStep(1);
      return;
    }

    setSpeechStep(2);
    setCountdownSeconds(60);
  };

  const countdownLabel = countdownSeconds === null
    ? ""
    : `${String(Math.floor(countdownSeconds / 60)).padStart(2, "0")}:${String(countdownSeconds % 60).padStart(2, "0")}`;
  const isGameOver = countdownSeconds === 0 || Object.values(needs).some((value) => value <= 0);
  const hasTicket = collectedItems.includes("ticket");
  const canExplore = Boolean(exploreVideoSource) && countdownSeconds !== null && countdownSeconds > 0;

  const handleStartOver = () => {
    if (deAarMode) {
      setNeeds(startingNeeds.current);
      onPlayerStateChange({ needs: startingNeeds.current });
      setSpeechStep(2);
      setCountdownSeconds(60);
      setPickupMessage("");
      setIsCollectionOpen(false);
      setIsShopOpen(false);
      return;
    }

    setSpeechStep(2);
    setCountdownSeconds(null);
    setPickupMessage("");
    setIsCollectionOpen(false);
  };

  const handleInventoryPickup = (item) => {
    if (collectedItems.includes(item.id)) return;

    const baseBalance = Number.isFinite(walletBalance) ? walletBalance : Number.isFinite(player?.money) ? player.money : 250;
    const nextBalance = item.id === "wallet" ? baseBalance + 250 : baseBalance;
    const nextItems = [...collectedItems, item.id];

    setCollectedItems(nextItems);
    setWalletBalance(nextBalance);
    setPickupMessage(notificationsEnabled() ? item.message : "");
    onPlayerStateChange({ inventory: nextItems, money: nextBalance });

    triggerVibration();
    const sound = createConfiguredAudio(item.id === "wallet" ? coinMoneySound : purchaseSound);
    sound.play().catch(() => undefined);
  };

  const handleConsumeItem = (item) => {
    if (item.id !== "water" && item.id !== "sandwich") return;

    setNeeds((current) => {
      const nextNeeds = {
        ...current,
        life: Math.min(100, current.life + 10),
        hunger: item.id === "sandwich" ? Math.min(100, current.hunger + 30) : current.hunger,
        water: item.id === "water" ? Math.min(100, current.water + 30) : current.water,
      };
      onPlayerStateChange({ needs: nextNeeds });
      return nextNeeds;
    });
    setCollectedItems((current) => {
      const nextItems = current.filter((itemId) => itemId !== item.id);
      onPlayerStateChange({ inventory: nextItems });
      return nextItems;
    });
    setPickupMessage(notificationsEnabled()
      ? item.id === "water" ? "You drank water and feel refreshed." : "You ate the sandwich and feel stronger."
      : "");

    triggerVibration();
    const sound = createConfiguredAudio(item.id === "water" ? drinkingWaterSound : eatingSound);
    sound.play().catch(() => undefined);
  };

  const handleBuyItem = (item) => {
    if (walletBalance < item.price) return;

    const nextBalance = walletBalance - item.price;
    const nextItems = [...collectedItems, item.id];
    setWalletBalance(nextBalance);
    setCollectedItems(nextItems);
    onPlayerStateChange({ inventory: nextItems, money: nextBalance });

    triggerVibration();
    const sound = createConfiguredAudio(purchaseSound);
    sound.play().catch(() => undefined);
  };

  return (
    <main className={`pretoria-level-image${isGameOver ? " pretoria-level-game-over" : ""}`} aria-label={`${location} level`}>
      <img src={levelImage} alt={`${location} station`} />
      <button className="pretoria-back-button" onClick={onBack} type="button">
        <span aria-hidden="true">&#8592;</span> Levels
      </button>
      <div className="pretoria-needs" aria-label="Traveller status">
        <div className="need-meter need-life" title={`Life ${Math.round(needs.life)}%`}>
          <span aria-hidden="true">&#10084;</span>
          <div className="need-track"><i style={{ width: `${needs.life}%` }} /></div>
        </div>
        <div className="need-meter need-hunger" title={`Hunger ${Math.round(needs.hunger)}%`}>
          <span aria-hidden="true">&#127830;</span>
          <div className="need-track"><i style={{ width: `${needs.hunger}%` }} /></div>
        </div>
        <div className="need-meter need-water" title={`Water ${Math.round(needs.water)}%`}>
          <span aria-hidden="true">&#128167;</span>
          <div className="need-track"><i style={{ width: `${needs.water}%` }} /></div>
        </div>
        <button
          className="wallet-balance"
          type="button"
          title="Play the train match game"
          aria-label={`Open train match game with R${walletBalance}`}
          onClick={onOpenMiniGame}
        >
            <img src={coinBadgeIcon} alt="" />
            <strong>R{walletBalance}</strong>
        </button>
      </div>
      {countdownSeconds !== null && (
        <div className={`train-countdown${countdownSeconds <= 10 ? " train-countdown-urgent" : ""}`} role="timer" aria-live="polite">
          <span>Train leaves in</span>
          <strong>{countdownLabel}</strong>
        </div>
      )}
      <div className="registered-characters" aria-label="Registered characters">
        <img className="registered-guide" src={guide} alt={player?.guide === "mamzo" ? "Mamzo" : "Malume"} />
        <img className="registered-traveller" src={traveller} alt={player?.name || "Traveller"} />
        {speechStep < 2 && (
          <div className="guide-speech" role="note" aria-label="Tour guide speech">
            <p>
              {speechStep === 1 ? (
                discoveryDialogue.join(" ")
              ) : (
                welcomeDialogue.join(" ")
              )}
            </p>
            <button
              className="guide-speech-next"
              type="button"
              aria-label={speechStep === 1 ? "Start train departure countdown" : "Show next guide message"}
              onClick={handleSpeechNext}
            >
              <span aria-hidden="true">&#8594;</span>
            </button>
          </div>
        )}
      </div>
      {speechStep === 2 && !deAarMode && (
        <div className="pretoria-inventory" aria-label="Scattered inventory items">
          {INVENTORY_ITEMS.filter((item) => !collectedItems.includes(item.id)).map((item) => (
            <button
              className={`inventory-item ${item.position}`}
              key={item.id}
              type="button"
              aria-label={`Pick up ${item.label}`}
              onClick={() => handleInventoryPickup(item)}
            >
              <span className="inventory-item-icon" aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
      {deAarMode && countdownSeconds !== null && (
        <button
          className="de-aar-shop-button"
          type="button"
          aria-label={`Open ${location} station shop`}
          title="Shop at the ticket stand"
          onClick={() => setIsShopOpen(true)}
        >
          <span aria-hidden="true">&#128722;</span>
          <small>Shop</small>
        </button>
      )}
      {canExplore && (
        <button
          className="de-aar-explore-button"
          type="button"
          aria-label={`Explore ${location} station`}
          title={`Explore ${location} station`}
          onClick={() => setIsExploreOpen(true)}
        >
          <span aria-hidden="true">&#128065;</span>
          <small>Explore</small>
        </button>
      )}
      <button
        className="pretoria-collection-button"
        type="button"
        aria-label="Open collection"
        aria-expanded={isCollectionOpen}
        onClick={() => setIsCollectionOpen(true)}
      >
        <img src={navIconCollection} alt="" />
      </button>
      {isCollectionOpen && (
        <div className="collection-dialog" role="dialog" aria-label="Collection" aria-modal="true">
          <div className="collection-dialog-heading">
            <h2>Collection</h2>
            <button type="button" aria-label="Close collection" onClick={() => setIsCollectionOpen(false)}>
              <span aria-hidden="true">&#10005;</span>
            </button>
          </div>
          {collectedItems.length === 0 ? (
            <p className="collection-empty">Your collection is empty.</p>
          ) : (
            <div className="collection-items">
              {collectedItems.map((itemId) => {
                const item = INVENTORY_ITEMS.find((inventoryItem) => inventoryItem.id === itemId);
                if (!item) return null;
                const isConsumable = item.id === "water" || item.id === "sandwich";
                return (
                  <div className="collection-item" key={item.id}>
                    <span className="inventory-item-icon" aria-hidden="true">{item.icon}</span>
                    <span>{item.label}</span>
                    {isConsumable && (
                      <button type="button" onClick={() => handleConsumeItem(item)}>
                        {item.id === "water" ? "Drink" : "Eat"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
      {isShopOpen && (
        <div className="de-aar-shop-overlay" role="dialog" aria-label="De Aar station shop" aria-modal="true">
          <div className="de-aar-shop-scroll">
            <div className="de-aar-shop-heading">
              <div>
                <p>Ticket stand</p>
                <h2>Station shop</h2>
              </div>
              <button type="button" aria-label="Close shop" onClick={() => setIsShopOpen(false)}>
                <span aria-hidden="true">&#10005;</span>
              </button>
            </div>
            <div className="de-aar-shop-money">Money: <strong>R{walletBalance}</strong></div>
            <div className="de-aar-shop-items">
              {SHOP_ITEMS.map((item) => {
                const canAfford = walletBalance >= item.price;
                return (
                  <button
                    className="de-aar-shop-item"
                    key={item.id}
                    type="button"
                    disabled={!canAfford}
                    title={!canAfford ? "Not enough money" : undefined}
                    onClick={() => handleBuyItem(item)}
                  >
                    <span className="de-aar-shop-item-icon" aria-hidden="true">{item.icon}</span>
                    <span>{item.label}</span>
                    <strong>R{item.price}</strong>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {isExploreOpen && exploreVideoSource && (
        <div className="de-aar-explore-overlay" role="dialog" aria-label={`Explore ${location} station`}>
          <video
            className="de-aar-explore-video"
            src={exploreVideoSource}
            autoPlay
            playsInline
            onEnded={() => setIsExploreOpen(false)}
          />
          <button
            className="de-aar-explore-close"
            type="button"
            aria-label="Close station exploration"
            onClick={() => setIsExploreOpen(false)}
          >
            Close
          </button>
        </div>
      )}
      {hasTicket && (
        <button
          className="board-train-button"
          type="button"
          aria-label="Board train"
          onClick={() => onBoardTrain({
            inventory: collectedItems.filter((itemId) => itemId !== "ticket"),
            needs,
          })}
        >
          BOARD TRAIN!
        </button>
      )}
      {pickupMessage && (
        <div className="pickup-dialog" role="dialog" aria-label="Inventory item acquired">
          <p>{pickupMessage}</p>
          <button type="button" onClick={() => setPickupMessage("")}>OK</button>
        </div>
      )}
      {isGameOver && (
        <div className="pretoria-game-over" role="dialog" aria-label="Traveller has died">
          <p>{countdownSeconds === 0 ? "Time's up" : "You died"}</p>
          <div className="pretoria-game-over-actions">
            <button type="button" aria-label="Start over" title="Start over" onClick={handleStartOver}>
              <span aria-hidden="true">&#8635;</span>
            </button>
            <button type="button" aria-label="Back to levels" title="Back to levels" onClick={onBack}>
              <span aria-hidden="true">&#8592;</span>
            </button>
          </div>
        </div>
      )}
    </main>
  );
}