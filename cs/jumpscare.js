import { VideoPlayer } from './VideoPlayer.js';

// Joue la séquence de jumpscare lorsque le joueur meurt.
// `stage` est l'élément parent où la vidéo est ajoutée.
// `volume` règle le volume de lecture.
// `onVideoReady` est appelé lorsque les dimensions de la vidéo sont connues.
// `onEnded` est appelé une fois la vidéo terminée.
export async function playJumpscareSequence(stage, volume, onVideoReady, onEnded) {
	if (!stage) {
		return null;
	}

	// Vide le contenu actuel du stage avant d'afficher le jumpscare.
	stage.innerHTML = '';

	const player = new VideoPlayer('Assets/video/Jumpscare.mp4');
	const videoElement = player.createVideoElement();
	player.setLoop(false);
	player.setVolume(volume);

	// Dès que les métadonnées sont chargées, on peut ajuster la mise en page.
	videoElement.addEventListener('loadedmetadata', () => {
		if (typeof onVideoReady === 'function' && videoElement.videoWidth && videoElement.videoHeight) {
			onVideoReady(videoElement.videoWidth, videoElement.videoHeight);
		}
	});

	// Aucun événement de fin si onEnded n'est pas passé.
	if (typeof onEnded === 'function') {
		videoElement.addEventListener('ended', () => {
			onEnded();
		}, { once: true });
	}

	stage.prepend(videoElement);
	await player.play();

	return player;
}
