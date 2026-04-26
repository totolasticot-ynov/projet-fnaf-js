import { VideoPlayer } from './VideoPlayer.js';

export async function playEndSequence(stage, volume, onVideoReady, onEnded) {
	if (!stage) {
		return null;
	}

	stage.innerHTML = '';

	const player = new VideoPlayer('Assets/video/Win-Fnaf.mp4');
	const videoElement = player.createVideoElement();
	player.setLoop(false);
	player.setVolume(volume);

	videoElement.addEventListener('loadedmetadata', () => {
		if (typeof onVideoReady === 'function' && videoElement.videoWidth && videoElement.videoHeight) {
			onVideoReady(videoElement.videoWidth, videoElement.videoHeight);
		}
	});

	if (typeof onEnded === 'function') {
		videoElement.addEventListener('ended', () => {
			onEnded();
		}, { once: true });
	}

	stage.prepend(videoElement);
	await player.play();

	return player;
}
