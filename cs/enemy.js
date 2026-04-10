const NIGHT_KEY = "currentNight";
const MAX_NIGHT = 3;
const FOOTSTEP_AUDIO_PATH = "Assets/sounds/FNAF Footsteps - Gaming Sound Effect (HD) - Communist Sound Effects (1080p).mp4";

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

export function startSpringtrapBehavior(menuStage, night) {
	const springtrap = document.createElement("img");
	springtrap.id = "springtrap-enemy";
	springtrap.src = "Assets/Springtrap.png";
	springtrap.alt = "Springtrap";

	Object.assign(springtrap.style, {
		position: "absolute",
		bottom: "20%",
		width: "220px",
		maxWidth: "28vw",
		height: "auto",
		zIndex: "5",
		opacity: "0",
		pointerEvents: "none",
		transition: "opacity 220ms ease"
	});

	menuStage.appendChild(springtrap);

	const chance = getEnemyMoveChance(night);
	let hideTimeoutId = null;

	const hideEnemy = () => {
		springtrap.style.opacity = "0";
	};

	const moveEnemyToDoor = () => {
		if (Math.random() >= chance) {
			return;
		}

		const goLeft = Math.random() < 0.5;
		if (goLeft) {
			springtrap.style.left = "14%";
			springtrap.style.right = "auto";
			springtrap.style.transform = "scaleX(1)";
			playDirectionalFootsteps("left");
		} else {
			springtrap.style.right = "14%";
			springtrap.style.left = "auto";
			springtrap.style.transform = "scaleX(-1)";
			playDirectionalFootsteps("right");
		}

		springtrap.style.opacity = "1";

		if (hideTimeoutId !== null) {
			clearTimeout(hideTimeoutId);
		}

		hideTimeoutId = setTimeout(() => {
			hideEnemy();
			hideTimeoutId = null;
		}, 1200);
	};

	const intervalId = setInterval(moveEnemyToDoor, 2800);

	return () => {
		clearInterval(intervalId);

		if (hideTimeoutId !== null) {
			clearTimeout(hideTimeoutId);
		}

		hideEnemy();
		springtrap.remove();
	};
}
