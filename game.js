// game.js - Point d'entrée principal du jeu
import { VideoPlayer } from './VideoPlayer.js';

class Game {
    constructor() {
        this.videoPlayer = null;
        this.container = null;
    }

    async init() {
        console.log('🎮 Lancement du jeu...');
        
        this.container = document.getElementById('game-container');
        if (!this.container) {
            console.error('❌ Conteneur introuvable');
            return;
        }

        // Lancer la vidéo d'intro
        await this.playIntroVideo();
        
        console.log('✅ Jeu lancé');
    }

    async playIntroVideo() {
        this.videoPlayer = new VideoPlayer('Opening/FIVE NIGHT AT YNOV (3).mp4');
        
        const videoElement = this.videoPlayer.createVideoElement();
        
        // Empêcher le clic droit
        videoElement.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Ajouter au conteneur
        this.container.appendChild(videoElement);

        // Événement de fin
        this.videoPlayer.on('ended', () => {
            console.log('✅ Vidéo terminée');
            this.onVideoEnded();
        });

        this.videoPlayer.on('error', (e) => {
            console.error('❌ Erreur de lecture:', e);
        });

        // Lancer la lecture
        await this.videoPlayer.play();
    }

    onVideoEnded() {
        console.log('📝 Fin de la vidéo - prêt pour le jeu');
        // Ici vous pouvez charger le jeu principal
    }
}

// Lancer au chargement
window.addEventListener('DOMContentLoaded', async () => {
    const game = new Game();
    await game.init();
});
