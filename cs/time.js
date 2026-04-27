<<<<<<< HEAD
import { playEndVideoAsync } from "./home.js";
import { saveCurrentNight, loadGame } from "./save.js";
=======
import { playEndSequence } from "./end.js";
import { setNightAfterWin } from "./nights.js";
>>>>>>> main

// Durée par défaut de la nuit en secondes (6 minutes).
const DEFAULT_TIMER_SECONDS = 6 * 60;
<<<<<<< HEAD
const MAX_NIGHT = 3;
=======
// Clé de stockage du volume du jeu.
const VOLUME_KEY = "gameVolume";
>>>>>>> main

let activeIntervalId = null;
let activeTimerElement = null;

// Lit le volume enregistré et le normalise entre 0 et 1.
function readSavedVolume() {
	const storedVolume = Number(localStorage.getItem(VOLUME_KEY));
	if (Number.isNaN(storedVolume)) {
		return 0.5;
	}

	return Math.max(0, Math.min(1, storedVolume));
}

// Convertit le temps restant en une heure de nuit affichée.
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

// Arrête le timer et supprime l'élément visuel du DOM.
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

// Affiche l'écran de victoire après la fin de la nuit.
export async function ShowWinScreen(targetElement) {
	stopGameTimer();

<<<<<<< HEAD
	// Charger la sauvegarde existante
	const savedGame = loadGame();
	const currentNight = savedGame.currentNight || 1;
	const safeNight = Math.max(1, Math.min(MAX_NIGHT, Math.floor(currentNight)));
	const nextNight = Math.min(MAX_NIGHT, safeNight + 1);
	
	// Sauvegarder la prochaine nuit
	saveCurrentNight(nextNight);
=======
	setNightAfterWin();
>>>>>>> main

	if (targetElement) {
		const skipButton = targetElement.querySelector("#skip-timer-btn");
		if (skipButton) {
			skipButton.remove();
		}
	}

	await playEndSequence(targetElement, readSavedVolume(), null, () => {
		window.location.reload();
	});
}

// Démarre le timer de la nuit et met à jour l'affichage chaque seconde.
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
