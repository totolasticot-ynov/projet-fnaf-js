const SAVE_KEY = "fnafSave";
const SAVE_HISTORY_KEY = "fnafSaveHistory";
const MAX_HISTORY = 20;

function safeParseJson(rawValue, fallbackValue) {
    if (!rawValue) {
        return fallbackValue;
    }

    try {
        return JSON.parse(rawValue);
    } catch {
        return fallbackValue;
    }
}

function readHistory() {
    const history = safeParseJson(localStorage.getItem(SAVE_HISTORY_KEY), []);
    return Array.isArray(history) ? history : [];
}

function readCurrentNight() {
    const night = Number(localStorage.getItem("currentNight"));
    if (Number.isNaN(night)) {
        return 1;
    }

    return Math.max(1, Math.floor(night));
}

export function saveGameResult(result, extraData = {}) {
    const now = new Date();
    const payload = {
        id: ${now.getTime()}-${Math.random().toString(16).slice(2)},
        result,
        night: readCurrentNight(),
        volume: Number(localStorage.getItem("gameVolume")),
        timestamp: now.toISOString(),
        ...extraData
    };

    localStorage.setItem(SAVE_KEY, JSON.stringify(payload));

    const nextHistory = [payload, ...readHistory()].slice(0, MAX_HISTORY);
    localStorage.setItem(SAVE_HISTORY_KEY, JSON.stringify(nextHistory));

    return payload;
}

export function readLastSave() {
    return safeParseJson(localStorage.getItem(SAVE_KEY), null);
}

export function readSaveHistory() {
    return readHistory();
}