# ⚔️ Le Coeur du Dragon ⚔️

Une quête légendaire de courage et d'honneur inspirée par Legend of the Red Dragon.

![Game Screenshot](https://github.com/user-attachments/assets/589cfd57-3726-44ea-b8e6-5f2b63bcc5c9)

## 📖 Description

Dans le royaume oublié de Valéria, les ténèbres s'étendent. Au cœur du donjon ancien se cache un artefact légendaire - le Coeur du Dragon - capable de sauver le royaume. 

Selon les anciennes légendes, Valéria était autrefois un royaume prospère, protégé par la magie du Cœur du Dragon. Mais lorsque l'artefact fut corrompu par les forces des ténèbres, le royaume sombra dans l'oubli. 

De mystérieux explorateurs, des frères et sœurs connus sous le nom des M&M, parcourent maintenant les ruines du royaume. Ils déchiffrent les inscriptions anciennes et découvrent les secrets perdus de Valéria, aidant les héros courageux dans leur quête pour restaurer la lumière.

Êtes-vous prêt à devenir cette légende ?

## 🎮 Comment Jouer

### Démarrer le Jeu

#### ⚠️ Important - Serveur Requis

Le jeu utilise des modules JavaScript ES6 qui nécessitent un serveur HTTP pour fonctionner correctement.

**Option 1 - Jouer en ligne (Recommandé):**
- Visitez directement: [https://simondesjardinshogue.github.io/lecoeurdudonjon/](https://simondesjardinshogue.github.io/lecoeurdudonjon/)

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
2. Choisissez une classe (Guerrier, Magicien, Archer, ou Rogue)
3. Cliquez sur "Commencer l'Aventure"

### Fonctionnalités

#### 🗺️ Explorer le Donjon
- Rencontrez des ennemis aléatoires ou des PNJ amicaux
- Combattez pour gagner de l'or et de l'expérience
- Progressez à travers différents niveaux de difficulté
- 70% de chance de rencontrer un monstre, 30% de chance de rencontrer un PNJ

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
- **Objectif** : Vaincre 10 ennemis pour atteindre le Coeur du Dragon

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

2. **Trouver l'adresse IP du serveur** :
   - Windows : `ipconfig` (cherchez "Adresse IPv4")
   - Mac/Linux : `ifconfig` ou `ip addr` (cherchez 192.168.x.x ou 10.x.x.x)

3. **Configurer dans le jeu** :
   - Allez dans Statistiques → Sauvegardes → Paramètres Multijoueur
   - Entrez l'adresse IP et le port (ex: 192.168.1.100:3000)
   - Testez la connexion
   - Les scores seront automatiquement envoyés après chaque combat !

4. **Jouer sur d'autres appareils** :
   - Ouvrez `http://[IP-DU-SERVEUR]:3000` dans le navigateur
   - Les scores sont partagés en temps réel !

📖 **Documentation complète** : [server/README.md](server/README.md)

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
   - Allez sur la page de votre dépôt GitHub (`https://github.com/[votre-nom-utilisateur]/lecoeurdudonjon`)
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
   - Le site sera accessible à : `https://[votre-nom-utilisateur].github.io/lecoeurdudonjon/`
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

## 📜 Licence

MIT License - Libre d'utilisation et de modification

## 🙏 Inspirations

Inspiré par **Legend of the Red Dragon (LORD)**, un jeu BBS classique créé par Seth Able Robinson.
