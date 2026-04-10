window.addEventListener("DOMContentLoaded", () => {
	const container = document.getElementById("game-container");
	if (!container) {
		return;
	}

	const existingVideo = document.getElementById("background-video");
	if (existingVideo) {
		return;
	}

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

	const startPlayback = () => {
		backgroundVideo.play().catch(() => {});
	};

	backgroundVideo.addEventListener("canplay", startPlayback, { once: true });
	backgroundVideo.addEventListener("loadedmetadata", startPlayback, { once: true });
	startPlayback();
});
