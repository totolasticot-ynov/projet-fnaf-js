import { VideoPlayer } from './VideoPlayer.js';

class Game {
    constructor() {
        this.videoPlayer = null;
        this.container = null;
    }

    async init() {
        console.log('Lancement du jeu...');
        
        this.container = document.getElementById('game-container');
        if (!this.container) {
            console.error(' Conteneur introuvable');
            return;
        }

        await this.playIntroVideo();
        
        console.log('Jeu lancé');
    }

    async playIntroVideo() {
        this.videoPlayer = new VideoPlayer('Opening/FIVE_NIGHT_AT_YNOV.mp4');
        
        const videoElement = this.videoPlayer.createVideoElement();
        
        this.container.appendChild(videoElement);

        this.videoPlayer.on('ended', () => {
            console.log('Vidéo terminée');
            this.onVideoEnded();
        });

        this.videoPlayer.on('error', (e) => {
            console.error('Erreur de lecture:', e);
        });

        await this.videoPlayer.play();
    }

    onVideoEnded() {
        console.log(' Fin de la vidéo - prêt pour le jeu');
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    const game = new Game();
    await game.init();
});
