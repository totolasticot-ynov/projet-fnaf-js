import { VideoPlayer } from './VideoPlayer.js';

// Joue la séquence de fin de partie.
// `stage` est l'élément parent où la vidéo doit être ajoutée.
// `volume` règle le volume de lecture.
// `onVideoReady` est appelé lorsque les dimensions de la vidéo sont connues.
// `onEnded` est appelé lorsque la vidéo est terminée.
export async function playEndSequence(stage, volume, onVideoReady, onEnded) {
	if (!stage) {
		return null;
	}

	// Vide le stage avant d'ajouter la vidéo de fin.
	stage.innerHTML = '';

	const player = new VideoPlayer('Assets/video/Win-Fnaf.mp4');
	const videoElement = player.createVideoElement();
	player.setLoop(false);
	player.setVolume(volume);

	// Dès que les métadonnées sont chargées, on peut récupérer la taille de la vidéo.
	videoElement.addEventListener('loadedmetadata', () => {
		if (typeof onVideoReady === 'function' && videoElement.videoWidth && videoElement.videoHeight) {
			onVideoReady(videoElement.videoWidth, videoElement.videoHeight);
		}
	});

	// Si une action de fin est fournie, l'appeler quand la vidéo se termine.
	if (typeof onEnded === 'function') {
		videoElement.addEventListener('ended', () => {
			onEnded();
		}, { once: true });
	}

	stage.prepend(videoElement);
	await player.play();

	return player;
}
