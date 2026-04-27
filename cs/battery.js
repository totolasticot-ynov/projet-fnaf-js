// Retourne une couleur en fonction du pourcentage de batterie.
function getBatteryColor(percent) {
    if (percent > 60) return "#4ade80"; // batterie haute
    if (percent > 30) return "#facc15"; // batterie moyenne
    return "#f87171"; // batterie faible
}

// Crée et affiche la batterie sur l'interface.
// `stage` est l'élément parent dans lequel le statut de batterie est ajouté.
// `totalDurationSeconds` définit la durée de vie totale de la batterie en secondes.
// `currentNight` augmente la vitesse de décharge à chaque nuit.
export function createBatteryDisplay(stage, totalDurationSeconds = 360, currentNight = 1) {
    const duration = Math.max(1, Math.floor(totalDurationSeconds));
    const nightFactor = 1 + Math.max(0, currentNight - 1) * 0.25;
    const doorUsageCost = 2;
    const lightUsageCost = 1;

    // Conteneur de la batterie
    const batteryContainer = document.createElement("div");
    Object.assign(batteryContainer.style, {
        position: "absolute",
        top: "18px",
        left: "18px",
        zIndex: "100",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px 14px",
        borderRadius: "14px",
        border: "2px solid rgba(255,255,255,0.85)",
        background: "rgba(0, 0, 0, 0.55)",
        color: "#fff",
        fontFamily: "Arial, sans-serif",
        fontSize: "16px",
        minWidth: "130px",
        pointerEvents: "none"
    });

    // Texte qui affiche le pourcentage de batterie
    const textLabel = document.createElement("span");

    // Barre de fond
    const bar = document.createElement("div");
    Object.assign(bar.style, {
        flex: "1",
        height: "10px",
        borderRadius: "999px",
        background: "rgba(255,255,255,0.15)",
        overflow: "hidden"
    });

    // Remplissage de la barre de batterie
    const fill = document.createElement("div");
    Object.assign(fill.style, {
        width: "100%",
        height: "100%",
        borderRadius: "999px",
        background: getBatteryColor(100),
        transition: "width 0.4s ease, background-color 0.4s ease"
    });

    bar.appendChild(fill);
    batteryContainer.append(textLabel, bar);
    stage.appendChild(batteryContainer);

    let remainingSeconds = duration;
    let usageState = {
        doors: 0,
        lights: 0
    };
    let onEmptyCallback = () => {};

    const getConsumption = () => {
        return (usageState.doors * doorUsageCost + usageState.lights * lightUsageCost) * nightFactor;
    };

    const updateBattery = () => {
        const percent = Math.ceil((remainingSeconds / duration) * 100);
        const safePercent = Math.max(0, Math.min(100, percent));
        textLabel.textContent = `${safePercent}%`;
        fill.style.width = `${safePercent}%`;
        fill.style.background = getBatteryColor(safePercent);
    };

    const drainInterval = setInterval(() => {
        const consumption = getConsumption();
        if (consumption <= 0) {
            return;
        }

        remainingSeconds -= consumption;
        if (remainingSeconds <= 0) {
            remainingSeconds = 0;
            updateBattery();
            clearInterval(drainInterval);
            onEmptyCallback();
            return;
        }

        updateBattery();
    }, 1000);

    updateBattery();

    return {
        // Met à jour la consommation de la batterie selon l'utilisation.
        setUsage(usage) {
            usageState.doors = Math.max(0, Math.floor(usage.doors || 0));
            usageState.lights = Math.max(0, Math.floor(usage.lights || 0));
        },
        // Permet de réagir à une batterie vide.
        onEmpty(callback) {
            if (typeof callback === "function") {
                onEmptyCallback = callback;
            }
        },
        // Supprime l'intervalle et retire l'élément du DOM.
        destroy: () => {
            clearInterval(drainInterval);
            batteryContainer.remove();
        }
    };
}
