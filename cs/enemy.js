import { K, loadGame } from './save.js';

const MAX_NIGHT = 3;
const FOOTSTEP_AUDIO_PATH = "Assets/sounds/FNAF Footsteps - Gaming Sound Effect (HD) - Communist Sound Effects (1080p).mp4";
const ENEMY_ATTACK_TIMEOUT_BY_NIGHT = {
	1: 10000,
	2: 7000,
	3: 5000
};

// Lit la nuit actuelle depuis le localStorage.
export function readNight() {
	// Essayer d'abord de lire depuis save.js
	const savedGame = loadGame();
	if (savedGame && savedGame.currentNight) {
		return Math.max(1, Math.min(MAX_NIGHT, Math.floor(savedGame.currentNight)));
	}

	// Fallback sur localStorage direct
	const storedNight = Number(localStorage.getItem(K.N));
	if (Number.isNaN(storedNight)) {
		return 1;
	}

	return Math.max(1, Math.min(MAX_NIGHT, Math.floor(storedNight)));
}

// Retourne la probabilité d'une attaque en fonction de la nuit.
const getChance = (night) => Math.min(0.9, night / 5);
// Retourne la durée d'attente avant le prochain essai d'attaque.
const getTimeout = (night) => ENEMY_ATTACK_TIMEOUT_BY_NIGHT[night] ?? ENEMY_ATTACK_TIMEOUT_BY_NIGHT[1];

// Joue un son de pas directionnel à gauche ou à droite.
function playDirectionalFootsteps(side) {
	const AudioCtx = window.AudioContext || window.webkitAudioContext;
	if (!AudioCtx) return;
	const ctx = new AudioCtx();
	const audio = new Audio(FOOTSTEP_AUDIO_PATH);
	audio.preload = audio.loop = false;
	audio.volume = 1;

	const src = ctx.createMediaElementSource(audio);
	const gain = ctx.createGain();
	gain.gain.value = 0.9;

	if (ctx.createStereoPanner) {
		const pan = ctx.createStereoPanner();
		pan.pan.value = side === "left" ? -1 : 1;
		src.connect(pan).connect(gain);
	} else {
		src.connect(gain);
	}

	gain.connect(ctx.destination);
	const clean = () => {
		src.disconnect();
		gain.disconnect();
		ctx.close().catch(() => {});
	};

	audio.addEventListener("ended", clean, { once: true });
	audio.addEventListener("error", clean, { once: true });
	ctx.resume().catch(() => {});
	audio.play().catch(clean);
}

// Crée un indicateur visuel de la nuit actuelle.
export function createNightLabel(night) {
	const label = document.createElement("div");
	label.id = "night-indicator";
	label.textContent = `Nuit ${night}`;
	Object.assign(label.style, {
		position: "absolute",
		top: "16px",
		right: "24px",
		color: "#fff",
		fontSize: "28px",
		fontWeight: "700",
		textShadow: "0 0 12px rgba(0, 0, 0, 0.9)",
		zIndex: "6"
	});
	return label;
}

// Démarre le comportement de Springtrap pendant la nuit.
// `doors` et `lights` permettent de vérifier si le joueur protège son office.
// `dangerDisplay` affiche l'image de Springtrap ou de l'office.
// `onGameOver` est appelé si le joueur perd.
export function startSpringtrapBehavior(night, doors, lights, dangerDisplay, onGameOver) {
	let atkId = null;
	let atkSide = null;
	let ended = false;
	let unsub = null;

	// Affiche l'état normal de l'office.
	const showOffice = () => dangerDisplay?.setOffice?.();

	// Affiche Springtrap uniquement si il y a une attaque et que la lumière est allumée du côté correspondant.
	const showSpringtrap = () => {
		if (!atkSide || !lights?.isLightOn?.(atkSide)) {
			showOffice();
			return;
		}

		dangerDisplay?.setSpringtrap?.(atkSide);
	};

	// Réinitialise l'attaque en cours et remet l'office visible.
	const clear = () => {
		clearTimeout(atkId);
		atkId = null;
		atkSide = null;
		showOffice();
	};

	// Termine la partie si Springtrap réussit à entrer.
	const gameOver = () => {
		if (ended) return;
		ended = true;
		clear();
		onGameOver?.();
	};

	// Lance une attaque sur un côté donné.
	const attack = (s) => {
		if (atkId) return;
		atkSide = s;
		playDirectionalFootsteps(s);
		showSpringtrap();

		atkId = setTimeout(() => {
			atkId = null;
			if (!doors?.isDoorClosed?.(atkSide)) {
				gameOver();
				return;
			}
			atkSide = null;
			showOffice();
		}, getTimeout(night));
	};

	// Boucle principale qui tente une attaque toutes les 2,8 secondes.
	const iId = setInterval(() => {
		if (ended || atkId || Math.random() >= getChance(night)) return;
		attack(Math.random() < 0.5 ? "left" : "right");
	}, 2800);

	// Si les lumières changent, mettre à jour l'image de Springtrap.
	if (lights?.onChange) {
		unsub = lights.onChange(() => showSpringtrap());
	}

	showOffice();

	// Retourne une fonction de nettoyage pour arrêter le comportement.
	return () => {
		clearInterval(iId);
		clear();
		unsub?.();
	};
}
