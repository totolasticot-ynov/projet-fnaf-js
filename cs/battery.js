function getBatteryColor(percent) {
    if (percent > 60) return "#4ade80";
    if (percent > 30) return "#facc15";
    return "#f87171";
}

export function createBatteryDisplay(stage, totalDurationSeconds = 360) {
    const duration = Math.max(1, Math.floor(totalDurationSeconds));
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

    const textLabel = document.createElement("span");
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
    batteryContainer.append(textLabel, bar);
    stage.appendChild(batteryContainer);

    let remainingSeconds = duration;
    const updateBattery = () => {
        const percent = Math.ceil((remainingSeconds / duration) * 100);
        const safePercent = Math.max(0, Math.min(100, percent));
        textLabel.textContent = `${safePercent}%`;
        fill.style.width = `${safePercent}%`;
        fill.style.background = getBatteryColor(safePercent);
    };

    const drainInterval = setInterval(() => {
        remainingSeconds -= 1;
        if (remainingSeconds <= 0) {
            remainingSeconds = 0;
            updateBattery();
            clearInterval(drainInterval);
            return;
        }
        updateBattery();
    }, 1000);

    updateBattery();

    return {
        destroy: () => {
            clearInterval(drainInterval);
            batteryContainer.remove();
        }
    };
}
