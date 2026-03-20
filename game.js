import { VideoPlayer } from './VideoPlayer.js';

class Game {
    constructor() {
        // Moi, Mooi, je prépare les variables pour la gestion du jeu et de l'UI
        this.videoPlayer = null; // gestion de la vidéo d'intro
        this.container = null; // conteneur global du jeu
        this.stage = null; // zone du menu
        this.optionsPanel = null; // panneau d'options (volume...)
        this.volumeSlider = null; // slider de volume
        this.volumeValue = null; // affichage du pourcentage
        this.videoRatio = 16 / 9; // ratio vidéo par défaut
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

        this.optionsPanel = document.getElementById('options-panel');
        this.volumeSlider = document.getElementById('volume-slider');
        this.volumeValue = document.getElementById('volume-value');

        this.setupUIEvents();

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

    setupUIEvents() {
        // J'associe les boutons et le slider à leur action
        const optionsButton = document.getElementById('Options');
        const closeOptionsButton = document.getElementById('close-options');

        if (optionsButton) {
            // quand on ouvre le panneau options
            optionsButton.addEventListener('click', () => this.showOptions());
        }

        if (closeOptionsButton) {
            // quand on ferme le panneau option
            closeOptionsButton.addEventListener('click', () => this.hideOptions());
        }

        if (this.volumeSlider && this.volumeValue) {
            // dès que je bouge le slider, j'ajuste le son de la vidéo (0.0-1.0) et un texte 0-100
            this.volumeSlider.addEventListener('input', (event) => {
                const volume = Number(event.target.value);
                this.volumeValue.textContent = String(volume);
                this.setVolume(volume / 100);
            });

            // Valeur initiale du volume à l'ouverture
            const initialVolume = Number(this.volumeSlider.value);
            this.volumeValue.textContent = String(initialVolume);
            this.setVolume(initialVolume / 100); // par sécurité on applique directement
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