export const NIGHT_KEY = "currentNight";
export const MAX_NIGHT = 3;
export const NEXT_NIGHT_READY_KEY = "nextNightReady";
export const INTRO_NIGHT_1_PATH = "Assets/video/Intro-Fnaf-Night1.mp4";
export const INTRO_NIGHT_2_PATH = "Assets/video/Intro-Fnaf-NIght2.mp4";

function clampNight(night) {
	return Math.max(1, Math.min(MAX_NIGHT, Math.floor(night)));
}

export function readStoredNight() {
	const currentNight = Number(localStorage.getItem(NIGHT_KEY));
	if (Number.isNaN(currentNight)) {
		return 1;
	}

	return clampNight(currentNight);
}

export function prepareNightForMenuLoad() {
	const shouldShowNight2Button = localStorage.getItem(NEXT_NIGHT_READY_KEY) === "1";
	if (shouldShowNight2Button) {
		localStorage.setItem(NIGHT_KEY, "2");
	} else {
		localStorage.setItem(NIGHT_KEY, "1");
	}

	return shouldShowNight2Button;
}

export function consumeNight2ButtonFlag() {
	localStorage.removeItem(NEXT_NIGHT_READY_KEY);
}

export function setNightAfterWin() {
	const currentNight = readStoredNight();
	const nextNight = Math.min(MAX_NIGHT, currentNight + 1);
	const shouldShowNight2Button = currentNight === 1 && nextNight === 2;

	localStorage.setItem(NIGHT_KEY, String(nextNight));

	if (shouldShowNight2Button) {
		localStorage.setItem(NEXT_NIGHT_READY_KEY, "1");
	} else {
		localStorage.removeItem(NEXT_NIGHT_READY_KEY);
	}

	return { currentNight, nextNight, shouldShowNight2Button };
}
