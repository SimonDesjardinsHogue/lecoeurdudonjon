# ⚔️ Le Coeur du Donjon ⚔️

Un jeu simple, médiéval et fantastique inspiré par Legend of the Red Dragon.

![Game Screenshot](https://github.com/user-attachments/assets/589cfd57-3726-44ea-b8e6-5f2b63bcc5c9)

## 📖 Description

Dans le royaume oublié de Valoria, les ténèbres s'étendent. Au cœur du donjon ancien se cache un artefact légendaire - le Coeur du Donjon - capable de sauver le royaume. Êtes-vous prêt à devenir cette légende ?

## 🎮 Comment Jouer

### Démarrer le Jeu

1. Ouvrez `index.html` dans votre navigateur web
2. Entrez le nom de votre héros
3. Cliquez sur "Commencer l'Aventure"

### Fonctionnalités

#### 🗺️ Explorer le Donjon
- Rencontrez des ennemis aléatoires
- Combattez pour gagner de l'or et de l'expérience
- Progressez à travers différents niveaux de difficulté

![Combat Screenshot](https://github.com/user-attachments/assets/e4fb88ef-63e4-46f8-b7e4-5f9c2339a699)

#### ⚔️ Système de Combat
- **Attaquer** : Infligez des dégâts à l'ennemi
- **Défendre** : Doublez votre défense pour le prochain tour
- **Fuir** : Tentez d'échapper au combat (50% de chance)

#### 🏪 Le Marchand
Achetez des améliorations et des potions :
- Potions de soin (30-60 or)
- Épées pour augmenter la force (100-250 or)
- Armures pour augmenter la défense (80-200 or)

![Shop Screenshot](https://github.com/user-attachments/assets/a0cace49-fa20-44d3-a84d-42f8043118fa)

#### 🛌 Se Reposer
- Coût : 20 or
- Restaure complètement votre santé

#### 📊 Statistiques
- Suivez votre progression
- Voyez vos statistiques détaillées
- Compteur d'ennemis vaincus

### Ennemis

1. **Rat Géant** - Niveau débutant
2. **Gobelin** - Facile
3. **Squelette** - Moyen
4. **Orc** - Difficile
5. **Loup-Garou** - Très difficile
6. **Dragon Mineur** - Boss

### Progression

- **Montée de niveau** : Gagnez de l'expérience en combattant
- **Améliorations automatiques** : +20 HP max, +5 Force, +3 Défense par niveau
- **Objectif** : Vaincre 10 ennemis pour atteindre le Coeur du Donjon

### Sauvegarde

Le jeu sauvegarde automatiquement votre progression dans le navigateur (localStorage). Vous pouvez fermer la page et revenir plus tard pour continuer votre aventure.

## 🛠️ Technologie

- **HTML5** : Structure du jeu
- **CSS3** : Style médiéval/fantastique avec gradients et animations
- **JavaScript** : Logique du jeu, combat, progression
- **LocalStorage** : Sauvegarde automatique

## 🎨 Design

- Interface inspirée des jeux BBS classiques
- Thème sombre avec accents dorés et bruns
- Polices monospace pour une ambiance rétro
- Animations fluides et barres de progression visuelles

## 🚀 Déploiement

Le jeu est entièrement côté client et peut être :
- Hébergé sur GitHub Pages
- Déployé sur n'importe quel serveur web statique
- Ouvert localement dans un navigateur

Pour tester localement :
```bash
# Avec Python 3
python3 -m http.server 8000

# Puis ouvrez http://localhost:8000/index.html
```

## 📝 Développement Futur

Le jeu est conçu pour être facilement extensible avec l'aide de l'IA :

- ✅ Ajouter plus d'ennemis avec des descriptions générées par IA
- ✅ Créer des histoires et quêtes plus élaborées
- ✅ Ajouter des compétences spéciales et de la magie
- ✅ Intégrer des illustrations générées par IA
- ✅ Ajouter des classes de personnages (guerrier, mage, voleur)
- ✅ Système de donjons procéduraux
- ✅ Musique et effets sonores

## 📜 Licence

MIT License - Libre d'utilisation et de modification

## 🙏 Inspirations

Inspiré par **Legend of the Red Dragon (LORD)**, un jeu BBS classique créé par Seth Able Robinson.
