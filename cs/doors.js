// Crée un panneau de porte pour l'office.
function createDoorPanel(side) {
	const panel = document.createElement("div");

	Object.assign(panel.style, {
		position: "absolute",
		top: "0",
		bottom: "0",
		width: "13%",
		left: side === "left" ? "0" : "auto",
		right: side === "right" ? "0" : "auto",
		background: "linear-gradient(to bottom, rgba(32, 32, 32, 0.95), rgba(0, 0, 0, 0.95))",
		borderLeft: side === "right" ? "2px solid #555" : "none",
		borderRight: side === "left" ? "2px solid #555" : "none",
		opacity: "0",
		pointerEvents: "none",
		transition: "opacity 140ms ease",
		zIndex: "7"
	});

	return panel;
}

// Crée le bouton pour contrôler l'ouverture/fermeture d'une porte.
function createDoorButton(side) {
	const button = document.createElement("button");

	Object.assign(button.style, {
		position: "absolute",
		top: "44%",
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

// Initialise les contrôles de portes dans la scène de jeu.
export function initDoorControls(menuStage) {
	const leftDoorPanel = createDoorPanel("left");
	const rightDoorPanel = createDoorPanel("right");
	menuStage.appendChild(leftDoorPanel);
	menuStage.appendChild(rightDoorPanel);

	const leftButton = createDoorButton("left");
	const rightButton = createDoorButton("right");
	menuStage.appendChild(leftButton);
	menuStage.appendChild(rightButton);

	// État local des portes (fermée = true, ouverte = false).
	const state = {
		left: false,
		right: false
	};

	// Met à jour l'apparence des panneaux et des boutons selon l'état.
	const update = () => {
		leftDoorPanel.style.opacity = state.left ? "1" : "0";
		rightDoorPanel.style.opacity = state.right ? "1" : "0";
		leftButton.textContent = "Porte G";
		rightButton.textContent = "Porte D";
		leftButton.style.borderColor = state.left ? "#ff6d6d" : "#5f6a71";
		rightButton.style.borderColor = state.right ? "#ff6d6d" : "#5f6a71";
		leftButton.style.boxShadow = state.left ? "inset 0 1px 0 rgba(255,255,255,0.1), 0 0 14px rgba(255, 68, 68, 0.72)" : "inset 0 1px 0 rgba(255,255,255,0.12), 0 0 8px rgba(0,0,0,0.55)";
		rightButton.style.boxShadow = state.right ? "inset 0 1px 0 rgba(255,255,255,0.1), 0 0 14px rgba(255, 68, 68, 0.72)" : "inset 0 1px 0 rgba(255,255,255,0.12), 0 0 8px rgba(0,0,0,0.55)";
		leftButton.style.background = state.left ? "linear-gradient(180deg, #4d1f1f 0%, #2f0f0f 100%)" : "linear-gradient(180deg, #2b3136 0%, #171b1e 100%)";
		rightButton.style.background = state.right ? "linear-gradient(180deg, #4d1f1f 0%, #2f0f0f 100%)" : "linear-gradient(180deg, #2b3136 0%, #171b1e 100%)";
	};

	// Clic sur le bouton de la porte gauche.
	leftButton.addEventListener("click", () => {
		const willBeClosed = !state.left;
		if (willBeClosed && state.right) {
			return; // empêcher de fermer les deux portes en même temps
		}
		state.left = !state.left;
		update();
	});

	// Clic sur le bouton de la porte droite.
	rightButton.addEventListener("click", () => {
		const willBeClosed = !state.right;
		if (willBeClosed && state.left) {
			return; // empêcher de fermer les deux portes en même temps
		}
		state.right = !state.right;
		update();
	});

	update();

	return {
		// Indique si une porte est fermée.
		isDoorClosed(side) {
			return side === "left" ? state.left : state.right;
		},
		// Nettoie le DOM en supprimant les boutons et panneaux.
		destroy() {
			leftButton.remove();
			rightButton.remove();
			leftDoorPanel.remove();
			rightDoorPanel.remove();
		}
	};
}
