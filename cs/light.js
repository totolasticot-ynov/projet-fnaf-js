// Crée un bouton de contrôle pour allumer ou éteindre une lumière de couloir.
function createControlButton(label, side, offsetPx) {
	const button = document.createElement("button");
	button.textContent = label;

	Object.assign(button.style, {
		position: "absolute",
		top: `${offsetPx}px`,
		left: side === "left" ? "20px" : "auto",
		right: side === "right" ? "20px" : "auto",
		width: "74px",
		height: "34px",
		padding: "0",
		border: "2px solid #5f6a71",
		borderRadius: "2px",
		background: "linear-gradient(180deg, #2b3136 0%, #171b1e 100%)",
		color: "#dbe3ea",
		fontWeight: "700",
		fontSize: "11px",
		letterSpacing: "0.6px",
		textTransform: "uppercase",
		cursor: "pointer",
		boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), 0 0 8px rgba(0,0,0,0.55)",
		zIndex: "9"
	});

	return button;
}

// Initialise les contrôles de lumière dans la scène de jeu.
// `menuStage` est l'élément parent qui reçoit l'interface.
export function initLightControls(menuStage) {
	const leftCorridorLight = document.createElement("div");
	const rightCorridorLight = document.createElement("div");
	const listeners = new Set();

	Object.assign(leftCorridorLight.style, {
		position: "absolute",
		top: "0",
		bottom: "0",
		left: "0",
		width: "38%",
		zIndex: "4",
		opacity: "0",
		pointerEvents: "none",
		transition: "opacity 150ms ease",
		background: "linear-gradient(90deg, rgba(255, 236, 145, 0.72) 0%, rgba(255, 236, 145, 0.32) 42%, rgba(255, 236, 145, 0) 100%)"
	});

	Object.assign(rightCorridorLight.style, {
		position: "absolute",
		top: "0",
		bottom: "0",
		right: "0",
		width: "38%",
		zIndex: "4",
		opacity: "0",
		pointerEvents: "none",
		transition: "opacity 150ms ease",
		background: "linear-gradient(270deg, rgba(255, 236, 145, 0.72) 0%, rgba(255, 236, 145, 0.32) 42%, rgba(255, 236, 145, 0) 100%)"
	});

	menuStage.appendChild(leftCorridorLight);
	menuStage.appendChild(rightCorridorLight);

	const leftButton = createControlButton("Lumiere G", "left", 50 + 170);
	const rightButton = createControlButton("Lumiere D", "right", 50 + 170);

	menuStage.appendChild(leftButton);
	menuStage.appendChild(rightButton);

	// État des deux lumières du couloir.
	const state = {
		left: false,
		right: false
	};

	// Met à jour l'apparence des lumières et des boutons.
	const update = () => {
		leftCorridorLight.style.opacity = state.left ? "1" : "0";
		rightCorridorLight.style.opacity = state.right ? "1" : "0";
		leftButton.style.borderColor = state.left ? "#b5ff9f" : "#5f6a71";
		rightButton.style.borderColor = state.right ? "#b5ff9f" : "#5f6a71";
		leftButton.style.boxShadow = state.left ? "inset 0 1px 0 rgba(255,255,255,0.12), 0 0 14px rgba(132, 255, 111, 0.75)" : "inset 0 1px 0 rgba(255,255,255,0.12), 0 0 8px rgba(0,0,0,0.55)";
		rightButton.style.boxShadow = state.right ? "inset 0 1px 0 rgba(255,255,255,0.12), 0 0 14px rgba(132, 255, 111, 0.75)" : "inset 0 1px 0 rgba(255,255,255,0.12), 0 0 8px rgba(0,0,0,0.55)";
		leftButton.style.background = state.left ? "linear-gradient(180deg, #24442a 0%, #142717 100%)" : "linear-gradient(180deg, #2b3136 0%, #171b1e 100%)";
		rightButton.style.background = state.right ? "linear-gradient(180deg, #24442a 0%, #142717 100%)" : "linear-gradient(180deg, #2b3136 0%, #171b1e 100%)";

		listeners.forEach((listener) => {
			listener({ ...state });
		});
	};

	leftButton.addEventListener("click", () => {
		const willBeTurnedOn = !state.left;
		if (willBeTurnedOn && state.right) return; // empêcher deux lumières allumées en même temps
		state.left = !state.left;
		update();
	});

	rightButton.addEventListener("click", () => {
		const willBeTurnedOn = !state.right;
		if (willBeTurnedOn && state.left) return; // empêcher deux lumières allumées en même temps
		state.right = !state.right;
		update();
	});

	update();

	return {
		// Vérifie si une lumière est allumée.
		isLightOn(side) {
			return side === "left" ? state.left : state.right;
		},
		// Permet à d'autres composants de recevoir les mises à jour d'état.
		onChange(listener) {
			if (typeof listener !== "function") {
				return () => {};
			}

			listeners.add(listener);
			listener({ ...state });

			return () => {
				listeners.delete(listener);
			};
		},
		// Nettoie le DOM lorsque les contrôles ne sont plus nécessaires.
		destroy() {
			leftButton.remove();
			rightButton.remove();
			leftCorridorLight.remove();
			rightCorridorLight.remove();
			listeners.clear();
		}
	};
}
