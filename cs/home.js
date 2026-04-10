import { playIntroSequence } from './intro.js';
import { playJumpscareSequence } from './jumpscare.js';
import { playEndSequence } from './end.js';

let activeGameInstance = null;

export function playEndVideoAsync(onEnded) {
    if (!activeGameInstance) {
        return Promise.resolve();
    }

    return activeGameInstance.playEndVideo(onEnded);
}

export function playJumpscareVideoAsync() {
    if (!activeGameInstance) {
        return Promise.resolve();
    }

    return activeGameInstance.playJumpscareVideo();
}

class Game {
    constructor() {
        this.videoPlayer = null;
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

    init() {
        const container = document.getElementById('game-container');
        if (!container) {
            console.error(' Conteneur introuvable');
            return Promise.resolve();
        }

        this.stage = document.getElementById('menu-stage');
        if (!this.stage) {
            console.error(' Zone de menu introuvable');
            return Promise.resolve();
        }

        return this.playIntroVideo().then(() => {
            if (typeof this.updateStageLayout === 'function') {
                window.addEventListener('resize', () => this.updateStageLayout());
                this.updateStageLayout();
            }
        });
    }

    playIntroVideo() {
        return playIntroSequence(
            this.stage,
            this.getSavedVolume(),
            (videoWidth, videoHeight) => {
                this.videoRatio = videoWidth / videoHeight;
                this.updateStageLayout();
            }
        ).then((player) => {
            this.videoPlayer = player;
        });
    }

    playEndVideo(onEnded) {
        return playEndSequence(
            this.stage,
            this.getSavedVolume(),
            (videoWidth, videoHeight) => {
                this.videoRatio = videoWidth / videoHeight;
                this.updateStageLayout();
            },
            onEnded
        ).then((player) => {
            this.videoPlayer = player;
        });
    }

    playJumpscareVideo() {
        return playJumpscareSequence(
            this.stage,
            this.getSavedVolume(),
            (videoWidth, videoHeight) => {
                this.videoRatio = videoWidth / videoHeight;
                this.updateStageLayout();
            }
        ).then((player) => {
            this.videoPlayer = player;
        });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    activeGameInstance = new Game();
    activeGameInstance.init();
});