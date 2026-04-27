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

    async play() {
        try {
            await this.videoElement.play();
            this.isPlaying = true;
        } catch (error) {
            this.isPlaying = false;
            
            document.addEventListener('click', async () => {
                await this.videoElement.play();
            }, { once: true });
        }
    }

    setLoop(shouldLoop = true) {
        if (this.videoElement) {
            this.videoElement.loop = shouldLoop;
        }
    }

    setVolume(volume) {
        if (this.videoElement) {
            this.videoElement.volume = Math.max(0, Math.min(1, volume));
        }
    }

    on(eventName, callback) {
        if (this.videoElement) {
            this.videoElement.addEventListener(eventName, callback);
        }
    }
}