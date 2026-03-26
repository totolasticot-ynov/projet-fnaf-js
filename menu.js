window.addEventListener("DOMContentLoaded", () => {
    const VOLUME_KEY = "gameVolume";
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

        optionsModal.addEventListener("click", (event) => {
            if (event.target === optionsModal) {
                optionsModal.classList.remove("modal-active");
                optionsModal.classList.add("hidden");
            }
        });
    }

    if (!btnCredits || !creditsModal || !closeBtn) {
        console.warn("Credits modal elements not found: check IDs Credits, credits-modal, close-credits.");
        return;
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

    creditsModal.addEventListener("click", (event) => {
        if (event.target === creditsModal) {
            closeCredits();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !creditsModal.classList.contains("hidden")) {
            closeCredits();
        }
    });

    // Gestionnaire pour le bouton Quitter
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
});
