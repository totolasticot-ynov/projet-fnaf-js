# projet-fnaf-js

Un mini-jeu d’ambiance inspiré de Five Nights at Freddy’s, développé en HTML/CSS/JavaScript.

## Description

Le projet propose un menu interactif et une scène de nuit où le joueur doit gérer des portes et des lumières pour survivre face à Springtrap.

## Fonctionnalités principales

- Menu principal avec boutons : "Jouer", "Options", "Crédits", "Quitter"
- Vidéo de fond et vidéos d’introduction pour chaque nuit
- Contrôles de portes et lumières en jeu
- Affichage de la nuit en cours (`Nuit 1`, `Nuit 2`, `Nuit 3`.)
- Affichage de la batterie de la lampe torche qui se vide progressivement
- Comportement de Springtrap avec attaques aléatoires gauche/droite
- Fin de partie et écran de Game Over

## Architecture

- `index.html` : point d’entrée du jeu
- `Assets/` : images, sons, vidéos et styles
- `cs/` : scripts JavaScript du jeu
  - `game.js` : gestion du fond vidéo et du démarrage du jeu
  - `menu.js` : logique du menu, lancement des scènes et minuterie
  - `battery.js` : affichage et animation de la batterie
  - `danger.js` : affichage de l’office et de Springtrap
  - `doors.js` : contrôles de portes gauche/droite
  - `light.js` : contrôles des lumières de couloir
  - `enemy.js` : comportement de Springtrap et événements de game over
  - `time.js` : minuterie de nuit et gestion de la victoire
  - `nights.js` : gestion des nuits, stockage `localStorage` et progression
  - `gameover.js` : séquence de fin de partie
  - `end.js` : fin de jeu après succès
  - `home.js`, `intro.js`, `jumpscare.js`, `VideoPlayer.js` : scripts additionnels du jeu

## Comment lancer le jeu

1. Installer Live Server
2. Ouvrir `index.html`
3. Repérer Springtrap grace au son, verifier sa présence avec les lumieres et fermer les portes si il se trouve derriere.
4. Tenir 6 minutes en économisant bien la battrie de la lampe
## Contrôles

- `Porte G` / `Porte D` : fermer/ouvrir les portes gauche et droite
- `Lumiere G` / `Lumiere D` : allumer/éteindre les lumières de couloirs gauche et droite


## Notes

- La progression de nuit est sauvegardée dans le `localStorage`
- Le jeu se termine quand le joueur bat la 3eme Nuit

## Équipe

- Thomas Dhordain
- Romain Voynier
- Augustin Benoit
- Preston Walter Bassette
