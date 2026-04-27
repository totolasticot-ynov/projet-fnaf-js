// Chemins des images utilisées pour l'écran de danger.
const OFFICE_PATH = "Assets/images/office.png";
const SPRINGTRAP_LEFT_PATH = "Assets/images/springtrap-left.jpg";
const SPRINGTRAP_RIGHT_PATH = "Assets/images/springtrap-right.jpg";
const DOOR_LEFT_PATH = "Assets/images/door-left.png";
const DOOR_RIGHT_PATH = "Assets/images/door-right.png";

// Crée l'affichage du danger dans la scène de jeu.
export function createDangerDisplay(stage) {
	const img = document.createElement("img");
	img.src = OFFICE_PATH;
	img.alt = "Office";
	img.draggable = false;
	Object.assign(img.style, {
		width: "100%",
		height: "100%",
		objectFit: "cover",
		transform: "scale(0.94)",
		transformOrigin: "center center",
		cursor: "default",
		pointerEvents: "none"
	});
	stage.appendChild(img);

	// Définit l'image sur l'office lorsque le danger est absent.
	const setOffice = () => {
		img.src = OFFICE_PATH;
		img.alt = "Office";
	};

	const setSpringtrap = (side) => {
		img.src = side === "left" ? SPRINGTRAP_LEFT_PATH : SPRINGTRAP_RIGHT_PATH;
		img.alt = side === "left" ? "Springtrap left" : "Springtrap right";
	};

	const setDoor = (side) => {
		img.src = side === "left" ? DOOR_LEFT_PATH : DOOR_RIGHT_PATH;
		img.alt = side === "left" ? "Porte gauche fermee" : "Porte droite fermee";
	};

	return {
		setOffice,
		setDoor,
		setSpringtrap,
		// Supprime l'image du DOM lorsque l'affichage n'est détruit.
		destroy: () => img.remove()
	};
}