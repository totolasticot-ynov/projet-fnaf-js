import { playEndVideoAsync } from "./home.js";

const DEFAULT_TIMER_SECONDS = 6 * 60;

let activeIntervalId = null;
let activeTimerElement = null;

function formatNightHour(remainingSeconds, totalDurationSeconds) {
	const safeRemaining = Math.max(0, remainingSeconds);
	const safeDuration = Math.max(1, totalDurationSeconds);
	const elapsedSeconds = safeDuration - safeRemaining;
	const secondsPerHour = safeDuration / 6;
	const hourStep = Math.min(6, Math.floor(elapsedSeconds / secondsPerHour));

	if (hourStep === 0) {
		return "12 PM";
	}

	return `${hourStep} AM`;
}

export function stopGameTimer() {
	if (activeIntervalId !== null) {
		clearInterval(activeIntervalId);
		activeIntervalId = null;
	}

	if (activeTimerElement) {
		activeTimerElement.remove();
		activeTimerElement = null;
	}
}

export async function ShowWinScreen(targetElement) {
	stopGameTimer();

	if (targetElement) {
		const skipButton = targetElement.querySelector("#skip-timer-btn");
		if (skipButton) {
			skipButton.remove();
		}
	}

	await playEndVideoAsync(() => {
		window.location.reload();
	});
}

export function startGameTimer(targetElement, durationInSeconds = DEFAULT_TIMER_SECONDS, onTimerEnd) {
	if (!targetElement) {
		return;
	}

	stopGameTimer();

	let remainingSeconds = Math.max(0, Math.floor(durationInSeconds));
	const totalDurationSeconds = remainingSeconds;

	const timerElement = document.createElement("div");
	timerElement.id = "game-timer";
	timerElement.textContent = formatNightHour(remainingSeconds, totalDurationSeconds);

	targetElement.appendChild(timerElement);
	activeTimerElement = timerElement;

	activeIntervalId = setInterval(() => {
		remainingSeconds -= 1;

		if (remainingSeconds <= 0) {
			remainingSeconds = 0;
			timerElement.textContent = formatNightHour(remainingSeconds, totalDurationSeconds);
			clearInterval(activeIntervalId);
			activeIntervalId = null;

			if (typeof onTimerEnd === "function") {
				onTimerEnd();
			}

			return;
		}

		timerElement.textContent = formatNightHour(remainingSeconds, totalDurationSeconds);
	}, 1000);
}
