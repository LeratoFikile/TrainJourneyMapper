import { useEffect, useState } from "react";

import kimberleyStopImage from "../assets/elements/kimberley_stop.png";
import kimberleyExploreVideo from "../assets/videos/kimberley_explore1.mp4";
import kimberleyTrainLeavingVideo from "../assets/videos/kimberley_train_leaving.mp4";
import navIconCollection from "../assets/elements/navicon_collection.png";
import coinBadgeIcon from "../assets/elements/coin_badge_icon.png";
import guideMamzo from "../assets/characters/guides/mamzo.png";
import guideMalume from "../assets/characters/guides/malume.png";
import skin1 from "../assets/characters/players/skin1.png";
import skin2 from "../assets/characters/players/skin2.png";
import skin3 from "../assets/characters/players/skin3.png";
import skin4 from "../assets/characters/players/skin4.png";
import skin5 from "../assets/characters/players/skin5.png";
import skin6 from "../assets/characters/players/skin6.png";
import drinkingWaterSound from "../assets/sounds/drinking_water.mp3";
import eatingSound from "../assets/sounds/eating.mp3";
import purchaseSound from "../assets/sounds/purchase_sound.mp3";
import { createConfiguredAudio, triggerVibration } from "../settings";
import "./KimberleyLevel.css";

const SKINS = { skin_01: skin1, skin_02: skin2, skin_03: skin3, skin_04: skin4, skin_05: skin5, skin_06: skin6 };
const ITEM_LABELS = {
	water: ["Water bottle", "\uD83D\uDCA7"],
	wallet: ["Wallet", "\uD83D\uDCB0"],
	sandwich: ["Sandwich", "\uD83C\uDF54"],
	map: ["Map", "\uD83D\uDDFA"],
	ticket: ["Ticket", "\uD83C\uDF9F\uFE0F"],
};
const SHOP_ITEMS = [
	{ id: "ticket", label: "Train ticket", icon: "\uD83C\uDF9F\uFE0F", price: 150 },
	{ id: "sandwich", label: "Sandwich", icon: "\uD83C\uDF54", price: 50 },
	{ id: "water", label: "Water bottle", icon: "\uD83D\uDCA7", price: 30 },
];

export default function KimberleyLevel({ player, needs, acquiredItems = [], onBack, onPlayerStateChange, onTrainDepartureComplete, onOpenMiniGame }) {
	const [isCollectionOpen, setIsCollectionOpen] = useState(false);
	const [isShopOpen, setIsShopOpen] = useState(false);
	const [currentNeeds, setCurrentNeeds] = useState(needs || player?.needs || { life: 100, hunger: 86, water: 92 });
	const [collectedItems, setCollectedItems] = useState(acquiredItems);
	const [walletBalance, setWalletBalance] = useState(Number.isFinite(player?.money) ? player.money : 250);
	const [countdownSeconds, setCountdownSeconds] = useState(null);
	const [activeVideo, setActiveVideo] = useState(null);
	const guide = player?.guide === "mamzo" ? guideMamzo : guideMalume;
	const traveller = SKINS[player?.skin] || skin1;

	useEffect(() => {
		setCurrentNeeds(needs || player?.needs || { life: 100, hunger: 86, water: 92 });
	}, [needs, player?.needs]);

	useEffect(() => {
		setCollectedItems(acquiredItems || []);
	}, [acquiredItems]);

	useEffect(() => {
		setWalletBalance(Number.isFinite(player?.money) ? player.money : 250);
	}, [player?.money]);

	useEffect(() => {
		if (countdownSeconds === null || countdownSeconds === 0 || activeVideo) return undefined;

		const timer = window.setInterval(() => {
			setCountdownSeconds((current) => Math.max(0, current - 1));
		}, 1000);

		return () => window.clearInterval(timer);
	}, [activeVideo, countdownSeconds]);

	const countdownLabel = countdownSeconds === null
		? ""
		: `${String(Math.floor(countdownSeconds / 60)).padStart(2, "0")}:${String(countdownSeconds % 60).padStart(2, "0")}`;
	const isGameOver = countdownSeconds === 0;
	const hasTicket = collectedItems.includes("ticket");
	const canBoardTrain = hasTicket && (countdownSeconds === null || countdownSeconds > 0);

	const handleConsumeItem = (item) => {
		if (item.id !== "water" && item.id !== "sandwich") return;

		const nextNeeds = {
			...currentNeeds,
			life: Math.min(100, currentNeeds.life + 10),
			hunger: item.id === "sandwich" ? Math.min(100, currentNeeds.hunger + 30) : currentNeeds.hunger,
			water: item.id === "water" ? Math.min(100, currentNeeds.water + 30) : currentNeeds.water,
		};
		const itemIndex = collectedItems.indexOf(item.id);
		const nextItems = collectedItems.filter((_, index) => index !== itemIndex);

		setCurrentNeeds(nextNeeds);
		setCollectedItems(nextItems);
		onPlayerStateChange({ needs: nextNeeds, inventory: nextItems });

		triggerVibration();
		const sound = createConfiguredAudio(item.id === "water" ? drinkingWaterSound : eatingSound);
		sound.play().catch(() => undefined);
	};

	const handleStartTimer = () => {
		setCountdownSeconds(60);
	};

	const handleExplore = () => {
		setActiveVideo("explore");
	};

	const handleBoardTrain = () => {
		if (!hasTicket) return;

		const ticketIndex = collectedItems.indexOf("ticket");
		const nextItems = collectedItems.filter((_, index) => index !== ticketIndex);
		setCollectedItems(nextItems);
		setCountdownSeconds(null);
		setActiveVideo("train");
		onPlayerStateChange({ inventory: nextItems });
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

	const handleStartOver = () => {
		setCountdownSeconds(null);
	};

	return (
		<main className={`kimberley-level${isGameOver ? " kimberley-level-game-over" : ""}`} aria-label="Kimberley level">
			<img className="kimberley-background" src={kimberleyStopImage} alt="Kimberley station" />
			<button className="kimberley-back-button" onClick={onBack} type="button">
				<span aria-hidden="true">&#8592;</span> Levels
			</button>
			<div className="kimberley-level-heading">
				<p>Next stop</p>
				<h1>De Aar</h1>
			</div>
			<div className="kimberley-registered-characters" aria-label="Registered characters">
				<img className="kimberley-guide" src={guide} alt={player?.guide === "mamzo" ? "Mamzo" : "Malume"} />
				<img className="kimberley-traveller" src={traveller} alt={player?.name || "Traveller"} />
				{countdownSeconds === null && (
					<div className="kimberley-guide-speech" role="note" aria-label="Kimberley guide speech">
						<p>Dumelang! Welcome to Kimberley. A town shaped by diamonds—let's explore!</p>
						<button
							className="kimberley-guide-speech-ok"
							type="button"
							aria-label="Start train departure countdown"
							title="Start train departure countdown"
							onClick={handleStartTimer}
						>
							<span aria-hidden="true">&#10003;</span>
						</button>
					</div>
				)}
			</div>
			{countdownSeconds !== null && (
				<div className={`kimberley-train-countdown${countdownSeconds <= 10 ? " kimberley-train-countdown-urgent" : ""}`} role="timer" aria-live="polite">
					<span>Train leaves in</span>
					<strong>{countdownLabel}</strong>
				</div>
			)}
			<div className="kimberley-needs" aria-label="Traveller status">
				<div className="kimberley-need-meter kimberley-need-life" title={`Life ${Math.round(currentNeeds.life)}%`}>
					<span aria-hidden="true">&#10084;</span>
					<div className="kimberley-need-track"><i style={{ width: `${currentNeeds.life}%` }} /></div>
				</div>
				<div className="kimberley-need-meter kimberley-need-hunger" title={`Hunger ${Math.round(currentNeeds.hunger)}%`}>
					<span aria-hidden="true">&#127830;</span>
					<div className="kimberley-need-track"><i style={{ width: `${currentNeeds.hunger}%` }} /></div>
				</div>
				<div className="kimberley-need-meter kimberley-need-water" title={`Thirst ${Math.round(currentNeeds.water)}%`}>
					<span aria-hidden="true">&#128167;</span>
					<div className="kimberley-need-track"><i style={{ width: `${currentNeeds.water}%` }} /></div>
				</div>
				<button
					className="kimberley-wallet-balance"
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
				<>
					<button
						className="kimberley-shop-button"
						type="button"
						aria-label="Open ticket stand shop"
						title="Shop at the ticket stand"
						onClick={() => setIsShopOpen(true)}
					>
						<span aria-hidden="true">&#128722;</span>
						<small>Shop</small>
					</button>
					<button
						className="kimberley-explore-button"
						type="button"
						aria-label="Explore Kimberley station"
						title="Explore Kimberley station"
						onClick={handleExplore}
					>
						<span aria-hidden="true">&#128065;</span>
						<small>Explore</small>
					</button>
				</>
			)}
			{canBoardTrain && (
				<button
					className="kimberley-board-train-button"
					type="button"
					aria-label="Board train"
					onClick={handleBoardTrain}
				>
					BOARD TRAIN!
				</button>
			)}
			<button
				className="kimberley-collection-button"
				type="button"
				aria-label="Open inventory"
				aria-expanded={isCollectionOpen}
				onClick={() => setIsCollectionOpen(true)}
			>
				<img src={navIconCollection} alt="" />
			</button>
			{isCollectionOpen && (
				<div className="kimberley-collection" role="dialog" aria-label="Inventory" aria-modal="true">
					<div className="kimberley-collection-heading">
						<h2>Inventory</h2>
						<button type="button" aria-label="Close inventory" onClick={() => setIsCollectionOpen(false)}>
							<span aria-hidden="true">&#10005;</span>
						</button>
					</div>
					{collectedItems.length === 0 ? (
						<p>Your inventory is empty.</p>
					) : (
						<div className="kimberley-collection-items">
							{collectedItems.map((itemId, index) => {
								const [label, icon] = ITEM_LABELS[itemId] || [itemId, "\uD83D\uDCE6"];
								const item = { id: itemId };
								const isConsumable = itemId === "water" || itemId === "sandwich";
								return (
									<div className="kimberley-collection-item" key={`${itemId}-${index}`}>
										<span>{icon} {label}</span>
										{isConsumable && (
											<button type="button" onClick={() => handleConsumeItem(item)}>
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
			{isShopOpen && (
				<div className="kimberley-shop-overlay" role="dialog" aria-label="Ticket stand shop" aria-modal="true">
					<div className="kimberley-shop-scroll">
						<div className="kimberley-shop-heading">
							<div>
								<p>Ticket stand</p>
								<h2>Station shop</h2>
							</div>
							<button type="button" aria-label="Close shop" onClick={() => setIsShopOpen(false)}>
								<span aria-hidden="true">&#10005;</span>
							</button>
						</div>
						<div className="kimberley-shop-money">Money: <strong>R{walletBalance}</strong></div>
						<div className="kimberley-shop-items">
							{SHOP_ITEMS.map((item) => {
								const canAfford = walletBalance >= item.price;
								return (
									<button
											className="kimberley-shop-item"
										key={item.id}
										type="button"
											disabled={!canAfford}
											title={!canAfford ? "Not enough money" : undefined}
										onClick={() => handleBuyItem(item)}
									>
										<span className="kimberley-shop-item-icon" aria-hidden="true">{item.icon}</span>
										<span>{item.label}</span>
											<strong>R{item.price}</strong>
									</button>
								);
							})}
						</div>
					</div>
				</div>
			)}
			{activeVideo && (
				<div className="kimberley-video-overlay" role="dialog" aria-label={activeVideo === "train" ? "Train leaving Kimberley" : "Explore Kimberley station"}>
					<video
						className="kimberley-fullscreen-video"
						src={activeVideo === "train" ? kimberleyTrainLeavingVideo : kimberleyExploreVideo}
						autoPlay
						playsInline
						onEnded={activeVideo === "train" ? onTrainDepartureComplete : undefined}
					/>
				</div>
			)}
			{isGameOver && (
				<div className="kimberley-game-over" role="dialog" aria-label="Traveller has died">
					<p>Time's up</p>
					<div className="kimberley-game-over-actions">
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
