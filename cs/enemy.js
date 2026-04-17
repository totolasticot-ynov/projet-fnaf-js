const NIGHT_KEY = "currentNight";
const MAX_NIGHT = 3;
const FOOTSTEP_AUDIO_PATH = "Assets/sounds/FNAF Footsteps - Gaming Sound Effect (HD) - Communist Sound Effects (1080p).mp4";
const ENEMY_ATTACK_TIMEOUT_BY_NIGHT = {
	1: 10000,
	2: 7000,
	3: 5000
};

export function readNight() {
	const storedNight = Number(localStorage.getItem(NIGHT_KEY));
	if (Number.isNaN(storedNight)) {
		return 1;
	}

	return Math.max(1, Math.min(MAX_NIGHT, Math.floor(storedNight)));
}

function getEnemyMoveChance(night) {
	return Math.min(0.9, night / 5);
}

function getEnemyAttackTimeout(night) {
	return ENEMY_ATTACK_TIMEOUT_BY_NIGHT[night] ?? ENEMY_ATTACK_TIMEOUT_BY_NIGHT[1];
}

function playDirectionalFootsteps(side) {
	const AudioContextClass = window.AudioContext || window.webkitAudioContext;
	if (!AudioContextClass) {
		return;
	}

	const audioContext = new AudioContextClass();
	const footstepsAudio = new Audio(FOOTSTEP_AUDIO_PATH);
	footstepsAudio.preload = "auto";
	footstepsAudio.loop = false;
	footstepsAudio.volume = 1;

	const source = audioContext.createMediaElementSource(footstepsAudio);
	const gainNode = audioContext.createGain();
	gainNode.gain.value = 0.9;

	if (typeof audioContext.createStereoPanner === "function") {
		const stereoPanner = audioContext.createStereoPanner();
		stereoPanner.pan.value = side === "left" ? -1 : 1;
		source.connect(stereoPanner);
		stereoPanner.connect(gainNode);
	} else {
		source.connect(gainNode);
	}

	gainNode.connect(audioContext.destination);

	const cleanup = () => {
		source.disconnect();
		gainNode.disconnect();
		audioContext.close().catch(() => {});
	};

	footstepsAudio.addEventListener("ended", cleanup, { once: true });
	footstepsAudio.addEventListener("error", cleanup, { once: true });

	audioContext.resume().catch(() => {});
	footstepsAudio.play().catch(cleanup);
}

export function createNightLabel(night) {
	const nightLabel = document.createElement("div");
	nightLabel.id = "night-indicator";
	nightLabel.textContent = `Nuit ${night}`;

	Object.assign(nightLabel.style, {
		position: "absolute",
		top: "16px",
		right: "24px",
		color: "#fff",
		fontSize: "28px",
		fontWeight: "700",
		textShadow: "0 0 12px rgba(0, 0, 0, 0.9)",
		zIndex: "6"
	});

	return nightLabel;
}

export function startSpringtrapBehavior(menuStage, night, doorControls, lightControls, onGameOver) {
	const chance = getEnemyMoveChance(night);
	const attackTimeoutMs = getEnemyAttackTimeout(night);
	const springtrap = document.createElement("img");
	springtrap.src = "Assets/images/Springtrap.png";
	springtrap.alt = "Springtrap";
	springtrap.draggable = false;

	Object.assign(springtrap.style, {
		position: "absolute",
		bottom: "18%",
		width: "24%",
		maxWidth: "260px",
		height: "auto",
		zIndex: "5",
		opacity: "0",
		pointerEvents: "none",
		transition: "opacity 150ms ease",
		display: "block"
	});

	menuStage.appendChild(springtrap);

	let activeAttackTimeoutId = null;
	let activeAttackSide = null;
	let hasTriggeredGameOver = false;
	let unsubscribeFromLightChanges = null;

	const hideEnemy = () => {
		springtrap.style.opacity = "0";
	};

	const positionEnemy = (side) => {
		if (side === "left") {
			springtrap.style.left = "10%";
			springtrap.style.right = "auto";
			springtrap.style.transform = "scaleX(1)";
			return;
		}

		springtrap.style.right = "10%";
		springtrap.style.left = "auto";
		springtrap.style.transform = "scaleX(-1)";
	};

	const updateEnemyVisibility = () => {
		if (!activeAttackSide || !lightControls || typeof lightControls.isLightOn !== "function") {
			hideEnemy();
			return;
		}

		if (lightControls.isLightOn(activeAttackSide)) {
			positionEnemy(activeAttackSide);
			springtrap.style.opacity = "1";
			return;
		}

		hideEnemy();
	};

	const clearActiveAttack = () => {
		if (activeAttackTimeoutId !== null) {
			clearTimeout(activeAttackTimeoutId);
			activeAttackTimeoutId = null;
		}

		activeAttackSide = null;
		hideEnemy();
	};

	const triggerGameOver = () => {
		if (hasTriggeredGameOver) {
			return;
		}

		hasTriggeredGameOver = true;
		clearActiveAttack();

		if (typeof onGameOver === "function") {
			onGameOver();
		}
	};

	const startAttack = (side) => {
		if (activeAttackTimeoutId !== null) {
			return;
		}

		activeAttackSide = side;
		playDirectionalFootsteps(side);
		updateEnemyVisibility();

		activeAttackTimeoutId = setTimeout(() => {
			activeAttackTimeoutId = null;

			if (!doorControls || typeof doorControls.isDoorClosed !== "function" || !doorControls.isDoorClosed(activeAttackSide)) {
				triggerGameOver();
				return;
			}

			activeAttackSide = null;
			hideEnemy();
		}, attackTimeoutMs);
	};

	const moveEnemyToDoor = () => {
		if (hasTriggeredGameOver || activeAttackTimeoutId !== null || Math.random() >= chance) {
			return;
		}

		const goLeft = Math.random() < 0.5;
		if (goLeft) {
			startAttack("left");
		} else {
			startAttack("right");
		}
	};

	const intervalId = setInterval(moveEnemyToDoor, 2800);

	if (lightControls && typeof lightControls.onChange === "function") {
		unsubscribeFromLightChanges = lightControls.onChange(() => {
			updateEnemyVisibility();
		});
	}

	return () => {
		clearInterval(intervalId);
		clearActiveAttack();
		if (typeof unsubscribeFromLightChanges === "function") {
			unsubscribeFromLightChanges();
		}
		springtrap.remove();
	};
}
