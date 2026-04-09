import { ShowWinScreen, startGameTimer, stopGameTimer } from "./time.js";
import { playJumpscareVideoAsync } from "./home.js";

window.addEventListener("DOMContentLoaded", () => {
    const VOLUME_KEY = "gameVolume";
    const btnPlay = document.getElementById("Jouer");
    const btnOptions = document.getElementById("Options");
    const optionsModal = document.getElementById("options-modal");
    const closeOptionsBtn = document.getElementById("close-options");
    const volumeSlider = document.getElementById("volume-slider");
    const volumeDisplay = document.getElementById("volume-display");
    const btnCredits = document.getElementById("Credits");
    const creditsModal = document.getElementById("credits-modal");
    const closeBtn = document.getElementById("close-credits");
    const quitBtn = document.getElementById("Quitter");

    const clampVolume = (value) => Math.max(0, Math.min(1, value));
    const readVolume = () => {
        const stored = Number(localStorage.getItem(VOLUME_KEY));
        return Number.isNaN(stored) ? 0.5 : clampVolume(stored);
    };

    const launchGameScene = (menuStage) => {
        stopGameTimer();
        menuStage.innerHTML = "";
        menuStage.style.display = "flex";
        menuStage.style.justifyContent = "center";
        menuStage.style.alignItems = "center";
        menuStage.style.backgroundColor = "#000";

        const officeImage = document.createElement("img");
        officeImage.src = "Assets/office.png";
        officeImage.alt = "Office";
        officeImage.style.width = "100%";
        officeImage.style.height = "100%";
        officeImage.style.objectFit = "contain";
        officeImage.style.cursor = "default";
        officeImage.draggable = false;

        menuStage.appendChild(officeImage);

        const skipTimerButton = document.createElement("button");
        skipTimerButton.id = "skip-timer-btn";
        skipTimerButton.textContent = "Finir timer";
        skipTimerButton.addEventListener("click", () => {
            ShowWinScreen(menuStage);
        });

        menuStage.appendChild(skipTimerButton);

        const jumpscareButton = document.createElement("button");
        jumpscareButton.id = "jumpscare-btn";
        jumpscareButton.textContent = "Jumpscare";
        jumpscareButton.addEventListener("click", async () => {
            await playJumpscareVideoAsync();
        });

        menuStage.appendChild(jumpscareButton);
        startGameTimer(menuStage, 6 * 60, () => ShowWinScreen(menuStage));
    };

    const playGameIntroThenLaunch = async (menuStage) => {
        stopGameTimer();
        menuStage.innerHTML = "";
        menuStage.style.display = "flex";
        menuStage.style.justifyContent = "center";
        menuStage.style.alignItems = "center";
        menuStage.style.backgroundColor = "#000";

        const introVideo = document.createElement("video");
        introVideo.src = "Assets/Intro-Fnaf.mp4";
        introVideo.autoplay = true;
        introVideo.controls = false;
        introVideo.loop = false;
        introVideo.playsInline = true;
        introVideo.volume = readVolume();
        introVideo.style.width = "100%";
        introVideo.style.height = "100%";
        introVideo.style.objectFit = "contain";

        let hasLaunchedGame = false;
        const launchIfNeeded = () => {
            if (hasLaunchedGame) {
                return;
            }

            hasLaunchedGame = true;
            launchGameScene(menuStage);
        };

        introVideo.addEventListener("ended", launchIfNeeded, { once: true });
        menuStage.appendChild(introVideo);

        try {
            await introVideo.play();
        } catch {
            menuStage.addEventListener("click", () => {
                introVideo.play().catch(() => {});
            }, { once: true });
        }
    };
    const applyVolumeToMenuVideo = (volume) => {
        const menuVideo = document.querySelector("#menu-stage video");
        if (menuVideo) {
            menuVideo.volume = volume;
        }
    };

    if (volumeSlider && volumeDisplay) {
        const initialVolume = Math.round(readVolume() * 100);
        volumeSlider.value = String(initialVolume);
        volumeDisplay.textContent = `${initialVolume}%`;
        applyVolumeToMenuVideo(initialVolume / 100);

        volumeSlider.addEventListener("input", () => {
            const volumePercent = Number(volumeSlider.value);
            const volume = clampVolume(volumePercent / 100);
            localStorage.setItem(VOLUME_KEY, String(volume));
            volumeDisplay.textContent = `${volumePercent}%`;
            applyVolumeToMenuVideo(volume);
        });
    }

    if (btnOptions) {
        btnOptions.addEventListener("click", () => {
            if (!optionsModal) return;
            optionsModal.classList.remove("hidden");
            optionsModal.classList.add("modal-active");
        });
    }

    if (closeOptionsBtn && optionsModal) {
        closeOptionsBtn.addEventListener("click", () => {
            optionsModal.classList.remove("modal-active");
            optionsModal.classList.add("hidden");
        });

    }

    const openCredits = () => {
        creditsModal.classList.remove("hidden");
        creditsModal.classList.add("modal-active");
    };

    const closeCredits = () => {
        creditsModal.classList.remove("modal-active");
        creditsModal.classList.add("hidden");
    };

    btnCredits.addEventListener("click", openCredits);
    closeBtn.addEventListener("click", closeCredits);


    if (quitBtn) {
        quitBtn.addEventListener("click", () => {
            if (window.opener || window.history.length <= 1) {
                window.close();
            } else {
                setTimeout(() => {
                    if (!window.closed) {
                        window.location.replace("about:blank");
                    }
                }, 50);
            }
        });
    }

    if (btnPlay) {
        btnPlay.addEventListener("click", async () => {
            const menuStage = document.getElementById("menu-stage");
            if (!menuStage) return;

            await playGameIntroThenLaunch(menuStage);
        });
    }
});
