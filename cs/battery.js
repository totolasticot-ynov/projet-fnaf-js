const BATTERY_ICON = "🔋";
const BATTERY_WARNING_ICON = "⚠️";

function getBatteryColor(percent) {
    if (percent > 60) return "#4ade80";
    if (percent > 30) return "#facc15";
    return "#f87171";
}

function getBatteryLabel(percent) {
    return percent <= 15 ? `${BATTERY_WARNING_ICON} ${percent}%` : `${BATTERY_ICON} ${percent}%`;
}

export function createBatteryDisplay(stage, totalDurationSeconds = 360) {
    const batteryContainer = document.createElement("div");
    batteryContainer.id = "battery-status";
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

    const emojiLabel = document.createElement("span");
    emojiLabel.textContent = BATTERY_ICON;
    emojiLabel.style.fontSize = "20px";

    const textLabel = document.createElement("span");
    textLabel.textContent = getBatteryLabel(100);

    const bar = document.createElement("div");
    Object.assign(bar.style, {
        flex: "1",
        height: "10px",
        borderRadius: "999px",
        background: "rgba(255,255,255,0.15)",
        overflow: "hidden"
    });

    const fill = document.createElement("div");
    Object.assign(fill.style, {
        width: "100%",
        height: "100%",
        borderRadius: "999px",
        background: getBatteryColor(100),
        transition: "width 0.4s ease, background-color 0.4s ease"
    });

    bar.appendChild(fill);
    batteryContainer.append(emojiLabel, textLabel, bar);
    stage.appendChild(batteryContainer);

    let remainingSeconds = Math.max(0, Math.floor(totalDurationSeconds));
    let drainInterval = null;

    const updateBattery = () => {
        const percent = Math.ceil((remainingSeconds / totalDurationSeconds) * 100);
        const safePercent = Math.max(0, Math.min(100, percent));
        textLabel.textContent = getBatteryLabel(safePercent);
        fill.style.width = `${safePercent}%`;
        fill.style.background = getBatteryColor(safePercent);
        if (safePercent <= 15) {
            emojiLabel.textContent = BATTERY_WARNING_ICON;
        } else {
            emojiLabel.textContent = BATTERY_ICON;
        }
    };

    const startDrain = () => {
        if (drainInterval !== null) {
            return;
        }

        drainInterval = setInterval(() => {
            remainingSeconds -= 1;
            if (remainingSeconds <= 0) {
                remainingSeconds = 0;
                updateBattery();
                clearInterval(drainInterval);
                drainInterval = null;
                return;
            }
            updateBattery();
        }, 1000);
    };

    updateBattery();
    startDrain();

    return {
        destroy: () => {
            if (drainInterval !== null) {
                clearInterval(drainInterval);
                drainInterval = null;
            }
            batteryContainer.remove();
        }
    };
}
