import { useCallback, useEffect, useRef, useState } from "react";
import BackgroundMusic from "./components/BackgroundMusic";

import SplashScreen from "./screens/SplashScreen";
import CharacterRegistration from "./screens/CharacterRegistration";
import AccountAccess from "./screens/AccountAccess";
import HomeScreen from "./screens/HomeScreen";
import WelcomeJourney from "./screens/WelcomeJourney";
import JourneyMap from "./screens/JourneyMap";
import PretoriaLevel from "./screens/PretoriaLevel";
import TrainBoarding from "./screens/TrainBoarding";
import deAarTrainMovingVideo from "./assets/De_Aar_images/de_aar_train_moving.mp4";
import deAarTrainStopImage from "./assets/De_Aar_images/de_aar_train_Stop.png";
import deAarExploreVideo from "./assets/De_Aar_images/de_aar_Explore_video.mp4";
import beaufortWestTrainStopImage from "./assets/Beaufort West/Beaufort_West_train_stop.png";
import beaufortWestTrainMovingVideo from "./assets/Beaufort West/Beaufort_West_train_leaving.mp4";
import beaufortWestExploreVideo from "./assets/Beaufort West/beufortwest_explore.mp4";
import worcesterTrainMovingVideo from "./assets/Worcester/worcester_train_leaving.mp4";
import worcesterExploreVideo from "./assets/Worcester/worcester_explore.mp4";
import wellingtonTrainMovingVideo from "./assets/Wellington/wellington_train_moving.mp4";
import TrainInside from "./screens/TrainInside";
import TrainJourney from "./screens/TrainJourney";
import KimberleyLevel from "./screens/KimberleyLevel";
import WorcesterLevel from "./screens/WorcesterLevel";
import WellingtonLevel from "./screens/WellingtonLevel";
import BellvilleLevel from "./screens/BellvilleLevel";
import CapeTownLevel from "./screens/CapeTownLevel";
import MiniGamesMenu from "./screens/MiniGamesMenu";
import MatchMonument from "./screens/MatchMonument";
import bellvilleTrainMovingVideo from "./assets/Bellville/Bellville_train_moving.mp4";
import MiniGame from "./screens/miniGame";
import Settings from "./screens/Settings";
import { getActiveHeartLosses, HEART_REGENERATION_MS, MAX_HEARTS } from "./gameplay/lives";
import {
  PRETORIA_WELCOME_PACKAGE_ITEMS,
  PRETORIA_WELCOME_PACKAGE_MONEY,
} from "./gameplay/pretoriaWelcomePackage";

import {
  claimPretoriaWelcomePackage,
  deleteCurrentPlayerAccount,
  getPlayerProfile,
  markWelcomeJourneyRead,
  savePlayerProgress,
  signOutPlayer,
} from "./firebasePlayer";

const DEFAULT_NEEDS = { life: 100, hunger: 86, water: 92 };
const LOW_NEED_THRESHOLD = 20;

function findLowNeeds(needs, previousNeeds = { life: 100, hunger: 100, water: 100 }) {
  const newlyLow = [];

  if (needs.hunger <= LOW_NEED_THRESHOLD && previousNeeds.hunger > LOW_NEED_THRESHOLD) {
    newlyLow.push("food");
  }
  if (needs.water <= LOW_NEED_THRESHOLD && previousNeeds.water > LOW_NEED_THRESHOLD) {
    newlyLow.push("water");
  }
  return newlyLow;
}

const PASSPORT_STOPS = {
  pretoria: { location: "Pretoria", province: "Gauteng" },
  kimberley: { location: "Kimberley", province: "Northern Cape" },
  "de-aar": { location: "De Aar", province: "Northern Cape" },
  "beaufort-west": { location: "Beaufort West", province: "Western Cape" },
  worcester: { location: "Worcester", province: "Western Cape" },
  wellington: { location: "Wellington", province: "Western Cape" },
  bellville: { location: "Bellville", province: "Western Cape" },
  "cape-town": { location: "Cape Town", province: "Western Cape" },
};

function addPassportStamp(passport, stopId) {
  const currentPassport = passport || [];

  if (currentPassport.some((stamp) => stamp.id === stopId)) {
    return currentPassport;
  }

  return [
    ...currentPassport,
    {
      id: stopId,
      ...PASSPORT_STOPS[stopId],
      completedAt: new Date().toISOString(),
    },
  ];
}

export default function App() {
  const [screen, setScreen] = useState("splash");
  const [player, setPlayer] = useState(null);
  const [guestSession, setGuestSession] = useState(false);
  const [checkingPlayer, setCheckingPlayer] = useState(false);
  const [authenticationFlowActive, setAuthenticationFlowActive] = useState(false);
  const [needWarnings, setNeedWarnings] = useState([]);
  const [miniGamesReturnScreen, setMiniGamesReturnScreen] = useState("home");
  const [inventoryJourneyMapOpen, setInventoryJourneyMapOpen] = useState(false);
  const [journeyActionError, setJourneyActionError] = useState("");
  const [heartClock, setHeartClock] = useState(0);
  const previousNeeds = useRef(null);
  const playerRef = useRef(player);
  const deathHandled = useRef(false);
  const progressSaveQueue = useRef(Promise.resolve());
  const isResettingProgress = useRef(false);
  const pretoriaEntryInProgress = useRef(false);

  const updatePlayerState = useCallback((updates) => {
    if (isResettingProgress.current) return;

    if (updates.needs) {
      const needs = { ...DEFAULT_NEEDS, ...updates.needs };
      const newlyLow = findLowNeeds(
        needs,
        previousNeeds.current || { life: 100, hunger: 100, water: 100 }
      );

      previousNeeds.current = needs;

      if (newlyLow.length) {
        setNeedWarnings((current) => [...new Set([...current, ...newlyLow])]);
      }
    }

    setPlayer((current) => ({ ...current, ...updates }));
    if (!guestSession) {
      const expectedPlayerId = player?.id;
      const progressSave = progressSaveQueue.current
        .catch(() => undefined)
        .then(() => savePlayerProgress(updates, expectedPlayerId))
        .catch((error) => {
          console.error("Could not save player progress:", error);
          throw error;
        });
      progressSaveQueue.current = progressSave;
      progressSave.catch(() => undefined);
    }
  }, [guestSession, player?.id]);

  useEffect(() => {
    playerRef.current = player;
  }, [player]);

  useEffect(() => {
    const timer = window.setTimeout(() => setHeartClock(Date.now()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const handlePlayerDeath = useCallback(() => {
    if (deathHandled.current) return;
    if (playerRef.current?.deathRecoveryPending) {
      deathHandled.current = true;
      return;
    }

    const lossTimestamps = getActiveHeartLosses(playerRef.current?.heartLossTimestamps || []);
    if (lossTimestamps.length >= MAX_HEARTS) {
      deathHandled.current = true;
      updatePlayerState({ deathRecoveryPending: true });
      return;
    }

    deathHandled.current = true;
    const lostAt = Date.now();
    setHeartClock(lostAt);
    updatePlayerState({
      heartLossTimestamps: [...lossTimestamps, lostAt],
      deathRecoveryPending: true,
    });
  }, [updatePlayerState]);

  const handlePlayerRespawn = useCallback((needs) => {
    deathHandled.current = false;
    updatePlayerState({
      deathRecoveryPending: false,
      ...(needs ? { needs } : {}),
    });
  }, [updatePlayerState]);

  const activeHeartLosses = getActiveHeartLosses(player?.heartLossTimestamps || [], heartClock);
  const availableHearts = MAX_HEARTS - activeHeartLosses.length;
  const nextHeartLossTimestamp = activeHeartLosses[0];
  const isMiniGameScreen = screen === "mini-games" || screen.startsWith("mini-game-");
  const backgroundMusicActive = Boolean(
    player
    && !guestSession
    && !authenticationFlowActive
    && !["splash", "registration", "sign-in"].includes(screen)
    && !isMiniGameScreen
  );

  useEffect(() => {
    if (nextHeartLossTimestamp === undefined) return undefined;
    const nextHeartAt = nextHeartLossTimestamp + HEART_REGENERATION_MS;
    const timer = window.setTimeout(
      () => setHeartClock(Date.now()),
      Math.max(0, nextHeartAt - Date.now())
    );
    return () => window.clearTimeout(timer);
  }, [heartClock, nextHeartLossTimestamp]);

  // --------------------------------------------------
  // SPLASH → EXISTING PLAYER / REGISTRATION
  // --------------------------------------------------

  const handleSplashFinished = async () => {
    setCheckingPlayer(true);

    try {
      const profile = await getPlayerProfile();

      if (profile) {
        deathHandled.current = false;
        setGuestSession(false);
        const needs = { ...DEFAULT_NEEDS, ...profile.needs };
        previousNeeds.current = needs;
        setNeedWarnings(findLowNeeds(needs));
        setPlayer({
          ...profile,
          needs,
          heartLossTimestamps: profile.heartLossTimestamps || [],
          deathRecoveryPending: Boolean(profile.deathRecoveryPending),
          money: Number.isFinite(profile.money) ? profile.money : 250,
          inventory: profile.inventory || [],
        });
        setScreen(profile.welcomeJourneyRead === false ? "welcome" : "home");
      } else {
        setScreen("registration");
      }
    } catch (error) {
      console.error("Could not check player profile:", error);
      setScreen("registration");
    } finally {
      setCheckingPlayer(false);
    }
  };

  // --------------------------------------------------
  // REGISTRATION → HOME
  // --------------------------------------------------

  const handleRegistrationComplete = (profile) => {
    deathHandled.current = false;
    const isGuest = Boolean(profile?.guest);
    setGuestSession(isGuest);
    const needs = { ...DEFAULT_NEEDS, ...profile?.needs };
    previousNeeds.current = needs;
    setNeedWarnings(findLowNeeds(needs));
    setPlayer({
      ...(profile ?? {
        name: "Traveller",
        guide: "mamzo",
        skin: "skin_01",
      }),
      guest: isGuest,
      needs,
      heartLossTimestamps: profile?.heartLossTimestamps || [],
      deathRecoveryPending: Boolean(profile?.deathRecoveryPending),
      money: Number.isFinite(profile?.money) ? profile.money : 250,
      inventory: profile?.inventory || [],
    });

    setScreen("welcome");
  };

  const handleAccountSignIn = (profile) => {
    deathHandled.current = false;
    setGuestSession(false);
    const needs = { ...DEFAULT_NEEDS, ...profile.needs };
    previousNeeds.current = needs;
    setNeedWarnings(findLowNeeds(needs));
    setPlayer({
      ...profile,
      needs,
      heartLossTimestamps: profile.heartLossTimestamps || [],
      deathRecoveryPending: Boolean(profile.deathRecoveryPending),
      money: Number.isFinite(profile.money) ? profile.money : 250,
      inventory: profile.inventory || [],
    });
    setScreen(profile.welcomeJourneyRead === false ? "welcome" : "home");
  };

  // --------------------------------------------------
  // HOME → JOURNEY
  // --------------------------------------------------

  const enterPretoria = async (startJourney = false) => {
    if (pretoriaEntryInProgress.current) return;
    pretoriaEntryInProgress.current = true;
    setJourneyActionError("");

    try {
      await progressSaveQueue.current;

      const currentPlayer = playerRef.current;
      if (guestSession) {
        if (currentPlayer?.pretoriaWelcomePackageClaimed === false) {
          setPlayer((current) => ({
            ...current,
            pretoriaWelcomePackageClaimed: true,
            inventory: [...new Set([
              ...(Array.isArray(current?.inventory) ? current.inventory : []),
              ...PRETORIA_WELCOME_PACKAGE_ITEMS,
            ])],
            money: (Number.isFinite(current?.money) ? current.money : 250)
              + PRETORIA_WELCOME_PACKAGE_MONEY,
          }));
        } else if (currentPlayer?.pretoriaWelcomePackageClaimed !== true) {
          setPlayer((current) => ({ ...current, pretoriaWelcomePackageClaimed: true }));
        }
      } else if (currentPlayer?.pretoriaWelcomePackageClaimed !== true) {
        const claimedProfile = await claimPretoriaWelcomePackage(currentPlayer?.id);
        setPlayer((current) => ({ ...current, ...claimedProfile }));
      }

      if (startJourney) {
        updatePlayerState({ journeyStarted: true, currentLevel: 1 });
      }
      setScreen("pretoria");
    } catch (error) {
      console.error("Could not enter Pretoria:", error);
      setJourneyActionError("Your Pretoria welcome package could not be saved. Check your connection and try again.");
    } finally {
      pretoriaEntryInProgress.current = false;
    }
  };

  const handleStartJourney = () => enterPretoria(true);

  const handleContinueJourney = () => {
    setScreen("journey-map");
  };

  const handleResetProgress = async () => {
    if (isResettingProgress.current) return;
    isResettingProgress.current = true;
    const resetProgress = {
      completedLevels: [],
      completedKnowledgeQuizzes: [],
      knowledgeQuizScores: {},
      discoveries: [],
      passport: [],
      unlockedLevels: ["pretoria"],
      currentLevel: 1,
      journeyStarted: false,
    };

    try {
      await progressSaveQueue.current;
      if (!guestSession) {
        await savePlayerProgress(resetProgress, player?.id);
      }

      progressSaveQueue.current = Promise.resolve();
      setPlayer((current) => ({ ...current, ...resetProgress }));
      setInventoryJourneyMapOpen(false);
      setScreen("journey-map");
    } catch (error) {
      console.error("Could not reset player progress:", error);
      throw error;
    } finally {
      isResettingProgress.current = false;
    }
  };

  const handleLogOut = async () => {
    await progressSaveQueue.current;
    await signOutPlayer();
    setPlayer(null);
    setGuestSession(false);
    deathHandled.current = false;
    setNeedWarnings([]);
    previousNeeds.current = null;
    setScreen("sign-in");
  };

  const handleDeleteAccount = async (password) => {
    await progressSaveQueue.current;
    await deleteCurrentPlayerAccount(password);
    setPlayer(null);
    setGuestSession(false);
    setNeedWarnings([]);
    previousNeeds.current = null;
    setScreen("registration");
  };

  // --------------------------------------------------
  // WELCOME JOURNEY → JOURNEY MAP
  // --------------------------------------------------

  const handleWelcomeComplete = async () => {
    try {
      if (guestSession) {
        setPlayer((current) => ({
          ...current,
          welcomeJourneyRead: true,
        }));
      } else {
        await markWelcomeJourneyRead(player?.id);
        setPlayer((current) => ({
          ...current,
          welcomeJourneyRead: true,
        }));
      }
    } catch (error) {
      console.error("Could not save welcome journey status:", error);
      setJourneyActionError("Your introduction could not be saved. Check your connection and try again.");
      return;
    }

    setJourneyActionError("");
    setScreen("journey-map");
  };

  // --------------------------------------------------
  // JOURNEY MAP → DESTINATION LEVEL
  // --------------------------------------------------

  const handleOpenLevel = (stop) => {
    setInventoryJourneyMapOpen(false);
    if (stop.id === "pretoria") {
      void enterPretoria();
    } else if (stop.id === "kimberley") {
      setScreen("kimberley");
    } else if (stop.id === "de-aar") {
      setScreen("de-aar");
    } else if (stop.id === "beaufort-west") {
      setScreen("beaufort-west");
    } else if (stop.id === "worcester") {
      setScreen("worcester");
    } else if (stop.id === "wellington") {
      setScreen("wellington");
    } else if (stop.id === "bellville") {
      setScreen("bellville");
    } else if (stop.id === "cape-town") {
      updatePlayerState({
        passport: addPassportStamp(player?.passport, "cape-town"),
      });
      setScreen("cape-town");
    }
  };

  const handleBackToHome = () => {
    setScreen("home");
  };

  const handleBackToJourneyMap = () => {
    setScreen("journey-map");
  };

  const handleCloseInventoryMap = () => {
    setInventoryJourneyMapOpen(false);
  };

  const handleOpenInventoryMap = () => {
    setInventoryJourneyMapOpen(true);
  };

  const handleOpenMiniGame = (level) => {
    const levelScreens = {
      pretoria: "pretoria",
      kimberley: "kimberley",
      "de-aar": "de-aar",
      "beaufort-west": "beaufort-west",
      worcester: "worcester",
      wellington: "wellington",
      bellville: "bellville",
      "cape-town": "cape-town",
    };
    setMiniGamesReturnScreen(levelScreens[level] || "home");
    setScreen("mini-games");
  };

  const handleMiniGameBack = (level) => {
    setScreen(level);
  };

  const handleKnowledgeQuizComplete = (scene, score) => {
    const completedKnowledgeQuizzes = player?.completedKnowledgeQuizzes || [];
    if (completedKnowledgeQuizzes.includes(scene)) return;

    updatePlayerState({
      completedKnowledgeQuizzes: [...completedKnowledgeQuizzes, scene],
      knowledgeQuizScores: {
        ...player?.knowledgeQuizScores,
        [scene]: score,
      },
      points: (Number.isFinite(player?.points) ? player.points : 0) + score,
    });
  };

  const handleBoardTrain = (pretoriaData) => {
    updatePlayerState({
      needs: pretoriaData?.needs || player?.needs || DEFAULT_NEEDS,
      money: Number.isFinite(player?.money) ? player.money : 250,
      inventory: pretoriaData?.inventory ?? player?.inventory ?? [],
    });
    setScreen("train-boarding");
  };

  const handleTrainBoardingComplete = () => {
    setScreen("train_inside");
  };

  const handleKimberleyTrainDepartureComplete = () => {
    setScreen("kimberley-train-inside");
  };

  const handleDeAarBoardTrain = (deAarData) => {
    updatePlayerState({
      needs: deAarData?.needs || player?.needs || DEFAULT_NEEDS,
      inventory: deAarData?.inventory ?? player?.inventory ?? [],
    });
    setScreen("de-aar-train-boarding");
  };

  const handleDeAarTrainBoardingComplete = () => {
    setScreen("de-aar-train-inside");
  };

  const handleBeaufortWestBoardTrain = (beaufortWestData) => {
    updatePlayerState({
      needs: beaufortWestData?.needs || player?.needs || DEFAULT_NEEDS,
      inventory: beaufortWestData?.inventory ?? player?.inventory ?? [],
    });
    setScreen("beaufort-west-train-boarding");
  };

  const handleBeaufortWestTrainBoardingComplete = () => {
    setScreen("beaufort-west-train-inside");
  };

  const handleWorcesterBoardTrain = (worcesterData) => {
    updatePlayerState({
      needs: worcesterData?.needs || player?.needs || DEFAULT_NEEDS,
      inventory: worcesterData?.inventory ?? player?.inventory ?? [],
    });
    setScreen("worcester-train-boarding");
  };

  const handleWorcesterTrainBoardingComplete = () => {
    setScreen("worcester-train-inside");
  };

  const handleWellingtonBoardTrain = (wellingtonData) => {
    updatePlayerState({
      needs: wellingtonData?.needs || player?.needs || DEFAULT_NEEDS,
      inventory: wellingtonData?.inventory ?? player?.inventory ?? [],
    });
    setScreen("wellington-train-boarding");
  };

  const handleWellingtonTrainBoardingComplete = () => {
    setScreen("wellington-train-inside");
  };

  const handleBellvilleBoardTrain = (bellvilleData) => {
    updatePlayerState({
      needs: bellvilleData?.needs || player?.needs || DEFAULT_NEEDS,
      inventory: bellvilleData?.inventory ?? player?.inventory ?? [],
    });
    setScreen("bellville-train-boarding");
  };

  const handleBellvilleTrainBoardingComplete = () => {
    setScreen("bellville-train-inside");
  };

  // --------------------------------------------------
  // TRAIN JOURNEY → JOURNEY MAP
  // --------------------------------------------------

  const handleTrainJourneyComplete = (journeyData) => {
    console.log("Train journey completed:", journeyData);

    if (journeyData?.scene === "de-aar") {
      const completedLevels = Array.from(
        new Set([...(player?.completedLevels || []), "de-aar"])
      );
      updatePlayerState({
        completedLevels,
        passport: addPassportStamp(player?.passport, "de-aar"),
        unlockedLevels: ["pretoria", "kimberley", "de-aar", "beaufort-west"],
        needs: journeyData?.needs || player?.needs || DEFAULT_NEEDS,
      });
      setScreen("beaufort-west");
      return;
    }

    if (journeyData?.scene === "beaufort-west") {
      const completedLevels = Array.from(
        new Set([...(player?.completedLevels || []), "beaufort-west"])
      );
      updatePlayerState({
        completedLevels,
        passport: addPassportStamp(player?.passport, "beaufort-west"),
        unlockedLevels: ["pretoria", "kimberley", "de-aar", "beaufort-west", "worcester"],
        needs: journeyData?.needs || player?.needs || DEFAULT_NEEDS,
      });
      setScreen("worcester");
      return;
    }

    if (journeyData?.scene === "worcester") {
      const completedLevels = Array.from(
        new Set([...(player?.completedLevels || []), "worcester"])
      );
      updatePlayerState({
        completedLevels,
        passport: addPassportStamp(player?.passport, "worcester"),
        unlockedLevels: [
          "pretoria",
          "kimberley",
          "de-aar",
          "beaufort-west",
          "worcester",
          "wellington",
        ],
        needs: journeyData?.needs || player?.needs || DEFAULT_NEEDS,
      });
      setScreen("wellington");
      return;
    }

    if (journeyData?.scene === "wellington") {
      const completedLevels = Array.from(
        new Set([...(player?.completedLevels || []), "wellington"])
      );
      updatePlayerState({
        completedLevels,
        passport: addPassportStamp(player?.passport, "wellington"),
        unlockedLevels: [
          "pretoria",
          "kimberley",
          "de-aar",
          "beaufort-west",
          "worcester",
          "wellington",
          "bellville",
        ],
        needs: journeyData?.needs || player?.needs || DEFAULT_NEEDS,
      });
      setScreen("bellville");
      return;
    }

    if (journeyData?.scene === "bellville") {
      const completedLevels = Array.from(
        new Set([...(player?.completedLevels || []), "bellville"])
      );
      updatePlayerState({
        completedLevels,
        passport: addPassportStamp(
          addPassportStamp(player?.passport, "bellville"),
          "cape-town"
        ),
        unlockedLevels: [
          "pretoria",
          "kimberley",
          "de-aar",
          "beaufort-west",
          "worcester",
          "wellington",
          "bellville",
          "cape-town",
        ],
        needs: journeyData?.needs || player?.needs || DEFAULT_NEEDS,
      });
      setScreen("cape-town");
      return;
    }

    if (journeyData?.scene === "kimberley") {
      const completedLevels = Array.from(
        new Set([...(player?.completedLevels || []), "kimberley"])
      );
      const progress = {
        completedLevels,
        passport: addPassportStamp(player?.passport, "kimberley"),
        unlockedLevels: ["pretoria", "kimberley", "de-aar"],
        needs: journeyData?.needs || player?.needs || DEFAULT_NEEDS,
      };

      updatePlayerState(progress);
      setScreen("journey-map");
      return;
    }

    const completedLevels = Array.from(
      new Set([...(player?.completedLevels || []), "pretoria"])
    );
    const progress = {
      completedLevels,
      passport: addPassportStamp(player?.passport, "pretoria"),
      unlockedLevels: ["pretoria", "kimberley"],
      needs: journeyData?.needs || player?.needs || DEFAULT_NEEDS,
    };

    updatePlayerState(progress);

    // Later this is where we can save:
    // - discoveries
    // - money
    // - purchased items
    // - passport progress
    // - Kimberley unlock
    // etc.

    setScreen("kimberley");
  };

  // --------------------------------------------------
  // PASSPORT
  // --------------------------------------------------

  // --------------------------------------------------
  // INFO → WELCOME JOURNEY
  // --------------------------------------------------

  const handleOpenInfo = () => {
    setInventoryJourneyMapOpen(false);
    setScreen("welcome");
  };

  return (
    <div className="app">
      <BackgroundMusic active={backgroundMusicActive} />
      {needWarnings.length > 0 && (
        <div className="need-warning-backdrop">
          <section
            className="need-warning-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="need-warning-title"
            aria-describedby="need-warning-message"
          >
            <div className="need-warning-symbols" aria-hidden="true">
              {needWarnings.includes("water") && <span className="need-warning-water">💧</span>}
              {needWarnings.includes("food") && <span className="need-warning-food">🍲</span>}
              {needWarnings.includes("life") && <span className="need-warning-life">❤️</span>}
            </div>
            <div className="need-warning-copy">
              <span className="need-warning-eyebrow">Traveller check-in</span>
              <h2 id="need-warning-title">
                {needWarnings.length === 1
                  ? `${needWarnings[0] === "food" ? "Food" : needWarnings[0][0].toUpperCase() + needWarnings[0].slice(1)} running low`
                  : "Needs running low"}
              </h2>
            <p id="need-warning-message">
                Your {needWarnings.join(" and ")} {needWarnings.length === 1 ? "is" : "are"} running low.
                Visit your collection to eat or drink and keep your journey on track.
            </p>
            </div>
            <button type="button" onClick={() => setNeedWarnings([])}>
              Got it
            </button>
          </section>
        </div>
      )}
      {journeyActionError && (
        <div
          role="alert"
          style={{
            position: "fixed",
            top: 16,
            left: "50%",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            gap: 12,
            maxWidth: "calc(100vw - 32px)",
            padding: "12px 16px",
            border: "2px solid #fff3c4",
            borderRadius: 12,
            color: "#fff",
            background: "#7c2525",
            boxShadow: "0 4px 12px rgba(0, 0, 0, .3)",
            transform: "translateX(-50%)",
          }}
        >
          <span>{journeyActionError}</span>
          <button type="button" onClick={() => setJourneyActionError("")}>Dismiss</button>
        </div>
      )}

      {/* --------------------------------------------- */}
      {/* SPLASH SCREEN */}
      {/* --------------------------------------------- */}

      {screen === "splash" && (
        <SplashScreen
          onFinish={handleSplashFinished}
        />
      )}

      {screen === "mini-game-worcester" && (
        <MiniGame
          player={player}
          availableHearts={availableHearts}
          heartLossTimestamps={player?.heartLossTimestamps}
          onPlayerDeath={handlePlayerDeath}
          onPlayerRespawn={handlePlayerRespawn}
          onBack={() => handleMiniGameBack("worcester")}
          onPlayerStateChange={updatePlayerState}
        />
      )}

      {/* --------------------------------------------- */}
      {/* PLAYER PROFILE LOADING */}
      {/* --------------------------------------------- */}

      {checkingPlayer && (
        <div
          className="player-loading-screen"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#171d38",
            color: "#ffffff",
            fontFamily: "Arial, Helvetica, sans-serif",
          }}
        >
          <div
            style={{
              textAlign: "center",
              padding: "30px",
            }}
          >
            <div
              style={{
                fontSize: "55px",
                marginBottom: "16px",
              }}
            >
              🚂
            </div>

            <div
              style={{
                fontSize: "16px",
                fontWeight: "700",
                marginBottom: "8px",
              }}
            >
              Preparing your journey...
            </div>

            <div
              style={{
                fontSize: "12px",
                opacity: 0.55,
              }}
            >
              Checking your traveller profile
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------- */}
      {/* REGISTRATION */}
      {/* --------------------------------------------- */}

      {screen === "registration" && (
        <CharacterRegistration
          onComplete={handleRegistrationComplete}
          onSignIn={() => setScreen("sign-in")}
        />
      )}

      {screen === "sign-in" && (
        <AccountAccess
          mode="sign-in"
          onSuccess={handleAccountSignIn}
          onCancel={() => setScreen("registration")}
        />
      )}

      {/* --------------------------------------------- */}
      {/* HOME */}
      {/* --------------------------------------------- */}

      {screen === "home" && (
        <HomeScreen
          player={player}
          onStartJourney={handleStartJourney}
          onContinueJourney={handleContinueJourney}
          onOpenSettings={() => setScreen("settings")}
          onOpenMiniGames={() => {
            setMiniGamesReturnScreen("home");
            setScreen("mini-games");
          }}
        />
      )}

      {screen === "mini-games" && (
        <MiniGamesMenu
          onBack={() => setScreen(miniGamesReturnScreen)}
          onOpenTrainMatch={() => setScreen("mini-game-train-match")}
          onOpenMonument={() => setScreen("mini-game-monument")}
        />
      )}

      {screen === "mini-game-train-match" && (
        <MiniGame
          player={player}
          availableHearts={availableHearts}
          heartLossTimestamps={player?.heartLossTimestamps}
          onPlayerDeath={handlePlayerDeath}
          onPlayerRespawn={handlePlayerRespawn}
          onBack={() => setScreen("mini-games")}
          onPlayerStateChange={updatePlayerState}
        />
      )}

      {screen === "mini-game-monument" && (
        <MatchMonument
          player={player}
          availableHearts={availableHearts}
          onBack={() => setScreen("mini-games")}
          onPlayerStateChange={updatePlayerState}
        />
      )}

      {screen === "settings" && (
        <Settings
          onBack={() => setScreen("home")}
          onResetProgress={handleResetProgress}
          onLogOut={handleLogOut}
          onDeleteAccount={handleDeleteAccount}
          onAuthenticationFlowChange={setAuthenticationFlowActive}
        />
      )}

      {/* --------------------------------------------- */}
      {/* WELCOME JOURNEY */}
      {/* --------------------------------------------- */}

      {screen === "welcome" && (
        <WelcomeJourney
          player={player}
          onComplete={handleWelcomeComplete}
        />
      )}

      {/* --------------------------------------------- */}
      {/* JOURNEY MAP */}
      {/* --------------------------------------------- */}

      {(screen === "journey-map" || inventoryJourneyMapOpen) && (
        <div
          style={inventoryJourneyMapOpen
            ? { position: "fixed", inset: 0, zIndex: 1000, overflowY: "auto" }
            : undefined}
        >
          <JourneyMap
            player={player}
            onBack={inventoryJourneyMapOpen ? handleCloseInventoryMap : handleBackToHome}
            backLabel={inventoryJourneyMapOpen ? "BACK" : "HOME"}
            onOpenLevel={handleOpenLevel}
            onOpenInfo={handleOpenInfo}
            onOpenMiniGames={() => {
              setMiniGamesReturnScreen(inventoryJourneyMapOpen ? screen : "journey-map");
              setInventoryJourneyMapOpen(false);
              setScreen("mini-games");
            }}
            onResetProgress={handleResetProgress}
          />
        </div>
      )}

      {screen === "worcester" && (
        <WorcesterLevel
          player={player}
          onBack={handleBackToJourneyMap}
          onBoardTrain={handleWorcesterBoardTrain}
          onPlayerStateChange={updatePlayerState}
          onOpenMiniGame={() => handleOpenMiniGame("worcester")}
          exploreVideoSource={worcesterExploreVideo}
        />
      )}

      {screen === "wellington" && (
        <WellingtonLevel
          player={player}
          onBack={handleBackToJourneyMap}
          onBoardTrain={handleWellingtonBoardTrain}
          onPlayerStateChange={updatePlayerState}
          onOpenMiniGame={() => handleOpenMiniGame("wellington")}
        />
      )}

      {screen === "bellville" && (
        <BellvilleLevel
          player={player}
          onBack={handleBackToJourneyMap}
          onBoardTrain={handleBellvilleBoardTrain}
          onPlayerStateChange={updatePlayerState}
          onOpenMiniGame={() => handleOpenMiniGame("bellville")}
        />
      )}

      {screen === "cape-town" && (
        <CapeTownLevel
          player={player}
          onBack={handleBackToJourneyMap}
          onOpenMiniGames={() => handleOpenMiniGame("cape-town")}
        />
      )}

      {/* --------------------------------------------- */}
      {/* PRETORIA LEVEL */}
      {/* --------------------------------------------- */}

      {screen === "pretoria" && (
        <PretoriaLevel
          player={player}
          availableHearts={availableHearts}
          heartLossTimestamps={player?.heartLossTimestamps}
          onPlayerDeath={handlePlayerDeath}
          onPlayerRespawn={handlePlayerRespawn}
          onBack={handleBackToJourneyMap}
          onBoardTrain={handleBoardTrain}
          onPlayerStateChange={updatePlayerState}
          onOpenMiniGame={() => handleOpenMiniGame("pretoria")}
          onOpenInventoryMap={handleOpenInventoryMap}
        />
      )}

      {screen === "de-aar" && (
        <PretoriaLevel
          player={player}
          availableHearts={availableHearts}
          heartLossTimestamps={player?.heartLossTimestamps}
          onPlayerDeath={handlePlayerDeath}
          onPlayerRespawn={handlePlayerRespawn}
          onBack={handleBackToJourneyMap}
          onBoardTrain={handleDeAarBoardTrain}
          onPlayerStateChange={updatePlayerState}
          onOpenMiniGame={() => handleOpenMiniGame("de-aar")}
          onOpenInventoryMap={handleOpenInventoryMap}
          location="De Aar"
          levelImage={deAarTrainStopImage}
          exploreVideoSource={deAarExploreVideo}
          deAarMode
        />
      )}

      {screen === "beaufort-west" && (
        <PretoriaLevel
          player={player}
          availableHearts={availableHearts}
          heartLossTimestamps={player?.heartLossTimestamps}
          onPlayerDeath={handlePlayerDeath}
          onPlayerRespawn={handlePlayerRespawn}
          onBack={handleBackToJourneyMap}
          onBoardTrain={handleBeaufortWestBoardTrain}
          onPlayerStateChange={updatePlayerState}
          onOpenMiniGame={() => handleOpenMiniGame("beaufort-west")}
          onOpenInventoryMap={handleOpenInventoryMap}
          location="Beaufort West"
          levelImage={beaufortWestTrainStopImage}
          exploreVideoSource={beaufortWestExploreVideo}
          deAarMode
        />
      )}

      {screen === "mini-game-pretoria" && (
        <MiniGame
          player={player}
          availableHearts={availableHearts}
          heartLossTimestamps={player?.heartLossTimestamps}
          onPlayerDeath={handlePlayerDeath}
          onPlayerRespawn={handlePlayerRespawn}
          onBack={() => handleMiniGameBack("pretoria")}
          onPlayerStateChange={updatePlayerState}
        />
      )}

      {screen === "mini-game-de-aar" && (
        <MiniGame
          player={player}
          availableHearts={availableHearts}
          heartLossTimestamps={player?.heartLossTimestamps}
          onPlayerDeath={handlePlayerDeath}
          onPlayerRespawn={handlePlayerRespawn}
          onBack={() => handleMiniGameBack("de-aar")}
          onPlayerStateChange={updatePlayerState}
        />
      )}

      {screen === "mini-game-beaufort-west" && (
        <MiniGame
          player={player}
          availableHearts={availableHearts}
          heartLossTimestamps={player?.heartLossTimestamps}
          onPlayerDeath={handlePlayerDeath}
          onPlayerRespawn={handlePlayerRespawn}
          onBack={() => handleMiniGameBack("beaufort-west")}
          onPlayerStateChange={updatePlayerState}
        />
      )}

      {screen === "mini-game-wellington" && (
        <MiniGame
          player={player}
          availableHearts={availableHearts}
          heartLossTimestamps={player?.heartLossTimestamps}
          onPlayerDeath={handlePlayerDeath}
          onPlayerRespawn={handlePlayerRespawn}
          onBack={() => handleMiniGameBack("wellington")}
          onPlayerStateChange={updatePlayerState}
        />
      )}

      {screen === "mini-game-bellville" && (
        <MiniGame
          player={player}
          availableHearts={availableHearts}
          heartLossTimestamps={player?.heartLossTimestamps}
          onPlayerDeath={handlePlayerDeath}
          onPlayerRespawn={handlePlayerRespawn}
          onBack={() => handleMiniGameBack("bellville")}
          onPlayerStateChange={updatePlayerState}
        />
      )}

      {screen === "train-boarding" && (
        <TrainBoarding onComplete={handleTrainBoardingComplete} />
      )}

      {screen === "de-aar-train-boarding" && (
        <TrainBoarding
          videoSource={deAarTrainMovingVideo}
          onComplete={handleDeAarTrainBoardingComplete}
        />
      )}

      {screen === "beaufort-west-train-boarding" && (
        <TrainBoarding
          videoSource={beaufortWestTrainMovingVideo}
          onComplete={handleBeaufortWestTrainBoardingComplete}
        />
      )}

      {screen === "worcester-train-boarding" && (
        <TrainBoarding
          videoSource={worcesterTrainMovingVideo}
          onComplete={handleWorcesterTrainBoardingComplete}
        />
      )}

      {screen === "wellington-train-boarding" && (
        <TrainBoarding
          videoSource={wellingtonTrainMovingVideo}
          onComplete={handleWellingtonTrainBoardingComplete}
        />
      )}

      {screen === "bellville-train-boarding" && (
        <TrainBoarding
          videoSource={bellvilleTrainMovingVideo}
          onComplete={handleBellvilleTrainBoardingComplete}
        />
      )}

      {/* --------------------------------------------- */}
      {/* TRAIN JOURNEY */}
      {/* --------------------------------------------- */}

      {screen === "train_inside" && (
        <TrainInside
          player={player}
          availableHearts={availableHearts}
          heartLossTimestamps={player?.heartLossTimestamps}
          onPlayerDeath={handlePlayerDeath}
          onPlayerRespawn={handlePlayerRespawn}
          needs={player?.needs}
          acquiredItems={player?.inventory}
          onBack={handleBackToJourneyMap}
          onPlayerStateChange={updatePlayerState}
          onKnowledgeQuizComplete={handleKnowledgeQuizComplete}
          onComplete={handleTrainJourneyComplete}
          onOpenInventoryMap={handleOpenInventoryMap}
          scene="pretoria"
        />
      )}

      {screen === "kimberley-train-inside" && (
        <TrainInside
          player={player}
          availableHearts={availableHearts}
          heartLossTimestamps={player?.heartLossTimestamps}
          onPlayerDeath={handlePlayerDeath}
          onPlayerRespawn={handlePlayerRespawn}
          needs={player?.needs}
          acquiredItems={player?.inventory}
          onBack={handleBackToJourneyMap}
          onPlayerStateChange={updatePlayerState}
          onKnowledgeQuizComplete={handleKnowledgeQuizComplete}
          onComplete={handleTrainJourneyComplete}
          onOpenInventoryMap={handleOpenInventoryMap}
          scene="kimberley"
        />
      )}

      {screen === "de-aar-train-inside" && (
        <TrainInside
          player={player}
          availableHearts={availableHearts}
          heartLossTimestamps={player?.heartLossTimestamps}
          onPlayerDeath={handlePlayerDeath}
          onPlayerRespawn={handlePlayerRespawn}
          needs={player?.needs}
          acquiredItems={player?.inventory}
          onBack={handleBackToJourneyMap}
          onPlayerStateChange={updatePlayerState}
          onKnowledgeQuizComplete={handleKnowledgeQuizComplete}
          onComplete={handleTrainJourneyComplete}
          onOpenInventoryMap={handleOpenInventoryMap}
          scene="de-aar"
        />
      )}

      {screen === "beaufort-west-train-inside" && (
        <TrainInside
          player={player}
          availableHearts={availableHearts}
          heartLossTimestamps={player?.heartLossTimestamps}
          onPlayerDeath={handlePlayerDeath}
          onPlayerRespawn={handlePlayerRespawn}
          needs={player?.needs}
          acquiredItems={player?.inventory}
          onBack={handleBackToJourneyMap}
          onPlayerStateChange={updatePlayerState}
          onKnowledgeQuizComplete={handleKnowledgeQuizComplete}
          onComplete={handleTrainJourneyComplete}
          onOpenInventoryMap={handleOpenInventoryMap}
          scene="beaufort-west"
        />
      )}

      {screen === "worcester-train-inside" && (
        <TrainInside
          player={player}
          availableHearts={availableHearts}
          heartLossTimestamps={player?.heartLossTimestamps}
          onPlayerDeath={handlePlayerDeath}
          onPlayerRespawn={handlePlayerRespawn}
          needs={player?.needs}
          acquiredItems={player?.inventory}
          onBack={handleBackToJourneyMap}
          onPlayerStateChange={updatePlayerState}
          onKnowledgeQuizComplete={handleKnowledgeQuizComplete}
          onComplete={handleTrainJourneyComplete}
          onOpenInventoryMap={handleOpenInventoryMap}
          scene="worcester"
        />
      )}

      {screen === "wellington-train-inside" && (
        <TrainInside
          player={player}
          availableHearts={availableHearts}
          heartLossTimestamps={player?.heartLossTimestamps}
          onPlayerDeath={handlePlayerDeath}
          onPlayerRespawn={handlePlayerRespawn}
          needs={player?.needs}
          acquiredItems={player?.inventory}
          onBack={handleBackToJourneyMap}
          onPlayerStateChange={updatePlayerState}
          onKnowledgeQuizComplete={handleKnowledgeQuizComplete}
          onComplete={handleTrainJourneyComplete}
          onOpenInventoryMap={handleOpenInventoryMap}
          scene="wellington"
        />
      )}

      {screen === "bellville-train-inside" && (
        <TrainInside
          player={player}
          availableHearts={availableHearts}
          heartLossTimestamps={player?.heartLossTimestamps}
          onPlayerDeath={handlePlayerDeath}
          onPlayerRespawn={handlePlayerRespawn}
          needs={player?.needs}
          acquiredItems={player?.inventory}
          onBack={handleBackToJourneyMap}
          onPlayerStateChange={updatePlayerState}
          onKnowledgeQuizComplete={handleKnowledgeQuizComplete}
          onComplete={handleTrainJourneyComplete}
          onOpenInventoryMap={handleOpenInventoryMap}
          scene="bellville"
        />
      )}

      {screen === "train-journey" && (
        <TrainJourney
          player={player}
          acquiredItems={player?.inventory}
          onComplete={handleTrainJourneyComplete}
        />
      )}

      {screen === "kimberley" && (
        <KimberleyLevel
          player={player}
          availableHearts={availableHearts}
          heartLossTimestamps={player?.heartLossTimestamps}
          onPlayerDeath={handlePlayerDeath}
          onPlayerRespawn={handlePlayerRespawn}
          needs={player?.needs}
          acquiredItems={player?.inventory}
          onBack={handleBackToJourneyMap}
          onPlayerStateChange={updatePlayerState}
          onTrainDepartureComplete={handleKimberleyTrainDepartureComplete}
          onOpenMiniGame={() => handleOpenMiniGame("kimberley")}
          onOpenInventoryMap={handleOpenInventoryMap}
        />
      )}

      {screen === "mini-game-kimberley" && (
        <MiniGame
          player={player}
          availableHearts={availableHearts}
          heartLossTimestamps={player?.heartLossTimestamps}
          onPlayerDeath={handlePlayerDeath}
          onPlayerRespawn={handlePlayerRespawn}
          onBack={() => handleMiniGameBack("kimberley")}
          onPlayerStateChange={updatePlayerState}
        />
      )}

    </div>
  );
}