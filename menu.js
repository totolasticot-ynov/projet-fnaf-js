window.addEventListener("DOMContentLoaded", () => {
    const btnCredits = document.getElementById("Credits");
    const creditsModal = document.getElementById("credits-modal");
    const closeBtn = document.getElementById("close-credits");

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
});

