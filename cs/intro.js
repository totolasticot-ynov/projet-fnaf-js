import { VideoPlayer } from './VideoPlayer.js';

// Joue la vidéo d'introduction au début du jeu.
// `stage` est l'élément parent dans lequel la vidéo est insérée.
// `volume` définit le niveau sonore de la lecture.
// `onVideoReady` est appelé lorsque les métadonnées de la vidéo sont chargées.
export async function playIntroSequence(stage, volume, onVideoReady) {
	if (!stage) {
		return null;
	}

	// Prépare le lecteur vidéo avec le fichier d'introduction.
	const player = new VideoPlayer('Opening/FIVE NIGHT AT YNOV .mp4');
	const videoElement = player.createVideoElement();
	player.setVolume(volume);

	// Lorsque la vidéo a chargé ses dimensions, on peut ajuster l'affichage.
	videoElement.addEventListener('loadedmetadata', () => {
		if (typeof onVideoReady === 'function' && videoElement.videoWidth && videoElement.videoHeight) {
			onVideoReady(videoElement.videoWidth, videoElement.videoHeight);
		}
	});

	stage.prepend(videoElement);
	await player.play();

	return player;
}
