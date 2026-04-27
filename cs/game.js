// Initialise la vidéo de fond après le chargement du DOM.
window.addEventListener("DOMContentLoaded", () => {
	const container = document.getElementById("game-container");
	if (!container) {
		return;
	}

	// Évite d'ajouter plusieurs vidéos si elle existe déjà.
	const existingVideo = document.getElementById("background-video");
	if (existingVideo) {
		return;
	}

	// Création de l'élément vidéo de fond.
	const backgroundVideo = document.createElement("video");
	backgroundVideo.id = "background-video";
	backgroundVideo.src = "Assets/video/FIVE NIGHT AT YNOV .mp4";
	backgroundVideo.autoplay = true;
	backgroundVideo.loop = true;
	backgroundVideo.muted = true;
	backgroundVideo.playsInline = true;
	backgroundVideo.preload = "auto";
	backgroundVideo.controls = false;

	Object.assign(backgroundVideo.style, {
		position: "absolute",
		inset: "0",
		width: "100%",
		height: "100%",
		objectFit: "contain",
		zIndex: "0",
		pointerEvents: "none"
	});

	container.prepend(backgroundVideo);

	// Tente de lancer la lecture sans bloquer si le navigateur empêche l'autoplay.
	const startPlayback = () => {
		backgroundVideo.play().catch(() => {});
	};

	backgroundVideo.addEventListener("canplay", startPlayback, { once: true });
	backgroundVideo.addEventListener("loadedmetadata", startPlayback, { once: true });
	startPlayback();
});
