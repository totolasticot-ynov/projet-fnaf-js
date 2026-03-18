export class VideoPlayer {
    constructor(videoPath) {
        this.videoPath = videoPath;
        this.videoElement = null;
        this.isPlaying = false;
    }

    createVideoElement() {
        this.videoElement = document.createElement('video');
        this.videoElement.src = this.videoPath;
        this.videoElement.controls = false;
        this.videoElement.volume = 1.0;
        this.videoElement.autoplay = true;
        this.videoElement.playsInline = true;
        
        Object.assign(this.videoElement.style, {
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block'
        });

        return this.videoElement;
    }

    async play() {
        try {
            await this.videoElement.play();
            this.isPlaying = true;
            console.log('Lecture vidéo démarrée avec le son');
        } catch (error) {
            console.warn('Autoplay bloqué:', error.message);
            console.log(' Cliquez sur l\'écran pour lancer la vidéo');
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
