const NIGHT_KEY = "currentNight", MAX_NIGHT = 3;
const FOOTSTEP_PATH = "Assets/sounds/FNAF Footsteps - Gaming Sound Effect (HD) - Communist Sound Effects (1080p).mp4";
const TIMEOUT_BY_NIGHT = { 1: 10000, 2: 7000, 3: 5000 };

export function readNight() {
	const n = Number(localStorage.getItem(NIGHT_KEY));
	return isNaN(n) ? 1 : Math.max(1, Math.min(MAX_NIGHT, Math.floor(n)));
}

const getChance = (night) => Math.min(0.9, night / 5);
const getTimeout = (night) => TIMEOUT_BY_NIGHT[night] ?? TIMEOUT_BY_NIGHT[1];

function playDirectionalFootsteps(side) {
	const AudioCtx = window.AudioContext || window.webkitAudioContext;
	if (!AudioCtx) return;
	const ctx = new AudioCtx(), audio = new Audio(FOOTSTEP_PATH);
	audio.preload = audio.loop = false; audio.volume = 1;
	const src = ctx.createMediaElementSource(audio), gain = ctx.createGain();
	gain.gain.value = 0.9;
	if (ctx.createStereoPanner) {
		const pan = ctx.createStereoPanner();
		pan.pan.value = side === "left" ? -1 : 1;
		src.connect(pan).connect(gain);
	} else src.connect(gain);
	gain.connect(ctx.destination);
	const clean = () => (src.disconnect(), gain.disconnect(), ctx.close().catch(() => {}));
	audio.addEventListener("ended", clean, { once: true });
	audio.addEventListener("error", clean, { once: true });
	ctx.resume().catch(() => {}); audio.play().catch(clean);
}

export function createNightLabel(night) {
	const label = document.createElement("div");
	label.id = "night-indicator";
	label.textContent = `Nuit ${night}`;
	Object.assign(label.style, {
		position: "absolute", top: "16px", right: "24px", color: "#fff", fontSize: "28px",
		fontWeight: "700", textShadow: "0 0 12px rgba(0, 0, 0, 0.9)", zIndex: "6"
	});
	return label;
}

export function startSpringtrapBehavior(stage, night, doors, lights, onGameOver) {
	const img = document.createElement("img");
	img.src = "Assets/images/Springtrap.png"; img.alt = "Springtrap"; img.draggable = false;
	Object.assign(img.style, {
		position: "absolute", bottom: "18%", width: "24%", maxWidth: "260px", height: "auto",
		zIndex: "5", opacity: "0", pointerEvents: "none", transition: "opacity 150ms ease"
	});
	stage.appendChild(img);

	let atkId = null, atkSide = null, ended = false, unsub = null;
	const hide = () => (img.style.opacity = "0");
	const position = (s) => {
		img.style.left = s === "left" ? "10%" : "auto";
		img.style.right = s === "left" ? "auto" : "10%";
		img.style.transform = s === "left" ? "scaleX(1)" : "scaleX(-1)";
	};
	const show = () => {
		if (!atkSide || !lights?.isLightOn?.(atkSide)) { hide(); return; }
		position(atkSide); img.style.opacity = "1";
	};
	const clear = () => (clearTimeout(atkId), atkId = null, atkSide = null, hide());
	const gameOver = () => {
		if (ended) return; ended = true; clear(); onGameOver?.();
	};
	const attack = (s) => {
		if (atkId) return;
		atkSide = s; playDirectionalFootsteps(s); show();
		atkId = setTimeout(() => {
			atkId = null;
			if (!doors?.isDoorClosed?.(atkSide)) { gameOver(); return; }
			atkSide = null; hide();
		}, getTimeout(night));
	};
	const iId = setInterval(() => {
		if (ended || atkId || Math.random() >= getChance(night)) return;
		attack(Math.random() < 0.5 ? "left" : "right");
	}, 2800);
	if (lights?.onChange) unsub = lights.onChange(() => show());
	return () => (clearInterval(iId), clear(), unsub?.(), img.remove());
}
