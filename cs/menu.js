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

const VOLUME_KEY = "gameVolume";
const clampVolume = (value) => Math.max(0, Math.min(1, value));
const readVolume = () => {
    const stored = Number(localStorage.getItem(VOLUME_KEY));
    return Number.isNaN(stored) ? 0.5 : clampVolume(stored);
};
const setMenuStage = (menuStage) => {
    menuStage.innerHTML = "";
    Object.assign(menuStage.style, {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000"
    });
};
const createButton = (id, label, handler) => {
    const button = document.createElement("button");
    button.id = id;
    button.textContent = label;
    button.addEventListener("click", handler);
    return button;
};
const toggleModal = (modal, visible) => {
    if (!modal) return;
    modal.classList.toggle("hidden", !visible);
    modal.classList.toggle("modal-active", visible);
};
const applyVolumeToMenuVideo = (volume) => {
    document.querySelector("#menu-stage video")?.volume = volume;
};

const launchGameScene = (menuStage) => {
    const currentNight = readNight();
    stopGameTimer();
    setMenuStage(menuStage);

    const dangerDisplay = createDangerDisplay(menuStage);
    menuStage.appendChild(createNightLabel(currentNight));

    const doorControls = initDoorControls(menuStage);
    const lightControls = initLightControls(menuStage);
    const batteryDisplay = createBatteryDisplay(menuStage, 6 * 60);

    let hasEnded = false;
    let stopEnemyBehavior = null;
    const cleanup = () => {
        dangerDisplay.destroy();
        doorControls.destroy();
        lightControls.destroy();
        batteryDisplay.destroy();
        stopGameTimer();
    };

    const triggerGameOver = async () => {
        if (hasEnded) return;
        hasEnded = true;
        stopEnemyBehavior?.();
        cleanup();
        await playGameOverSequence(menuStage, readVolume());
    };

    const handleWin = () => {
        if (hasEnded) return;
        hasEnded = true;
        stopEnemyBehavior?.();
        cleanup();
        ShowWinScreen(menuStage);
    };

    stopEnemyBehavior = startSpringtrapBehavior(currentNight, doorControls, lightControls, dangerDisplay, triggerGameOver);
    menuStage.append(createButton("skip-timer-btn", "Finir timer", handleWin));
    menuStage.append(createButton("jumpscare-btn", "Jumpscare", async () => await triggerGameOver()));
    startGameTimer(menuStage, 6 * 60, handleWin);
};

const playNightIntroThenLaunch = async (menuStage, introPath, forcedNight = null) => {
    stopGameTimer();
    setMenuStage(menuStage);
    if (typeof forcedNight === "number") localStorage.setItem(NIGHT_KEY, String(forcedNight));

    const introVideo = document.createElement("video");
    Object.assign(introVideo, {
        src: introPath,
        autoplay: true,
        controls: false,
        loop: false,
        playsInline: true,
        volume: readVolume()
    });
    Object.assign(introVideo.style, {
        width: "100%",
        height: "100%",
        objectFit: "contain"
    });

    let hasLaunchedGame = false;
    introVideo.addEventListener("ended", () => {
        if (!hasLaunchedGame) {
            hasLaunchedGame = true;
            launchGameScene(menuStage);
        }
    }, { once: true });

    menuStage.appendChild(introVideo);
    try {
        await introVideo.play();
    } catch {
        menuStage.addEventListener("click", () => introVideo.play().catch(() => {}), { once: true });
    }
};

window.addEventListener("DOMContentLoaded", () => {
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

    const shouldShowNight2Button = prepareNightForMenuLoad();

    if (volumeSlider && volumeDisplay) {
        const initialVolume = Math.round(readVolume() * 100);
        volumeSlider.value = String(initialVolume);
        volumeDisplay.textContent = `${initialVolume}%`;
        applyVolumeToMenuVideo(initialVolume / 100);
        volumeSlider.addEventListener("input", () => {
            const volume = clampVolume(Number(volumeSlider.value) / 100);
            localStorage.setItem(VOLUME_KEY, String(volume));
            volumeDisplay.textContent = `${Math.round(volume * 100)}%`;
            applyVolumeToMenuVideo(volume);
        });
    }

    btnOptions?.addEventListener("click", () => toggleModal(optionsModal, true));
    closeOptionsBtn?.addEventListener("click", () => toggleModal(optionsModal, false));
    btnCredits?.addEventListener("click", () => toggleModal(creditsModal, true));
    closeBtn?.addEventListener("click", () => toggleModal(creditsModal, false));

    quitBtn?.addEventListener("click", () => {
        if (window.opener || window.history.length <= 1) {
            window.close();
        } else {
            setTimeout(() => {
                if (!window.closed) window.location.replace("about:blank");
            }, 50);
        }
    });

    btnPlay?.addEventListener("click", async () => {
        const menuStage = document.getElementById("menu-stage");
        if (menuStage) await playNightIntroThenLaunch(menuStage, INTRO_NIGHT_1_PATH, 1);
    });

    if (shouldShowNight2Button && menuButtons) {
        const btnNight2 = createButton("Night2", "Continuer", async () => {
            const menuStage = document.getElementById("menu-stage");
            if (!menuStage) return;
            consumeNight2ButtonFlag();
            await playNightIntroThenLaunch(menuStage, INTRO_NIGHT_2_PATH, 2);
        });
        menuButtons.insertBefore(btnNight2, btnOptions?.parentElement === menuButtons ? btnOptions : null);
    }
});
