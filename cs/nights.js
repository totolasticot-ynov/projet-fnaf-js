// Clé de stockage locale pour la nuit en cours.
export const NIGHT_KEY = "currentNight";
// Nombre maximum de nuits disponibles.
export const MAX_NIGHT = 3;
// Clé de stockage pour afficher le bouton de continuation vers la nuit 2.
export const NEXT_NIGHT_READY_KEY = "nextNightReady";
// Chemins des vidéos d'introduction pour chaque nuit.
export const INTRO_NIGHT_1_PATH = "Assets/video/Intro-Fnaf-Night1.mp4";
export const INTRO_NIGHT_2_PATH = "Assets/video/Intro-Fnaf-NIght2.mp4";

// Assure que la valeur de nuit est comprise entre 1 et MAX_NIGHT.
function clampNight(night) {
	return Math.max(1, Math.min(MAX_NIGHT, Math.floor(night)));
}

// Lit la nuit stockée dans le localStorage et la normalise.
export function readStoredNight() {
	const currentNight = Number(localStorage.getItem(NIGHT_KEY));
	if (Number.isNaN(currentNight)) {
		return 1;
	}

	return clampNight(currentNight);
}

// Prépare le menu en définissant la nuit active et en retournant si la nuit 2 doit être montrée.
export function prepareNightForMenuLoad() {
	const shouldShowNight2Button = localStorage.getItem(NEXT_NIGHT_READY_KEY) === "1";
	if (shouldShowNight2Button) {
		localStorage.setItem(NIGHT_KEY, "2");
	} else {
		localStorage.setItem(NIGHT_KEY, "1");
	}

	return shouldShowNight2Button;
}

// Supprime le marqueur de disponibilité de la nuit 2 après utilisation.
export function consumeNight2ButtonFlag() {
	localStorage.removeItem(NEXT_NIGHT_READY_KEY);
}

// Avance la nuit après une victoire et met à jour le stockage.
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

	// Retourne les informations de progression de la nuit pour faciliter le débogage ou l'affichage.
	return { currentNight, nextNight, shouldShowNight2Button };
}
