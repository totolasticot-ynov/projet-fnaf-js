// filepath: cs/save.js

const K = { N: 'fnaf_currentNight', C: 'fnaf_customNight', P: 'fnaf_powerUsage', D: 'fnaf_doorStates', L: 'fnaf_lastPlayed', T: 'fnaf_totalPlayTime', X: 'fnaf_nightsCompleted' };
const D = { currentNight: 1, customNight: null, powerUsage: 0, doorStates: { left: false, right: false }, lastPlayed: null, totalPlayTime: 0, nightsCompleted: [] };

export function saveGame(s) {
    try {
        localStorage.setItem(K.N, JSON.stringify(s.currentNight || 1));
        localStorage.setItem(K.C, JSON.stringify(s.customNight ?? null));
        localStorage.setItem(K.P, JSON.stringify(s.powerUsage ?? 0));
        localStorage.setItem(K.D, JSON.stringify(s.doorStates || D.doorStates));
        localStorage.setItem(K.L, JSON.stringify(Date.now()));
        localStorage.setItem(K.T, JSON.stringify(s.totalPlayTime ?? 0));
        localStorage.setItem(K.X, JSON.stringify(s.nightsCompleted || []));
        return true;
    } catch { return false; }
}

export function loadGame() {
    try {
        const n = localStorage.getItem(K.N);
        if (!n && !localStorage.getItem(K.C)) return { ...D };
        return { currentNight: n ? JSON.parse(n) : 1, customNight: JSON.parse(localStorage.getItem(K.C)), powerUsage: JSON.parse(localStorage.getItem(K.P)), doorStates: JSON.parse(localStorage.getItem(K.D)), lastPlayed: JSON.parse(localStorage.getItem(K.L)), totalPlayTime: JSON.parse(localStorage.getItem(K.T)), nightsCompleted: JSON.parse(localStorage.getItem(K.X)) };
    } catch { return { ...D }; }
}

export function saveCurrentNight(night) { try { localStorage.setItem(K.N, JSON.stringify(night)); } catch {} }

export function markNightCompleted(night) {
    try { const arr = JSON.parse(localStorage.getItem(K.X)) || []; if (!arr.includes(night)) { arr.push(night); localStorage.setItem(K.X, JSON.stringify(arr)); } } catch {}
}

export function clearSave() { try { Object.values(K).forEach(k => localStorage.removeItem(k)); return true; } catch { return false; } }
export function hasSave() { return localStorage.getItem(K.N) !== null || localStorage.getItem(K.C) !== null; }

export { K, D };