import { VideoPlayer } from './VideoPlayer.js';

export async function playJumpscareSequence(stage, volume, onVideoReady) {
	if (!stage) {
		return null;
	}

	stage.innerHTML = '';

	const player = new VideoPlayer('Assets/Jumpscare.mp4');
	const videoElement = player.createVideoElement();
	player.setLoop(false);
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
