import { playIntroSequence } from './intro.js';
import { playJumpscareSequence } from './jumpscare.js';
import { playEndSequence } from './end.js';

let activeGameInstance = null;

// Joue la vidéo de fin de partie de manière asynchrone si une instance de jeu est active.
export function playEndVideoAsync(onEnded) {
    if (!activeGameInstance) {
        return Promise.resolve();
    }

    return activeGameInstance.playEndVideo(onEnded);
}

// Joue la vidéo de jumpscare de manière asynchrone si une instance de jeu est active.
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

    // Lit le volume sauvegardé dans le localStorage.
    getSavedVolume() {
        const stored = Number(localStorage.getItem('gameVolume'));
        if (Number.isNaN(stored)) {
            return 0.5;
        }

        return Math.max(0, Math.min(1, stored));
    }

    // Initialise le jeu en lançant la vidéo d'introduction.
    init() {
        return this.playIntroVideo().then(() => {
            if (typeof this.updateStageLayout === 'function') {
                window.addEventListener('resize', () => this.updateStageLayout());
                this.updateStageLayout();
            }
        });
    }

    // Joue l'introduction et met à jour le ratio vidéo pour la mise en page.
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

    // Joue la séquence de fin et appelle la fonction de fin une fois terminée.
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

    // Joue le jumpscare et met à jour la taille du stage si nécessaire.
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

// Crée l'instance de jeu et initialise le player lorsque le DOM est prêt.
window.addEventListener('DOMContentLoaded', () => {
    activeGameInstance = new Game();
    activeGameInstance.init();
});