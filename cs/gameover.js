import { playJumpscareSequence } from './jumpscare.js';

// Affiche l'écran de game over après le jumpscare.
function renderGameOverScreen(stage) {
	if (!stage) {
		return;
	}

	// Vide le contenu actuel du stage pour afficher l'écran de fin.
	stage.innerHTML = '';

	const backdrop = document.createElement('img');
	backdrop.src = 'Assets/images/gameover.png';
	backdrop.alt = 'Game Over';
	Object.assign(backdrop.style, {
		position: 'absolute',
		inset: '0',
		width: '100%',
		height: '100%',
		objectFit: 'cover',
		display: 'block',
		zIndex: '20',
		pointerEvents: 'none'
	});

	const overlay = document.createElement('div');
	overlay.id = 'game-over-screen';

	Object.assign(overlay.style, {
		position: 'absolute',
		inset: '0',
		zIndex: '21',
		pointerEvents: 'none'
	});

	// Crée un bouton invisible sur le visuel pour gérer les actions du menu.
	const createMenuButton = (label, onClick) => {
		const button = document.createElement('button');
		button.textContent = label;
		Object.assign(button.style, {
			position: 'absolute',
			padding: '0',
			border: 'none',
			background: 'transparent',
			color: 'transparent',
			fontSize: '0',
			cursor: 'pointer',
			outline: 'none',
			pointerEvents: 'auto'
		});

		button.setAttribute('aria-label', label);
		button.title = label;
		button.addEventListener('click', onClick);
		return button;
	};

	// Bouton de rechargement pour rejouer la partie.
	const restartButton = createMenuButton('TRY AGAIN?', () => {
		window.location.reload();
	});
	Object.assign(restartButton.style, {
		left: '50%',
		transform: 'translateX(-50%)',
		top: '27.5%',
		width: '32%',
		height: '10%'
	});

	// Bouton de retour au menu principal.
	const menuButton = createMenuButton('MAIN MENU', () => {
		window.location.reload();
	});
	Object.assign(menuButton.style, {
		left: '50%',
		transform: 'translateX(-50%)',
		top: '38.5%',
		width: '24%',
		height: '9%'
	});

	stage.appendChild(backdrop);
	overlay.appendChild(restartButton);
	overlay.appendChild(menuButton);
	stage.appendChild(overlay);
}

// Joue la séquence de jumpscare puis affiche l'écran de fin de partie.
export async function playGameOverSequence(stage, volume, onVideoReady) {
	if (!stage) {
		return null;
	}

	return playJumpscareSequence(stage, volume, onVideoReady, () => {
		renderGameOverScreen(stage);
	});
}
