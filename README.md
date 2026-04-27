# projet-fnaf-js

Un mini-jeu d’ambiance inspiré de Five Nights at Freddy’s, développé en HTML/CSS/JavaScript.

## Description

Le projet propose un menu interactif et une scène de nuit où le joueur doit gérer des portes et des lumières pour survivre face à Springtrap.

## Fonctionnalités principales

- Menu principal avec boutons : `Jouer`, `Options`, `Crédits`, `Quitter`
- Vidéo de fond et vidéos d’introduction pour chaque nuit
- Contrôles de portes et lumières en jeu
- Affichage de la nuit en cours (`Nuit 1`, `Nuit 2`, etc.)
- Affichage d’une barre de batterie qui se vide progressivement
- Comportement de Springtrap avec attaques aléatoires gauche/droite
- Fin de partie et écran de victoire
- Volume sauvegardé dans `localStorage`

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

1. Ouvrir `index.html` dans un navigateur moderne.
2. Utiliser le bouton `Jouer` pour lancer la première nuit.
3. Contrôler les portes et les lumières pour survivre jusqu’à la fin du timer.

> Le jeu est conçu pour être lancé en local sans serveur, mais il fonctionne mieux avec un serveur HTTP quand il y a des médias (vidéos & sons).

## Contrôles

- `Porte G` / `Porte D` : fermer/ouvrir les portes gauche et droite
- `Lumiere G` / `Lumiere D` : allumer/éteindre les lumières de couloirs gauche et droite
- `Finir timer` : simuler la victoire instantanée
- `Jumpscare` : déclencher la fin de partie immédiatement

## Notes

- La progression de nuit est sauvegardée dans le `localStorage`
- `Nuit 2` devient disponible après avoir gagné la première nuit
- La barre de batterie se met à jour chaque seconde pendant le jeu

## Équipe

- Thomas
- Romain
- Augustin
- Preston
