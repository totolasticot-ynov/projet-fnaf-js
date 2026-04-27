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
	const leftButton = createDoorButton("left");
	const rightButton = createDoorButton("right");
	menuStage.appendChild(leftButton);
	menuStage.appendChild(rightButton);

	// État local des portes (fermée = true, ouverte = false).
	const state = {
		left: false,
		right: false
	};
	const listeners = new Set();
	let disabled = false;

	// Met à jour l'apparence des panneaux et des boutons selon l'état.
	const update = () => {
		leftButton.textContent = "Porte G";
		rightButton.textContent = "Porte D";
		leftButton.style.borderColor = state.left ? "#ff6d6d" : "#5f6a71";
		rightButton.style.borderColor = state.right ? "#ff6d6d" : "#5f6a71";
		leftButton.style.boxShadow = state.left ? "inset 0 1px 0 rgba(255,255,255,0.1), 0 0 14px rgba(255, 68, 68, 0.72)" : "inset 0 1px 0 rgba(255,255,255,0.12), 0 0 8px rgba(0,0,0,0.55)";
		rightButton.style.boxShadow = state.right ? "inset 0 1px 0 rgba(255,255,255,0.1), 0 0 14px rgba(255, 68, 68, 0.72)" : "inset 0 1px 0 rgba(255,255,255,0.12), 0 0 8px rgba(0,0,0,0.55)";
		leftButton.style.background = state.left ? "linear-gradient(180deg, #4d1f1f 0%, #2f0f0f 100%)" : "linear-gradient(180deg, #2b3136 0%, #171b1e 100%)";
		rightButton.style.background = state.right ? "linear-gradient(180deg, #4d1f1f 0%, #2f0f0f 100%)" : "linear-gradient(180deg, #2b3136 0%, #171b1e 100%)";
		if (disabled) {
			leftButton.style.opacity = "0.55";
			rightButton.style.opacity = "0.55";
		} else {
			leftButton.style.opacity = "1";
			rightButton.style.opacity = "1";
		}
		listeners.forEach((listener) => {
			listener({ ...state });
		});
	};

	// Clic sur le bouton de la porte gauche.
	leftButton.addEventListener("click", () => {
		if (disabled) {
			return;
		}

		const willBeClosed = !state.left;
		if (willBeClosed && state.right) {
			return; // empêcher de fermer les deux portes en même temps
		}
		state.left = !state.left;
		update();
	});

	// Clic sur le bouton de la porte droite.
	rightButton.addEventListener("click", () => {
		if (disabled) {
			return;
		}

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
		// Ouvre toutes les portes immédiatement.
		openAll() {
			state.left = false;
			state.right = false;
			update();
		},
		// Permet d'activer ou désactiver l'utilisation des portes.
		setDisabled(value) {
			disabled = Boolean(value);
			leftButton.disabled = disabled;
			rightButton.disabled = disabled;
			leftButton.style.cursor = disabled ? "not-allowed" : "pointer";
			rightButton.style.cursor = disabled ? "not-allowed" : "pointer";
			update();
		},
		// Permet d'écouter les changements d'état des portes.
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
		// Nettoie le DOM en supprimant les boutons et panneaux.
		destroy() {
			leftButton.remove();
			rightButton.remove();
			listeners.clear();
		}
	};
}
