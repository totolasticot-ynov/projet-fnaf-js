// Petit wrapper pour créer et contrôler une vidéo via JavaScript.
export class VideoPlayer {
    constructor(videoPath) {
        this.videoPath = videoPath;
        this.videoElement = null;
        this.isPlaying = false;
    }

    // Crée l'élément vidéo et applique le style par défaut.
    createVideoElement() {
        this.videoElement = document.createElement('video');
        this.videoElement.src = this.videoPath;
        this.videoElement.controls = false;
        this.videoElement.volume = 1.0;
        this.videoElement.muted = false;
        this.videoElement.autoplay = true;
        this.videoElement.loop = true;
        this.videoElement.playsInline = true;
        
        Object.assign(this.videoElement.style, {
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block',
            pointerEvents: 'none'
        });

        return this.videoElement;
    }

    // Tente de lancer la vidéo et gère l'échec d'autoplay si nécessaire.
    async play() {
        try {
            await this.videoElement.play();
            this.isPlaying = true;
        } catch (error) {
            this.isPlaying = false;
            
            // Si l'autoplay est bloqué, retenter la lecture après un clic de l'utilisateur.
            document.addEventListener('click', async () => {
                await this.videoElement.play();
            }, { once: true });
        }
    }

    // Active ou désactive la boucle de lecture.
    setLoop(shouldLoop = true) {
        if (this.videoElement) {
            this.videoElement.loop = shouldLoop;
        }
    }

    // Définit le volume de la vidéo entre 0 et 1.
    setVolume(volume) {
        if (this.videoElement) {
            this.videoElement.volume = Math.max(0, Math.min(1, volume));
        }
    }

    // Ajoute un écouteur sur l'élément vidéo.
    on(eventName, callback) {
        if (this.videoElement) {
            this.videoElement.addEventListener(eventName, callback);
        }
    }
}