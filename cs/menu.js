import { ShowWinScreen, startGameTimer, stopGameTimer } from "./time.js";
import { playGameOverSequence } from "./gameover.js";
import { createNightLabel, readNight, startSpringtrapBehavior } from "./enemy.js";
import { createDangerDisplay } from "./danger.js";
import { initDoorControls } from "./doors.js";
import { initLightControls } from "./light.js";
import { createBatteryDisplay } from "./battery.js";
import { INTRO_NIGHT_1_PATH, INTRO_NIGHT_2_PATH, NIGHT_KEY, consumeNight2ButtonFlag, prepareNightForMenuLoad } from "./nights.js";

const VOLUME_KEY = "gameVolume";
const clampVolume = (v) => Math.max(0, Math.min(1, v));
const readVolume = () => {
    const s = Number(localStorage.getItem(VOLUME_KEY));
    return Number.isNaN(s) ? 0.5 : clampVolume(s);
};

window.addEventListener("DOMContentLoaded", () => {
    const [btnPlay, menuButtons, btnOptions, optionsModal, closeOptionsBtn, volumeSlider, volumeDisplay, btnCredits, creditsModal, closeBtn, quitBtn] = [
        "Jouer", "menu-buttons", "Options", "options-modal", "close-options", "volume-slider", "volume-display", "Credits", "credits-modal", "close-credits", "Quitter"
    ].map(id => document.getElementById(id));

    const launchGameScene = (stage) => {
        const night = readNight();
        stopGameTimer();
        stage.innerHTML = "";
        stage.style.display = "flex";
        stage.style.justifyContent = "center";
        stage.style.alignItems = "center";
        stage.style.backgroundColor = "#000";

        const danger = createDangerDisplay(stage);
        const doors = initDoorControls(stage);
        const lights = initLightControls(stage);
        const battery = createBatteryDisplay(stage, 360, night);
        stage.appendChild(createNightLabel(night));

        let hasEnded = false;
        const triggerEnd = async (isWin) => {
            if (hasEnded) return;
            hasEnded = true;
            danger.destroy();
            doors.destroy();
            lights.destroy();
            battery.destroy();
            doors.unsubscribe?.();
            lights.unsubscribe?.();
            stopGameTimer();
            if (!isWin) await playGameOverSequence(stage, readVolume());
            else ShowWinScreen(stage);
        };

        const updateUsage = () => {
            battery.setUsage({
                doors: (doors.isDoorClosed("left") ? 1 : 0) + (doors.isDoorClosed("right") ? 1 : 0),
                lights: (lights.isLightOn("left") ? 1 : 0) + (lights.isLightOn("right") ? 1 : 0)
            });
        };

        const updateDoor = () => {
            if (doors.isDoorClosed("right")) danger.setDoor("right");
            else if (doors.isDoorClosed("left")) danger.setDoor("left");
            else danger.setOffice();
        };

        doors.unsubscribe = doors.onChange(() => { updateUsage(); updateDoor(); });
        lights.onChange(updateUsage);
        updateUsage();

        startSpringtrapBehavior(night, doors, lights, danger, () => triggerEnd(false));
        battery.onEmpty(() => { doors.openAll(); lights.turnOffAll(); doors.setDisabled(true); lights.setDisabled(true); triggerEnd(false); });

        const skip = document.createElement("button");
        skip.id = "skip-timer-btn";
        skip.textContent = "Finir timer";
        skip.onclick = () => triggerEnd(true);
        stage.appendChild(skip);

        const jumpscare = document.createElement("button");
        jumpscare.id = "jumpscare-btn";
        jumpscare.textContent = "Jumpscare";
        jumpscare.onclick = () => triggerEnd(false);
        stage.appendChild(jumpscare);

        startGameTimer(stage, 360, () => triggerEnd(true));
    };

    const playNightIntro = async (stage, path, night = null) => {
        stopGameTimer();
        stage.innerHTML = "";
        stage.style.cssText = "display: flex; justify-content: center; align-items: center; background-color: #000;";
        if (night !== null) localStorage.setItem(NIGHT_KEY, String(night));

        const video = document.createElement("video");
        video.src = path;
        video.autoplay = true;
        video.volume = readVolume();
        video.style.cssText = "width: 100%; height: 100%; object-fit: contain;";

        let launched = false;
        const onEnd = () => {
            if (!launched) { launched = true; launchGameScene(stage); }
        };

        video.addEventListener("ended", onEnd, { once: true });
        stage.addEventListener("click", () => video.play().catch(() => {}), { once: true });
        stage.appendChild(video);
        video.play().catch(() => {});
    };

    const shouldShowNight2 = prepareNightForMenuLoad();

    if (volumeSlider && volumeDisplay) {
        const vol = Math.round(readVolume() * 100);
        volumeSlider.value = String(vol);
        volumeDisplay.textContent = `${vol}%`;
        const updateVol = () => {
            const v = Math.round(Number(volumeSlider.value));
            localStorage.setItem(VOLUME_KEY, String(v / 100));
            volumeDisplay.textContent = `${v}%`;
            const video = document.querySelector("#menu-stage video");
            if (video) video.volume = v / 100;
        };
        volumeSlider.addEventListener("input", updateVol);
    }

    const toggleModal = (modal, show) => {
        if (!modal) return;
        modal.classList.toggle("hidden", !show);
        modal.classList.toggle("modal-active", show);
    };

    if (btnOptions) btnOptions.onclick = () => toggleModal(optionsModal, true);
    if (closeOptionsBtn) closeOptionsBtn.onclick = () => toggleModal(optionsModal, false);
    if (btnCredits) btnCredits.onclick = () => toggleModal(creditsModal, true);
    if (closeBtn) closeBtn.onclick = () => toggleModal(creditsModal, false);

    if (quitBtn) {
        quitBtn.onclick = () => {
            if (window.opener || window.history.length <= 1) window.close();
            else setTimeout(() => !window.closed && window.location.replace("about:blank"), 50);
        };
    }

    if (btnPlay) {
        btnPlay.onclick = async () => {
            const stage = document.getElementById("menu-stage");
            if (stage) await playNightIntro(stage, INTRO_NIGHT_1_PATH, 1);
        };
    }

    if (shouldShowNight2 && menuButtons) {
        const btn = document.createElement("button");
        btn.id = "Night2";
        btn.textContent = "Continuer";
        btn.onclick = async () => {
            const stage = document.getElementById("menu-stage");
            if (stage) { consumeNight2ButtonFlag(); await playNightIntro(stage, INTRO_NIGHT_2_PATH, 2); }
        };
        btnOptions?.parentElement === menuButtons ? menuButtons.insertBefore(btn, btnOptions) : menuButtons.appendChild(btn);
    }
});
