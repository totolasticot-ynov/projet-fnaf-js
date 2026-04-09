import { VideoPlayer } from './VideoPlayer.js';

export async function playIntroSequence(stage, volume, onVideoReady) {
	if (!stage) {
		return null;
	}

	const player = new VideoPlayer('Opening/FIVE NIGHT AT YNOV .mp4');
	const videoElement = player.createVideoElement();
	player.setVolume(volume);

	videoElement.addEventListener('loadedmetadata', () => {
		if (typeof onVideoReady === 'function' && videoElement.videoWidth && videoElement.videoHeight) {
			onVideoReady(videoElement.videoWidth, videoElement.videoHeight);
		}
	});

	stage.prepend(videoElement);
	await player.play();

	return player;
}
