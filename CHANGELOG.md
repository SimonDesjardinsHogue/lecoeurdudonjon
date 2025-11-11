# 📝 Journal des Modifications

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Non publié]

### Ajouté
- Infrastructure de projet professionnelle (package.json, .editorconfig)
- Politique de sécurité (SECURITY.md)
- Code de conduite (CODE_OF_CONDUCT.md)
- Guide des contributeurs (CONTRIBUTORS.md)
- Feuille de route (ROADMAP.md)
- Templates d'issues et PR
- Badges professionnels dans README
- Workflow GitHub Actions pour vérifications qualité

## [1.1.0] - 2024-11

### ✨ Nouvelles fonctionnalités
- Progressive Web App (PWA) complète avec installation hors ligne
- Mode multijoueur LAN avec classements partagés en temps réel
- Système de gestes tactiles pour appareils mobiles (swipe pour défendre/fuir)
- Guide d'aide mobile interactif avec bouton flottant
- Système d'événements planifiés (Ruée vers le Trésor, Double XP, etc.)
- Quêtes quotidiennes avec récompenses
- Récompenses de connexion quotidienne
- Système de succès/achievements étendu

### 🎨 Interface et UX
- Interface optimisée pour écrans tactiles (tailles de boutons conformes aux standards)
- Icônes PNG professionnelles avec thème médiéval
- Icônes adaptatives Android (maskable icons)
- Support complet iOS/Apple avec icônes dédiées
- Bannière d'installation PWA
- Indicateurs de connexion réseau
- Animations et particules améliorées

### 🎮 Gameplay
- Système de races de personnages (Humain, Elfe, Nain)
- Système de sexe de personnages (Masculin, Féminin, Non-binaire)
- Équipements spécifiques aux classes (boucliers, livres, carquois)
- Système d'inventaire avec limite de 4 objets
- Commerce de métaux précieux avec le Bijoutier
- Rencontres avec les explorateurs M&M
- Événements aléatoires variés (trésors, pièges, fontaines)

### 🛡️ Combat
- Système d'initiative pour déterminer qui attaque en premier
- Boss avec capacités spéciales uniques
- Système de mana pour les Magiciens
- Compétences spéciales par classe
- Système de défense amélioré

### 🔧 Technique
- Architecture modulaire avec ES6 modules
- Service Worker pour cache et mode hors ligne
- WebSocket pour synchronisation multijoueur
- Sauvegarde automatique avec export/import
- Manifest.json complet pour publication Google Play Store
- Support Safari/iPad amélioré

### 📱 Mobile
- Support des gestes tactiles
- Prévention du zoom accidentel
- Interface responsive adaptée à tous les écrans
- Mode paysage optimisé
- Guide d'aide mobile contextuel

### 🐛 Corrections
- Correction de bugs de compatibilité Safari
- Amélioration de la gestion du cache
- Optimisation des performances
- Correction des problèmes de multijoueur LAN
- Stabilité générale améliorée

---

## [1.0.0] - 2024-10 - Lancement Initial

### 🎮 Fonctionnalités de base
- Système de combat tour par tour
- 20 niveaux de progression
- 30 types d'ennemis
- 5 Boss légendaires
- 3 Classes de personnages (Guerrier, Magicien, Archer)
- Système de commerce et d'équipement
- Statistiques détaillées (7 stats principales)
- Sauvegarde locale dans le navigateur
- Interface médiévale-fantastique
- Système de son et musique

---

## Légende des Types de Changements

- **Ajouté** : Nouvelles fonctionnalités
- **Modifié** : Changements dans les fonctionnalités existantes
- **Déprécié** : Fonctionnalités qui seront bientôt supprimées
- **Supprimé** : Fonctionnalités supprimées
- **Corrigé** : Corrections de bugs
- **Sécurité** : Changements liés à la sécurité

[Non publié]: https://github.com/SimonDesjardinsHogue/lecoeurdudragon/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/SimonDesjardinsHogue/lecoeurdudragon/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/SimonDesjardinsHogue/lecoeurdudragon/releases/tag/v1.0.0
