import { useEffect, useState } from "react";
import scrollBackground from "../assets/miniGame/blank-scroll-nobg.png";
import matchLogo from "../assets/miniGame/train_match_logo.png";
import blueTrain from "../assets/miniGame/train-blue.png";
import greenTrain from "../assets/miniGame/train-green.png";
import orangeTrain from "../assets/miniGame/train-orange.png";
import pinkTrain from "../assets/miniGame/train-pink.png";
import purpleTrain from "../assets/miniGame/train-purple.png";
import redTrain from "../assets/miniGame/train-red.png";
import yellowTrain from "../assets/miniGame/train-yellow.png";
import coinBadgeIcon from "../assets/elements/coin_badge_icon.png";
import miniGameMusic from "../assets/miniGame/miniGame_music.mp3";
import miniGameLoseSound from "../assets/miniGame/miniGame_lose.mp3";
import miniGameWinSound from "../assets/miniGame/miniGame_win.mp3";
import tileMoveSound from "../assets/miniGame/tile_move.mp3";
import tileMatchSound from "../assets/miniGame/tile_match.mp3";
import "./miniGame.css";
import { createConfiguredAudio, triggerVibration } from "../settings";
import { MINI_GAME_REWARD } from "../gameConstants";

const TRAIN_TYPES = [
	["blue", blueTrain],
	["green", greenTrain],
	["orange", orangeTrain],
	["pink", pinkTrain],
	["purple", purpleTrain],
	["red", redTrain],
	["yellow", yellowTrain],
];
const BOARD_SIZE = 6;
const MATCH_TARGET = 10;
const REWARD = MINI_GAME_REWARD;
const GAME_TIME = 60;
const DEFAULT_NEEDS = { life: 100, hunger: 86, water: 92 };

function randomTrain() {
	const [type, image] = TRAIN_TYPES[Math.floor(Math.random() * TRAIN_TYPES.length)];
	return { type, image };
}

function findMatches(board) {
	const matches = new Set();

	for (let row = 0; row < BOARD_SIZE; row += 1) {
		let runStart = 0;
		for (let column = 1; column <= BOARD_SIZE; column += 1) {
			const current = column < BOARD_SIZE ? board[row * BOARD_SIZE + column]?.type : null;
			const startType = board[row * BOARD_SIZE + runStart]?.type;
			if (current !== startType) {
				if (column - runStart >= 3) {
					for (let matchColumn = runStart; matchColumn < column; matchColumn += 1) matches.add(row * BOARD_SIZE + matchColumn);
				}
				runStart = column;
			}
		}
	}

	for (let column = 0; column < BOARD_SIZE; column += 1) {
		let runStart = 0;
		for (let row = 1; row <= BOARD_SIZE; row += 1) {
			const current = row < BOARD_SIZE ? board[row * BOARD_SIZE + column]?.type : null;
			const startType = board[runStart * BOARD_SIZE + column]?.type;
			if (current !== startType) {
				if (row - runStart >= 3) {
					for (let matchRow = runStart; matchRow < row; matchRow += 1) matches.add(matchRow * BOARD_SIZE + column);
				}
				runStart = row;
			}
		}
	}

	return matches;
}

function findHint(board) {
	for (let index = 0; index < board.length; index += 1) {
		const neighbors = [];
		if (index % BOARD_SIZE < BOARD_SIZE - 1) neighbors.push(index + 1);
		if (index < board.length - BOARD_SIZE) neighbors.push(index + BOARD_SIZE);

		for (const neighbor of neighbors) {
			const swappedBoard = [...board];
			[swappedBoard[index], swappedBoard[neighbor]] = [swappedBoard[neighbor], swappedBoard[index]];
			if (findMatches(swappedBoard).size > 0) return [index, neighbor];
		}
	}

	return null;
}

function createBoard() {
	let board;
	do {
		board = Array.from({ length: BOARD_SIZE * BOARD_SIZE }, randomTrain);
	} while (findMatches(board).size > 0);
	return board;
}

function collapseBoard(board, matches) {
	const nextBoard = Array(BOARD_SIZE * BOARD_SIZE).fill(null);

	for (let column = 0; column < BOARD_SIZE; column += 1) {
		const remaining = [];
		for (let row = BOARD_SIZE - 1; row >= 0; row -= 1) {
			const index = row * BOARD_SIZE + column;
			if (!matches.has(index)) remaining.push(board[index]);
		}
		for (let row = BOARD_SIZE - 1; row >= 0; row -= 1) {
			nextBoard[row * BOARD_SIZE + column] = remaining[BOARD_SIZE - 1 - row] || randomTrain();
		}
	}

	return nextBoard;
}

function resolveBoard(board) {
	let nextBoard = board;
	let matchCount = 0;
	let matches = findMatches(nextBoard);

	while (matches.size > 0) {
		matchCount += 1;
		nextBoard = collapseBoard(nextBoard, matches);
		matches = findMatches(nextBoard);
	}

	return { board: nextBoard, matchCount };
}

export default function MiniGame({ player, onBack, onPlayerStateChange }) {
	const [board, setBoard] = useState(createBoard);
	const [selected, setSelected] = useState(null);
	const [matchesMade, setMatchesMade] = useState(0);
	const [seconds, setSeconds] = useState(GAME_TIME);
	const [gameState, setGameState] = useState("playing");
	const [rewardClaimed, setRewardClaimed] = useState(false);
	const [currentNeeds, setCurrentNeeds] = useState(player?.needs || DEFAULT_NEEDS);
	const [hint, setHint] = useState(null);
	const money = Number.isFinite(player?.money) ? player.money : 250;

	useEffect(() => {
		const music = createConfiguredAudio(miniGameMusic, "music");
		music.loop = true;
		music.volume = 0.55;
		music.play().catch(() => undefined);

		return () => {
			music.pause();
			music.currentTime = 0;
		};
	}, []);

	useEffect(() => {
		if (gameState !== "playing" || seconds === 0) return undefined;
		const timer = window.setInterval(() => setSeconds((current) => Math.max(0, current - 1)), 1000);
		return () => window.clearInterval(timer);
	}, [gameState, seconds]);

	useEffect(() => {
		if (gameState !== "playing") return undefined;

		const drainTimer = window.setInterval(() => {
			setCurrentNeeds((current) => {
				const nextNeeds = {
					life: Math.max(0, current.life - 0.2),
					hunger: Math.max(0, current.hunger - 0.7),
					water: Math.max(0, current.water - 0.9),
				};
				onPlayerStateChange({ needs: nextNeeds });
				if (Object.values(nextNeeds).some((value) => value <= 0)) setGameState("lost");
				return nextNeeds;
			});
		}, 5000);

		return () => window.clearInterval(drainTimer);
	}, [gameState, onPlayerStateChange]);

	useEffect(() => {
		if (gameState !== "playing") return undefined;

		setHint(null);
		const hintTimer = window.setTimeout(() => setHint(findHint(board)), 7000);
		return () => window.clearTimeout(hintTimer);
	}, [board, gameState, selected]);

	useEffect(() => {
		if (seconds === 0 && gameState === "playing") setGameState("lost");
	}, [gameState, seconds]);

	useEffect(() => {
		if (matchesMade >= MATCH_TARGET && gameState === "playing") setGameState("won");
	}, [gameState, matchesMade]);

	useEffect(() => {
		if (gameState === "won") {
			triggerVibration([80, 40, 80]);
			createConfiguredAudio(miniGameWinSound).play().catch(() => undefined);
		}
	}, [gameState]);

	useEffect(() => {
		if (gameState === "lost") {
			createConfiguredAudio(miniGameLoseSound).play().catch(() => undefined);
		}
	}, [gameState]);

	useEffect(() => {
		if (gameState !== "won" || rewardClaimed) return;
		setRewardClaimed(true);
		onPlayerStateChange({ money: money + REWARD });
	}, [gameState, money, onPlayerStateChange, rewardClaimed]);

	const handleTileClick = (index) => {
		if (gameState !== "playing") return;
		setHint(null);
		if (selected === null) {
			setSelected(index);
			return;
		}
		if (selected === index) {
			setSelected(null);
			return;
		}

		const rowDistance = Math.abs(Math.floor(selected / BOARD_SIZE) - Math.floor(index / BOARD_SIZE));
		const columnDistance = Math.abs((selected % BOARD_SIZE) - (index % BOARD_SIZE));
		if (rowDistance + columnDistance !== 1) {
			setSelected(index);
			return;
		}

		const swappedBoard = [...board];
		[swappedBoard[selected], swappedBoard[index]] = [swappedBoard[index], swappedBoard[selected]];
		const moveSound = createConfiguredAudio(tileMoveSound);
		moveSound.play().catch(() => undefined);
		const matches = findMatches(swappedBoard);
		if (matches.size === 0) {
			setSelected(null);
			return;
		}

		triggerVibration(20);
		const matchSound = createConfiguredAudio(tileMatchSound);
		matchSound.play().catch(() => undefined);
		const resolved = resolveBoard(swappedBoard);
		setBoard(resolved.board);
		setMatchesMade((current) => current + resolved.matchCount);
		setSelected(null);
	};

	const handleRestart = () => {
		setBoard(createBoard());
		setSelected(null);
		setMatchesMade(0);
		setSeconds(GAME_TIME);
		setGameState("playing");
		setRewardClaimed(false);
		setHint(null);
	};

	return (
		<main className="mini-game" aria-label="Train Match mini game">
			<img className="mini-game-scroll" src={scrollBackground} alt="" />
			<div className="mini-game-content">
				<button className="mini-game-back" type="button" onClick={onBack} aria-label="Back to level">
					<span aria-hidden="true">&#8592;</span> Back
				</button>
				<div className="mini-game-money" aria-label={`Current money R${money}`}>
					<img src={coinBadgeIcon} alt="" />
					<strong>R{gameState === "won" ? money + REWARD : money}</strong>
				</div>
				<img className="mini-game-logo" src={matchLogo} alt="Train Match" />
				<div className="mini-game-heading">
					<h1>Match the trains!</h1>
					<p>Swap neighboring trains to make runs of three. Make {MATCH_TARGET} matches before time runs out to win R{REWARD}.</p>
					<div className={`mini-game-timer${seconds <= 10 ? " is-urgent" : ""}`} role="timer" aria-live="polite">{seconds}s</div>
					<div className="mini-game-progress">Matches made: <strong>{Math.min(matchesMade, MATCH_TARGET)}/{MATCH_TARGET}</strong></div>
					{hint && <div className="mini-game-hint" role="status">Try these highlighted trains!</div>}
					<div className="mini-game-needs" aria-label="Traveller needs while playing">
						<span title={`Life ${Math.round(currentNeeds.life)}%`}><b aria-hidden="true">&#10084;</b><i><em style={{ width: `${currentNeeds.life}%` }} /></i></span>
						<span title={`Hunger ${Math.round(currentNeeds.hunger)}%`}><b aria-hidden="true">&#127830;</b><i><em style={{ width: `${currentNeeds.hunger}%` }} /></i></span>
						<span title={`Thirst ${Math.round(currentNeeds.water)}%`}><b aria-hidden="true">&#128167;</b><i><em style={{ width: `${currentNeeds.water}%` }} /></i></span>
					</div>
				</div>
				<div className="mini-game-board" aria-label="Train matching board">
					{board.map((tile, index) => {
						const isSelected = selected === index;
						const isHint = hint?.includes(index);
						return (
							<button
								className={`mini-game-tile${isSelected ? " is-selected" : ""}${isHint ? " is-hint" : ""}`}
								key={`${tile.type}-${index}`}
								type="button"
								onClick={() => handleTileClick(index)}
								aria-label={`${tile.type} train tile${isSelected ? ", selected" : ""}`}
							>
								<img src={tile.image} alt={`${tile.type} train`} />
							</button>
						);
					})}
				</div>
				{gameState !== "playing" && (
					<div className="mini-game-result" role="dialog" aria-modal="true">
						<h2>{gameState === "won" ? "You did it!" : "Journey needs are empty!"}</h2>
						<p>{gameState === "won" ? `You earned R${REWARD}.` : "Your traveller needs a break. Try again!"}</p>
						<button type="button" onClick={handleRestart}>{gameState === "won" ? "Play again" : "Try again"}</button>
					</div>
				)}
			</div>
		</main>
	);
}