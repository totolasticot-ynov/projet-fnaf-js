import { VideoPlayer } from './VideoPlayer.js';

class Game {
    constructor() {
        this.videoPlayer = null;
        this.container = null;
        this.stage = null;
        this.videoRatio = 16 / 9;
    }

    getSavedVolume() {
        const stored = Number(localStorage.getItem('gameVolume'));
        if (Number.isNaN(stored)) {
            return 0.5;
        }

        return Math.max(0, Math.min(1, stored));
    }

    async init() {
        console.log('Lancement du jeu...');
        
        this.container = document.getElementById('game-container');
        if (!this.container) {
            console.error(' Conteneur introuvable');
            return;
        }

        this.stage = document.getElementById('menu-stage');
        if (!this.stage) {
            console.error(' Zone de menu introuvable');
            return;
        }

        await this.playIntroVideo();

        window.addEventListener('resize', () => this.updateStageLayout());
        this.updateStageLayout();
        
        console.log('Jeu lancé');
    }

    async playIntroVideo() {
        this.videoPlayer = new VideoPlayer('Opening/FIVE NIGHT AT YNOV .mp4');
        
        const videoElement = this.videoPlayer.createVideoElement();
        this.videoPlayer.setVolume(this.getSavedVolume());

        videoElement.addEventListener('loadedmetadata', () => {
            if (videoElement.videoWidth && videoElement.videoHeight) {
                this.videoRatio = videoElement.videoWidth / videoElement.videoHeight;
                this.updateStageLayout();
            }
        });

        this.stage.prepend(videoElement);

        await this.videoPlayer.play();
    }
    setupUIEvents() {
        const optionsButton = document.getElementById('Options');
        const closeOptionsButton = document.getElementById('close-options');

        if (optionsButton) {
            optionsButton.addEventListener('click', () => this.showOptions());
        }

        if (closeOptionsButton) {
            closeOptionsButton.addEventListener('click', () => this.hideOptions());
        }

        if (this.volumeSlider && this.volumeValue) {
            this.volumeSlider.addEventListener('input', (event) => {
                const volume = Number(event.target.value);
                this.volumeValue.textContent = String(volume);
                this.setVolume(volume / 100);
            });

            const initialVolume = Number(this.volumeSlider.value);
            this.volumeValue.textContent = String(initialVolume);
            this.setVolume(initialVolume / 100); 
        }
    }

    showOptions() {
        if (!this.optionsPanel) return;

        this.optionsPanel.style.display = 'block';
        this.optionsPanel.setAttribute('aria-hidden', 'false');
    }

    hideOptions() {
        if (!this.optionsPanel) return;

        this.optionsPanel.style.display = 'none';
        this.optionsPanel.setAttribute('aria-hidden', 'true');
    }

    setVolume(value) {
        if (this.videoPlayer) {
            this.videoPlayer.setVolume(value);
        }
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    const game = new Game();
    await game.init();
});