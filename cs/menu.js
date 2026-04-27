import { ShowWinScreen, startGameTimer, stopGameTimer } from "./time.js";
import { playGameOverSequence } from "./gameover.js";
import { createNightLabel, readNight, startSpringtrapBehavior } from "./enemy.js";
import { createDangerDisplay } from "./danger.js";
import { initDoorControls } from "./doors.js";
import { initLightControls } from "./light.js";
import { createBatteryDisplay } from "./battery.js";
import {
    INTRO_NIGHT_1_PATH,
    INTRO_NIGHT_2_PATH,
    NIGHT_KEY,
    consumeNight2ButtonFlag,
    prepareNightForMenuLoad
} from "./nights.js";

window.addEventListener("DOMContentLoaded", () => {
    const VOLUME_KEY = "gameVolume";
    const btnPlay = document.getElementById("Jouer");
    const menuButtons = document.getElementById("menu-buttons");
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

    const shouldShowNight2Button = prepareNightForMenuLoad();

    const launchGameScene = (menuStage) => {
        const currentNight = readNight();
        stopGameTimer();
        menuStage.innerHTML = "";
        menuStage.style.display = "flex";
        menuStage.style.justifyContent = "center";
        menuStage.style.alignItems = "center";
        menuStage.style.backgroundColor = "#000";

        const dangerDisplay = createDangerDisplay(menuStage);
        menuStage.appendChild(createNightLabel(currentNight));

        const doorControls = initDoorControls(menuStage);
        const lightControls = initLightControls(menuStage);
        const batteryDisplay = createBatteryDisplay(menuStage, 6 * 60);

        let hasEnded = false;
        const triggerGameOver = async () => {
            if (hasEnded) {
                return;
            }

            hasEnded = true;
            stopEnemyBehavior();
            dangerDisplay.destroy();
            doorControls.destroy();
            lightControls.destroy();
            batteryDisplay.destroy();
            stopGameTimer();
            await playGameOverSequence(menuStage, readVolume());
        };

        const stopEnemyBehavior = startSpringtrapBehavior(currentNight, doorControls, lightControls, dangerDisplay, triggerGameOver);

        const handleWin = () => {
            if (hasEnded) {
                return;
            }

            hasEnded = true;
            stopEnemyBehavior();
            dangerDisplay.destroy();
            doorControls.destroy();
            lightControls.destroy();
            batteryDisplay.destroy();
            ShowWinScreen(menuStage);
        };

        const skipTimerButton = document.createElement("button");
        skipTimerButton.id = "skip-timer-btn";
        skipTimerButton.textContent = "Finir timer";
        skipTimerButton.addEventListener("click", () => {
            handleWin();
        });

        menuStage.appendChild(skipTimerButton);

        const jumpscareButton = document.createElement("button");
        jumpscareButton.id = "jumpscare-btn";
        jumpscareButton.textContent = "Jumpscare";
        jumpscareButton.addEventListener("click", async () => {
            await triggerGameOver();
        });

        menuStage.appendChild(jumpscareButton);
        startGameTimer(menuStage, 6 * 60, handleWin);
    };

    const playNightIntroThenLaunch = async (menuStage, introPath, forcedNight = null) => {
        stopGameTimer();
        menuStage.innerHTML = "";
        menuStage.style.display = "flex";
        menuStage.style.justifyContent = "center";
        menuStage.style.alignItems = "center";
        menuStage.style.backgroundColor = "#000";

        if (typeof forcedNight === "number") {
            localStorage.setItem(NIGHT_KEY, String(forcedNight));
        }

        const introVideo = document.createElement("video");
        introVideo.src = introPath;
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

            await playNightIntroThenLaunch(menuStage, INTRO_NIGHT_1_PATH, 1);
        });
    }

    if (shouldShowNight2Button && menuButtons) {
        const btnNight2 = document.createElement("button");
        btnNight2.id = "Night2";
        btnNight2.textContent = "Continuer";

        btnNight2.addEventListener("click", async () => {
            const menuStage = document.getElementById("menu-stage");
            if (!menuStage) return;

            consumeNight2ButtonFlag();
            await playNightIntroThenLaunch(menuStage, INTRO_NIGHT_2_PATH, 2);
        });

        if (btnOptions && btnOptions.parentElement === menuButtons) {
            menuButtons.insertBefore(btnNight2, btnOptions);
        } else {
            menuButtons.appendChild(btnNight2);
        }
    }
});
