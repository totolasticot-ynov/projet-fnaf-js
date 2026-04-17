const OFFICE_PATH = "Assets/images/office.png";
const SPRINGTRAP_LEFT_PATH = "Assets/images/springtrap-left.jpg";
const SPRINGTRAP_RIGHT_PATH = "Assets/images/springtrap-right.jpg";

export function createDangerDisplay(stage) {
	const img = document.createElement("img");
	img.src = OFFICE_PATH;
	img.alt = "Office";
	img.draggable = false;
	Object.assign(img.style, {
		width: "100%",
		height: "100%",
		objectFit: "cover",
		cursor: "default"
	});
	stage.appendChild(img);

	const setOffice = () => {
		img.src = OFFICE_PATH;
		img.alt = "Office";
	};

	const setSpringtrap = (side) => {
		img.src = side === "left" ? SPRINGTRAP_LEFT_PATH : SPRINGTRAP_RIGHT_PATH;
		img.alt = side === "left" ? "Springtrap left" : "Springtrap right";
	};

	return {
		setOffice,
		setSpringtrap,
		destroy: () => img.remove()
	};
}