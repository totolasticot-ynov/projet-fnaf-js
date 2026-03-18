import { VideoPlayer } from './VideoPlayer.js';

class Game {
    constructor() {
        this.videoPlayer = null;
        this.container = null;
        this.stage = null;
        this.videoRatio = 16 / 9;
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

        videoElement.addEventListener('loadedmetadata', () => {
            if (videoElement.videoWidth && videoElement.videoHeight) {
                this.videoRatio = videoElement.videoWidth / videoElement.videoHeight;
                this.updateStageLayout();
            }
        });

        this.stage.prepend(videoElement);

        await this.videoPlayer.play();
    }

    updateStageLayout() {
        if (!this.container || !this.stage) {
            return;
        }

        const containerWidth = this.container.clientWidth;
        const containerHeight = this.container.clientHeight;

        let stageWidth = containerWidth;
        let stageHeight = stageWidth / this.videoRatio;

        if (stageHeight > containerHeight) {
            stageHeight = containerHeight;
            stageWidth = stageHeight * this.videoRatio;
        }

        this.stage.style.width = `${stageWidth}px`;
        this.stage.style.height = `${stageHeight}px`;

        const uiScale = stageWidth / 1920;
        this.stage.style.setProperty('--ui-scale', String(uiScale));
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    const game = new Game();
    await game.init();
});
