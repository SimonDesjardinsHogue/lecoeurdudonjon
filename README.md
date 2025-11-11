# ⚔️ Le Coeur du Dragon ⚔️

<div align="center">

[![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)](https://github.com/SimonDesjardinsHogue/lecoeurdudragon/releases)
[![License](https://img.shields.io/badge/license-AGPL--3.0-green.svg)](LICENSE)
[![Deploy Status](https://img.shields.io/badge/deploy-GitHub%20Pages-success.svg)](https://simondesjardinshogue.github.io/lecoeurdudragon/)
[![PWA](https://img.shields.io/badge/PWA-Ready-blueviolet.svg)](manifest.json)
[![Language](https://img.shields.io/badge/language-JavaScript%20ES6-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Made with Love](https://img.shields.io/badge/Made%20with-%E2%9D%A4%EF%B8%8F-red.svg)](https://github.com/SimonDesjardinsHogue)

**Une quête légendaire de courage et d'honneur inspirée par Legend of the Red Dragon**

**🎯 Un RPG complet avec 12-18 heures de gameplay | 24 niveaux | 6 Boss épiques | 3 Classes uniques**

[🎮 Jouer Maintenant](https://simondesjardinshogue.github.io/lecoeurdudragon/) | [📖 Documentation](CONTRIBUTING.md) | [📝 Changelog](CHANGELOG.md) | [🐛 Reporter un Bug](https://github.com/SimonDesjardinsHogue/lecoeurdudragon/issues)

</div>

---

---

## 📑 Table des Matières

- [Description](#-description)
- [Caractéristiques Principales](#-caractéristiques-principales)
- [Comment Jouer](#-comment-jouer)
- [Objectifs et Portée](#-objectifs-et-portée-du-jeu)
- [Conseils pour Débutants](#-conseils-et-stratégies-pour-les-nouveaux-joueurs)
- [Mode Multijoueur](#-mode-multijoueur-lan)
- [Technologie](#️-technologie)
- [Développement](#-développement-et-contribution)
- [Déploiement](#-déploiement)
- [Contribuer](#-contribuer)
- [Sécurité](#-sécurité)
- [Licence](#-licence)

---

## 📖 Description

Dans le royaume oublié de Valéria, les ténèbres s'étendent. Au cœur de la forêt ancienne se cache un artefact légendaire - le Coeur du Dragon - capable de sauver le royaume. 

Selon les anciennes légendes, Valéria était autrefois un royaume prospère, protégé par la magie du Cœur du Dragon. Mais lorsque l'artefact fut corrompu par les forces des ténèbres, le royaume sombra dans l'oubli. 

De mystérieux explorateurs, des frères et sœurs connus sous le nom des M&M, parcourent maintenant les ruines du royaume. Ils déchiffrent les inscriptions anciennes et découvrent les secrets perdus de Valéria, aidant les héros courageux dans leur quête pour restaurer la lumière.

**Votre mission** : Atteindre le niveau 24, vaincre les 6 Boss légendaires et restaurer le Cœur du Dragon pour sauver Valéria !

### ✨ Caractéristiques Principales
- 🎮 **Gameplay Riche** : 12-18 heures pour compléter la quête principale
- ⚔️ **Combat Tactique** : Système de combat avec compétences spéciales et stratégie
- 🏆 **6 Boss Épiques** : Chacun avec des capacités uniques et des récompenses légendaires
- 👥 **3 Classes Jouables** : Guerrier, Magicien, Archer - chacune avec son propre style de jeu
- 🧝 **3 Races** : Humain, Elfe, Nain - chacune avec des modificateurs de stats uniques
- 📈 **Progression Profonde** : 24 niveaux, 7 statistiques, système de points de stats
- 🛍️ **Économie Complète** : Commerce, armes, armures, potions, objets légendaires
- 🎲 **Événements Aléatoires** : Énigmes, choix moraux, trésors, pièges
- 🏅 **Système de Succès** : Débloquez des accomplissements
- 💾 **Sauvegarde Multi-Appareils** : Exportez et importez votre progression
- 🌐 **Mode Multijoueur LAN** : Classements partagés en temps réel

Êtes-vous prêt à devenir cette légende ?

## 🎮 Comment Jouer

### Démarrer le Jeu

#### ⚠️ Important - Serveur Requis

Le jeu utilise des modules JavaScript ES6 qui nécessitent un serveur HTTP pour fonctionner correctement.

**Option 1 - Jouer en ligne (Recommandé):**
- Visitez directement: [https://simondesjardinshogue.github.io/lecoeurdudragon/](https://simondesjardinshogue.github.io/lecoeurdudragon/)

**Option 2 - Jouer en local:**

```bash
# Avec Python 3 (préinstallé sur Mac/Linux)
python3 -m http.server 8000

# Avec Node.js
npx http-server -p 8000

# Avec PHP
php -S localhost:8000
```

Puis ouvrez votre navigateur à: `http://localhost:8000/`

**Option 3 - Extensions de navigateur:**
- Visual Studio Code: Extension "Live Server"
- Chrome: Extension "Web Server for Chrome"

**Note:** ❌ N'ouvrez PAS `index.html` directement (file://) - cela ne fonctionnera pas à cause des restrictions de sécurité des modules ES6.

### Commencer à Jouer

1. Entrez le nom de votre héros
2. Choisissez une classe (Guerrier, Magicien, ou Archer)
3. Choisissez une race (Humain, Elfe, ou Nain)
4. Cliquez sur "Commencer l'Aventure"

## 🎯 Objectifs et Portée du Jeu

### Objectif Principal
**Atteindre le niveau 20 et vaincre les 5 Boss légendaires pour restaurer le Cœur du Dragon et sauver le royaume de Valéria !**

### Statistiques de Jeu
- **Niveau Maximum** : 20
- **Nombre d'Ennemis** : 30 types différents (+ 5 Boss uniques)
- **Temps de Jeu Estimé** : ~10-15 heures pour atteindre le niveau maximum
- **Classes de Personnages** : 3 classes uniques (Guerrier, Magicien, Archer)
- **Races de Personnages** : 3 races (Humain, Elfe, Nain)
- **Boss à Vaincre** : 5 Boss légendaires avec capacités spéciales
- **Objets Légendaires** : 8+ objets légendaires à débloquer
- **Succès à Débloquer** : Système de succès pour récompenser vos exploits

### Ce Que Vous Pouvez Faire

#### 🗺️ Explorer le Donjon
- Rencontrez des ennemis aléatoires ou des PNJ amicaux
- Combattez pour gagner de l'or et de l'expérience
- Progressez à travers différents niveaux de difficulté
- 70% de chance de rencontrer un monstre, 30% de chance de rencontrer un PNJ
- Découvrez des événements aléatoires : trésors, pièges, fontaines de guérison, sanctuaires
- Trouvez des passages secrets et des inscriptions mystérieuses laissées par les M&M

![Combat Screenshot](https://github.com/user-attachments/assets/e4fb88ef-63e4-46f8-b7e4-5f9c2339a699)

#### ⚔️ Système de Combat Avancé
- **Attaquer** : Infligez des dégâts à l'ennemi en fonction de votre force
- **Défendre** : Doublez votre défense pour le prochain tour
- **Compétences Spéciales** : Utilisez des capacités uniques selon votre classe
  - Guerrier : Charge Puissante, Coup de Bouclier
  - Magicien : Boule de Feu, Bouclier de Mana, Éclair Foudroyant, Lance de Glace
  - Archer : Tir Multiple, Tir Visé
- **Fuir** : Tentez d'échapper au combat (50% de chance)
- **Boss Combats** : Affrontez 5 Boss épiques avec des capacités spéciales
  - Troll des Cavernes (Niv. 5) - Régénération
  - Seigneur Liche (Niv. 10) - Vol de vie
  - Hydre à Trois Têtes (Niv. 15) - Triple attaque
  - Démon des Flammes (Niv. 20) - Explosion de feu
  - Dragon Ancien (Niv. 20) - Souffle de dragon dévastateur

#### 🏪 Le Marchand et l'Économie
Achetez des améliorations et des potions avec votre or :
- **10 niveaux de potions de soin** : De 20 HP (15 or) à 550 HP (900 or)
- **10 niveaux d'armes par classe** : Épées, Arcs, Bâtons (+1 à +22 dégâts)
- **10 niveaux d'armures** : De +1 à +22 défense
- **Potions de force** : +1 à +22 Force permanente
- **Potions d'énergie** : Restaurez votre énergie pour les compétences
- **Marchand Itinérant** : Rencontrez un marchand rare avec des objets épiques
- **Bijoutier** : Achetez et vendez des métaux précieux (or, argent, platine, etc.)

![Shop Screenshot](https://github.com/user-attachments/assets/a0cace49-fa20-44d3-a84d-42f8043118fa)

#### 💎 Système de Rareté des Objets
- **Commun** : Objets de base (gris)
- **Rare** : Objets avec 1 bonus aléatoire (bleu) 
- **Épique** : Objets avec 2 bonus aléatoires (violet)
- **Légendaire** : Objets avec 3 bonus aléatoires (or)

Les objets rares+ peuvent avoir des bonus sur 7 stats différentes :
- Force, Défense, Dextérité, Constitution, Intelligence, Sagesse, Charisme

#### 🎭 Personnages Non-Joueurs (PNJ)
- **Sage Mystérieux** : Conseils sur votre progression
- **Forgeron** : Accès à la boutique
- **Prêtre** : Bénédiction de guérison (+30 HP)
- **Chasseur de Trésors** : Vous donne de l'or
- **Vieux Guerrier** : Conseils tactiques
- **Les M&M (frère et sœur)** : Explorateurs qui révèlent les secrets de Valéria
- **Marchand Itinérant** : Objets rares et puissants
- **Bijoutier** : Commerce de métaux précieux

#### 🎲 Événements Aléatoires et Choix
- **Énigmes** : Résolvez des énigmes pour gagner de l'or et de l'XP
- **Choix Moraux** : Vos décisions affectent vos statistiques
  - Aider un mendiant (+Charisme)
  - Respecter les morts (+Sagesse, +XP)
- **Trésors** : Coffres au trésor, gemmes magiques
- **Pièges** : Pièges à pointes, gaz toxique
- **Lieux Spéciaux** : Fontaines de guérison, sanctuaires anciens
- **Découvertes** : Inscriptions mystérieuses, passages secrets

#### 🛌 Se Reposer à l'Auberge
- **Coût** : 20 or
- **Effet** : Restaure complètement votre santé
- **Repos Limité** : Une fois par jour (énergie se restaure à 6 AM heure de Toronto)

#### 📊 Système de Statistiques Détaillé
- **7 Statistiques Principales** :
  - Force : Augmente les dégâts d'attaque
  - Défense : Réduit les dégâts reçus (Classe d'armure)
  - Dextérité : Chance d'esquive pour Archer
  - Constitution : Augmente les points de vie maximums
  - Intelligence : Puissance des sorts pour Magicien
  - Sagesse : Résistance aux effets mentaux
  - Charisme : Influence les interactions avec les PNJ
- **Points de Stats** : +1 point par niveau à allouer librement
- **Progression** : Suivez vos kills, boss vaincus, or total, parties jouées

#### 🏆 Système de Succès
Débloquez des succès en accomplissant des exploits :
- Tuer un certain nombre d'ennemis
- Vaincre tous les boss
- Accumuler de l'or
- Atteindre des niveaux élevés
- Et bien plus !

### Ennemis et Boss

#### 30 Types d'Ennemis (Niveaux 1-20)
1. **Rat Géant** 🐀 - Niveau débutant (30 HP, 7 Force)
2. **Gobelin** 👺 - Facile (50 HP, 9 Force)
3. **Gobelin Archer** 🏹👺 - Facile (45 HP, 10 Force)
4. **Araignée Géante** 🕷️ - Facile (55 HP, 10 Force)
5. **Loup Sauvage** 🐺 - Facile (48 HP, 11 Force)
6. **Sanglier Enragé** 🐗 - Facile (58 HP, 11 Force)
7. **Squelette** 💀 - Moyen (60 HP, 12 Force)
8. **Squelette Archer** 🏹💀 - Moyen (55 HP, 13 Force)
9. **Orc** 👹 - Moyen-Difficile (80 HP, 15 Force)
10. **Bandit** 🗡️ - Moyen (75 HP, 14 Force)
11. **Bandit Arbalétrier** 🎯🗡️ - Moyen (70 HP, 16 Force)
12. **Ours de la Forêt** 🐻 - Difficile (95 HP, 17 Force)
13. **Loup-Garou** 🐺 - Difficile (100 HP, 18 Force)
14. **Zombie** 🧟 - Difficile (90 HP, 16 Force)
15. **Sorcier Noir** 🧙 - Très Difficile (110 HP, 20 Force)
16. **Dragon Mineur** 🐉 - Très Difficile (150 HP, 23 Force)
17-30. **Et 14 ennemis avancés** pour les niveaux 11-20, incluant l'Esprit de la Forêt Corrompu et le Gardien Ancien de la Forêt !

#### 5 Boss Légendaires
Chaque boss a des capacités spéciales uniques et récompense un objet légendaire !

1. **Troll des Cavernes** 👹 (Niv. 5) - Régénération 4-7 HP/tour
2. **Seigneur Liche** 💀 (Niv. 10) - Vol de vie (15 HP)
3. **Hydre à Trois Têtes** 🐉 (Niv. 15) - Triple attaque dévastatrice
4. **Démon des Flammes** 😈 (Niv. 20) - Explosion de feu (ignore 50% défense)
5. **Dragon Ancien** 🐲 (Niv. 20) - Souffle légendaire du dragon

### Progression et Montée de Niveau

- **Montée de niveau** : Gagnez de l'expérience en combattant les ennemis
- **Améliorations automatiques par niveau** : 
  - +20 HP maximum
  - +1 point de stat à allouer librement
- **Expérience requise** : Augmente progressivement avec chaque niveau
- **Boss** : 25% de chance de rencontrer un boss aux niveaux 5, 10, 15, 20

### 💡 Conseils et Stratégies pour les Nouveaux Joueurs

#### Choix de Classe
- **Guerrier** 🛡️ : Le plus résistant, excellent pour les débutants
  - 148 HP de base, haute défense
  - Bon équilibre entre attaque et survie
  - Compétences : Charge Puissante, Coup de Bouclier
  
- **Magicien** 🧙 : Dégâts élevés, mais fragile
  - 122 HP de base, attaques magiques puissantes
  - Bouclier de Mana pour survivre aux combats difficiles
  - Compétences : Boule de Feu, Bouclier de Mana, Éclair Foudroyant, Lance de Glace
  
- **Archer** 🏹 : Équilibré avec esquive
  - 128 HP de base, bonne dextérité
  - Capacité d'esquive basée sur la DEX (jusqu'à 18%)
  - Compétences : Tir Multiple, Tir Visé

#### Choix de Race
- **Humain** 👤 : Polyvalent et équilibré
  - Aucun modificateur de stats
  - Bon choix pour toutes les classes
  
- **Elfe** 🧝 : Agile et gracieux
  - +2 Dextérité, -2 Constitution
  - Excellent pour Archer (esquive améliorée)
  - Attention : Moins de HP de base (-10 HP)
  
- **Nain** 🧔 : Robuste et résistant
  - +2 Constitution, -2 Dextérité
  - Excellent pour Guerrier et Magicien (+10 HP)
  - Parfait pour survivre aux combats difficiles

#### Stratégies de Progression
1. **Début du Jeu (Niveaux 1-5)**
   - Combattez les Rats Géants et Gobelins pour gagner de l'expérience
   - Économisez votre or pour acheter une première arme (~80-130 or)
   - Reposez-vous à l'auberge quand votre santé est basse (20 or)
   - Objectif : Atteindre niveau 5 et affronter le Troll des Cavernes

2. **Milieu du Jeu (Niveaux 6-15)**
   - Améliorez progressivement votre équipement
   - Utilisez vos points de stats stratégiquement :
     - Guerrier : Constitution et Force
     - Magicien : Intelligence et Constitution
     - Archer : Dextérité et Force
   - Gardez toujours des potions de soin dans votre inventaire
   - Objectifs : Vaincre le Seigneur Liche (Niv. 10) et l'Hydre (Niv. 15)

3. **Fin du Jeu (Niveaux 16-20)**
   - Équipez-vous avec des armes et armures légendaires
   - Préparez-vous pour les boss finaux : Démon des Flammes et Dragon Ancien
   - Maximisez vos statistiques principales
   - Utilisez vos compétences spéciales efficacement en combat
   - Objectif final : Vaincre le Dragon Ancien et restaurer le Cœur du Dragon !

#### Conseils Généraux
- 💰 **Gestion de l'Or** : N'achetez pas tout tout de suite, priorisez la survie
- 🧪 **Potions** : Gardez toujours 2-3 potions de soin pour les urgences
- 🎯 **Compétences** : Économisez votre énergie pour les combats de boss
- 🛡️ **Défense** : La défense est aussi importante que l'attaque pour survivre
- 📊 **Stats** : Distribuez vos points de stats selon votre style de jeu
- 🎲 **Événements** : Les choix moraux et énigmes peuvent donner de bonnes récompenses
- 🔍 **Exploration** : Parlez aux M&M pour découvrir des secrets et gagner des bonus

### Temps de Jeu Estimé par Objectif
- **Atteindre Niveau 5** : ~1-2 heures
- **Atteindre Niveau 10** : ~3-5 heures
- **Atteindre Niveau 15** : ~7-10 heures
- **Atteindre Niveau 20 (Max)** : ~10-15 heures
- **Vaincre tous les Boss** : Inclus dans le temps ci-dessus
- **Débloquer tous les Succès** : ~15-20 heures (rejouabilité)

### Sauvegarde

Le jeu sauvegarde automatiquement votre progression dans le navigateur (localStorage). Vous pouvez fermer la page et revenir plus tard pour continuer votre aventure.

#### 💾 Système de Sauvegarde Multi-Appareils

Le jeu propose maintenant un système de sauvegarde avancé :

- **Sauvegarde Automatique** : Votre progression est automatiquement sauvegardée après chaque action
- **Export/Import** : Générez un code de sauvegarde pour transférer votre progression sur un autre appareil
- **Indicateur Visuel** : Une icône 💾 apparaît brièvement en bas de l'écran lors de chaque sauvegarde

Pour accéder aux options de sauvegarde :
1. Allez dans le menu "Voir Statistiques"
2. Cliquez sur "Sauvegardes"
3. Exportez votre code de sauvegarde ou importez-en un existant

### 🌐 Mode Multijoueur LAN

Jouez avec votre famille sur le réseau local et partagez un classement commun !

#### Fonctionnalités

- **Classement en temps réel** : Les scores se synchronisent automatiquement entre tous les joueurs
- **Identification unique** : Chaque joueur a un ID unique stocké dans son navigateur
- **WebSocket** : Mises à jour instantanées du classement via Socket.IO
- **Persistance** : Les scores sont sauvegardés sur le serveur (fichier JSON)

#### Configuration Rapide

1. **Démarrer le serveur** (sur un PC du réseau local) :
   ```bash
   cd server
   npm install
   npm start
   ```
   Le serveur affichera automatiquement les adresses IP disponibles pour la connexion.

2. **Partager l'adresse avec les autres joueurs** :
   - Le serveur affiche les adresses réseau disponibles (ex: `http://192.168.68.61:3000`)
   - Partagez cette adresse avec les autres joueurs

3. **Jouer sur d'autres appareils** (iPad, téléphones, autres PC) :
   - Ouvrez simplement `http://[IP-DU-SERVEUR]:3000` dans le navigateur
   - Aucune installation nécessaire !
   - Les scores sont partagés en temps réel !

#### 🔧 Problèmes de Connexion ?

Si vous ne pouvez pas vous connecter depuis un iPad ou autre appareil :

📖 **[TROUBLESHOOTING_MULTIJOUEUR.md](TROUBLESHOOTING_MULTIJOUEUR.md)** - Guide complet de dépannage

Ce guide explique :
- Un seul PC doit lancer npm (pas tous les appareils)
- Configuration du firewall Windows/Linux
- Spécificités iOS/iPad
- Tests de connectivité réseau

📖 **Documentation complète** : [MULTIPLAYER_GUIDE.md](MULTIPLAYER_GUIDE.md)

## 🛠️ Technologie

Le jeu utilise une **architecture modulaire améliorée** basée sur des modules ES6 JavaScript pour une meilleure maintenabilité et évolutivité.

- **HTML5** : Structure du jeu
- **CSS3** : Style médiéval/fantastique avec gradients et animations
- **JavaScript ES6 Modules** : Architecture modulaire organisée
  - `js/data/` : Données du jeu (ennemis, items, NPCs, événements)
    - `enemies.js` : Ennemis et boss
    - `shop-items.js` : Items de boutique
    - `npcs.js` : Personnages non-joueurs
    - `metals.js` : Métaux précieux
    - `events.js` : Événements aléatoires
    - `game-constants.js` : Constantes et fonctions utilitaires
  - `js/core/` : Modules centraux
    - `game-state.js` : État centralisé du jeu
  - `js/` : Logique et systèmes
    - `game-logic.js` : Logique métier principale
    - `combat.js` : Système de combat
    - `ui.js` : Gestion de l'interface
    - `save-load.js` : Persistance des données
    - `character-classes.js` : Système de classes
    - `audio.js` : Gestion audio
    - `particles.js` : Effets visuels
    - `keyboard-handler.js` : Raccourcis clavier
- **LocalStorage** : Sauvegarde automatique

📖 Pour plus de détails sur l'architecture, consultez [js/README.md](js/README.md)

### 👨‍💻 Développement et Contribution

Pour contribuer au projet ou ajouter des fonctionnalités, consultez le guide complet:
📖 **[CONTRIBUTING.md](CONTRIBUTING.md)** - Guide de contribution avec architecture détaillée

Le guide explique:
- Structure modulaire et organisation du code
- Comment ajouter des fonctionnalités (ennemis, objets, écrans, etc.)
- Bonnes pratiques de développement
- Comment tester vos modifications
- Débogage et résolution de problèmes

## 🎨 Design

- Interface inspirée des jeux BBS classiques
- Thème sombre avec accents dorés et bruns
- Polices monospace pour une ambiance rétro
- Animations fluides et barres de progression visuelles

## 🚀 Déploiement

Le jeu est entièrement côté client et peut être :
- Hébergé sur GitHub Pages (déploiement automatique configuré)
- Déployé sur n'importe quel serveur web statique
- Ouvert localement dans un navigateur
- **Publié comme application mobile** (PWA ou Google Play Store)

### 📱 Publication Mobile

Le jeu peut être installé comme une application mobile :
- **Progressive Web App (PWA)** : Installation directe depuis le navigateur
- **Google Play Store** : Via Trusted Web Activities (TWA)

📖 **Guide complet** : Consultez [GOOGLE_APP_GUIDE.md](GOOGLE_APP_GUIDE.md) et [GOOGLE_APP_REQUIREMENTS.md](GOOGLE_APP_REQUIREMENTS.md) pour les instructions détaillées sur :
- Comment publier le jeu en tant que PWA
- Comment soumettre au Google Play Store
- Les améliorations nécessaires
- Les requirements techniques
- Une checklist complète de publication

### Hébergement sur GitHub Pages

Le jeu est automatiquement déployé sur GitHub Pages à chaque push sur la branche `main`. Le workflow de déploiement est configuré dans `.github/workflows/deploy.yml`.

#### Configuration Automatique du Déploiement

Le fichier `.github/workflows/deploy.yml` contient un workflow GitHub Actions qui :
- Se déclenche automatiquement à chaque push sur la branche `main`
- Configure GitHub Pages avec les permissions nécessaires
- Téléverse l'intégralité du contenu du dépôt comme artefact
- Déploie le site sur GitHub Pages

Les permissions suivantes sont configurées dans le workflow :
- `contents: read` - Pour lire le contenu du dépôt
- `pages: write` - Pour écrire sur GitHub Pages
- `id-token: write` - Pour l'authentification

#### Pour Activer GitHub Pages sur Votre Propre Fork

Si vous forkez ce projet, suivez ces étapes détaillées pour activer GitHub Pages :

1. **Accéder aux paramètres du dépôt**
   - Allez sur la page de votre dépôt GitHub (`https://github.com/[votre-nom-utilisateur]/lecoeurdudragon`)
   - Cliquez sur l'onglet **Settings** (Paramètres) en haut à droite

2. **Configurer GitHub Pages**
   - Dans le menu latéral gauche, descendez jusqu'à la section **Code and automation** (Code et automatisation)
   - Cliquez sur **Pages**
   - Sous **Build and deployment** (Construction et déploiement) :
     - Pour **Source**, sélectionnez **GitHub Actions** dans le menu déroulant
     - (Ne sélectionnez PAS l'option "Deploy from a branch" - choisissez bien "GitHub Actions")

3. **Premier déploiement**
   - Le workflow se déclenchera automatiquement au prochain push sur la branche `main`
   - Vous pouvez aussi déclencher le déploiement manuellement :
     - Allez dans l'onglet **Actions** de votre dépôt
     - Sélectionnez le workflow "Deploy to GitHub Pages"
     - Cliquez sur **Run workflow** → **Run workflow**

4. **Vérifier le déploiement**
   - Dans l'onglet **Actions**, vous pouvez suivre la progression du déploiement
   - Le déploiement prend généralement 1-2 minutes
   - Une fois terminé, une coche verte ✓ apparaîtra

5. **Accéder à votre site**
   - Le site sera accessible à : `https://[votre-nom-utilisateur].github.io/lecoeurdudragon/`
   - L'URL exacte sera également affichée dans les paramètres **Pages** après le premier déploiement réussi

#### Dépannage

- **Le workflow ne se déclenche pas** : Vérifiez que vous avez bien sélectionné "GitHub Actions" comme source dans les paramètres Pages
- **Erreur de permissions** : Les permissions nécessaires sont normalement configurées automatiquement par le workflow (`contents: read`, `pages: write`, `id-token: write`). Si vous rencontrez des erreurs de permissions, vérifiez que GitHub Actions est activé dans Settings → Actions → General
- **Page 404** : Attendez quelques minutes après le premier déploiement, le DNS peut prendre un peu de temps à se propager

### Test Local

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

### 📋 Liste Complète d'Améliorations

Pour une liste détaillée de 30 optimisations et améliorations proposées, consultez :
- **[OPTIMISATIONS.md](OPTIMISATIONS.md)** - Version française 🇫🇷
- **[OPTIMIZATIONS_EN.md](OPTIMIZATIONS_EN.md)** - English version 🇬🇧

Ces documents comprennent des suggestions organisées par catégorie (UX, Performance, Gameplay, Technique) avec des priorités et un plan d'implémentation.

## 🤝 Contribuer

Nous accueillons les contributions de la communauté ! Que vous souhaitiez corriger un bug, ajouter une fonctionnalité, ou améliorer la documentation, votre aide est la bienvenue.

### Comment Contribuer

1. **Lisez le guide de contribution** : [CONTRIBUTING.md](CONTRIBUTING.md)
2. **Consultez le code de conduite** : [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
3. **Créez une issue** pour discuter de votre idée
4. **Fork le projet** et créez une branche pour votre fonctionnalité
5. **Soumettez une pull request** avec vos changements

### Domaines d'Aide

- 🐛 Correction de bugs
- ✨ Nouvelles fonctionnalités
- 📝 Amélioration de la documentation
- 🎨 Design et graphismes
- 🌍 Traductions
- 🧪 Tests et assurance qualité

## 🔒 Sécurité

La sécurité de nos utilisateurs est primordiale. Si vous découvrez une vulnérabilité de sécurité :

- **NE PAS** créer une issue publique
- Consultez notre [Politique de Sécurité](SECURITY.md)
- Signalez-la de manière responsable via GitHub Security Advisories

Nous nous engageons à répondre dans les 48 heures et à publier un correctif dans les 90 jours.

## 📜 Licence

Ce projet est sous licence **GNU Affero General Public License v3.0 (AGPL-3.0)**.

Cela signifie que vous êtes libre de :
- ✅ Utiliser le jeu à des fins personnelles ou commerciales
- ✅ Modifier et adapter le code
- ✅ Distribuer votre propre version

Avec les conditions suivantes :
- 📋 Vous devez publier le code source de vos modifications
- 📋 Vous devez utiliser la même licence (AGPL-3.0)
- 📋 Vous devez indiquer les changements effectués
- 📋 Si vous exécutez une version modifiée sur un serveur, vous devez rendre le code source disponible

Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements et Inspirations

- **Legend of the Red Dragon (LORD)** - Jeu BBS classique créé par Seth Able Robinson qui a inspiré ce projet
- **Communauté Open Source** - Pour les outils et bibliothèques qui rendent ce projet possible
- **Contributeurs** - Merci à tous ceux qui ont contribué à améliorer le jeu !

## 📞 Contact et Support

- 🐛 **Bugs et problèmes** : [GitHub Issues](https://github.com/SimonDesjardinsHogue/lecoeurdudragon/issues)
- 💬 **Discussions** : [GitHub Discussions](https://github.com/SimonDesjardinsHogue/lecoeurdudragon/discussions)
- 🔒 **Sécurité** : Voir [SECURITY.md](SECURITY.md)

## ⭐ Soutenez le Projet

Si vous aimez Le Coeur du Dragon, n'hésitez pas à :
- ⭐ Mettre une étoile sur GitHub
- 🐛 Signaler des bugs
- 💡 Suggérer des améliorations
- 📢 Partager avec vos amis
- 🤝 Contribuer au code

---

<div align="center">

Fait avec ❤️ par [Simon Desjardins Hogue](https://github.com/SimonDesjardinsHogue)

**Bon courage, héros légendaire ! Que votre quête soit glorieuse ! ⚔️🛡️**

</div>
