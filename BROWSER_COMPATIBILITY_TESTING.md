# Guide de Test de Compatibilité Multi-Navigateurs et Multi-Dispositifs

## 📋 Vue d'Ensemble

Ce document décrit la stratégie et les procédures de test pour "Le Coeur du Dragon" sur différents navigateurs et dispositifs.

## 🎯 Objectifs

- Assurer la compatibilité avec tous les navigateurs modernes
- Vérifier le fonctionnement sur tablettes et téléphones
- Valider l'expérience PWA (Progressive Web App)
- Garantir l'accessibilité et la performance

## 🌐 Navigateurs Cibles

### Desktop
- ✅ **Chrome** 61+ (Chromium)
- ✅ **Firefox** 60+
- ✅ **Safari** 11+ (macOS)
- ✅ **Edge** 79+ (Chromium)

### Mobile & Tablette
- ✅ **Safari iOS/iPadOS** 11+
- ✅ **Chrome Mobile** (Android)
- ✅ **Firefox Mobile** (Android)
- ✅ **Samsung Internet**

## 📱 Dispositifs de Test

### Résolutions Testées

| Dispositif | Résolution | Orientation |
|------------|------------|-------------|
| Desktop | 1920x1080 | Paysage |
| Laptop | 1366x768 | Paysage |
| Tablette | 768x1024 | Portrait |
| Tablette | 1024x768 | Paysage |
| Mobile | 375x667 | Portrait |
| Mobile | 667x375 | Paysage |

### Dispositifs Physiques Recommandés

**Mobile:**
- iPhone SE (2020+)
- iPhone 12/13/14/15
- Samsung Galaxy S20+
- Google Pixel 5+

**Tablettes:**
- iPad (8e génération+)
- iPad Air
- iPad Pro
- Samsung Galaxy Tab S6+

## 🧪 Tests Automatisés (Playwright)

### Installation

```bash
# Installer les dépendances
npm install --save-dev playwright

# Installer les navigateurs
npx playwright install chromium firefox webkit

# Installer http-server pour les tests locaux
npm install --save-dev http-server
```

### Exécution des Tests

```bash
# Démarrer le serveur de test
npm start &

# Exécuter tous les tests
npx playwright test tests/browser-compatibility.test.js

# Exécuter avec interface graphique
npx playwright test tests/browser-compatibility.test.js --ui

# Exécuter sur un navigateur spécifique
npx playwright test tests/browser-compatibility.test.js --project=chromium
npx playwright test tests/browser-compatibility.test.js --project=firefox
npx playwright test tests/browser-compatibility.test.js --project=webkit

# Exécuter en mode debug
npx playwright test tests/browser-compatibility.test.js --debug

# Générer un rapport
npx playwright test tests/browser-compatibility.test.js --reporter=html
```

### Catégories de Tests

#### 1. Chargement de la Page
- ✅ Page se charge sans erreurs critiques
- ✅ Éléments principaux visibles
- ✅ Modules ES6 chargés correctement

#### 2. Responsive Design
- ✅ Affichage sur tous les viewports
- ✅ Touch gestures sur mobile
- ✅ Captures d'écran pour validation visuelle

#### 3. Création de Personnage
- ✅ Remplissage du formulaire
- ✅ Sélection genre/race/classe
- ✅ Générateur de nom aléatoire
- ✅ Démarrage du jeu

#### 4. LocalStorage
- ✅ Disponibilité de LocalStorage
- ✅ Sauvegarde des données
- ✅ Récupération des sauvegardes

#### 5. Audio
- ✅ Initialisation du gestionnaire audio
- ✅ Bouton mute/unmute fonctionnel

#### 6. Internationalisation
- ✅ Sélecteur de langue visible
- ✅ Changement de langue

#### 7. Performance
- ✅ Temps de chargement < 3s
- ✅ Pas de fuite mémoire

#### 8. PWA
- ✅ Manifeste accessible
- ✅ Service Worker enregistré
- ✅ Icônes présentes

#### 9. Sécurité
- ✅ Content Security Policy
- ✅ Protection XSS

## 🔍 Tests Manuels

### Checklist de Test Mobile

#### iPhone/iPad (Safari)
- [ ] Page se charge correctement
- [ ] Pas d'erreurs dans la console (Réglages → Safari → Avancé → Console Web)
- [ ] Touch gestures fonctionnent (swipe, tap, long press)
- [ ] Clavier virtuel ne cache pas le contenu important
- [ ] PWA installable (Partager → Ajouter à l'écran d'accueil)
- [ ] Orientation portrait et paysage fonctionnent
- [ ] Audio fonctionne après interaction utilisateur
- [ ] Multiplayer peut se connecter au serveur LAN
- [ ] Sauvegarde persiste après fermeture

#### Android (Chrome Mobile)
- [ ] Page se charge correctement
- [ ] Pas d'erreurs dans DevTools (chrome://inspect)
- [ ] Touch gestures fonctionnent
- [ ] PWA installable (Menu → Installer l'application)
- [ ] Notifications fonctionnent (si utilisées)
- [ ] Audio fonctionne
- [ ] Connexion multijoueur stable
- [ ] Sauvegarde persiste

### Checklist de Test Desktop

#### Chrome
- [ ] Page se charge sans erreurs (F12 → Console)
- [ ] Tous les modules ES6 chargés
- [ ] LocalStorage fonctionne
- [ ] Audio démarre après interaction
- [ ] Raccourcis clavier fonctionnent
- [ ] Multijoueur se connecte
- [ ] PWA installable

#### Firefox
- [ ] Page se charge sans erreurs (F12 → Console)
- [ ] Modules ES6 compatibles
- [ ] IndexedDB/LocalStorage OK
- [ ] Audio Web API compatible
- [ ] WebSocket fonctionne pour multijoueur

#### Safari (macOS)
- [ ] Page se charge (Développement → Console)
- [ ] Modules ES6 supportés
- [ ] LocalStorage accessible
- [ ] Audio démarre correctement
- [ ] WebSocket stable

#### Edge
- [ ] Compatible avec tests Chrome (base Chromium)
- [ ] Pas de problèmes spécifiques Edge

## 🎮 Test de Gameplay Complet

### Scénario de Test Standard

1. **Démarrage**
   - [ ] Ouvrir le jeu
   - [ ] Vérifier la page d'accueil
   - [ ] Activer l'audio

2. **Création de Personnage**
   - [ ] Entrer un nom
   - [ ] Sélectionner genre
   - [ ] Sélectionner race
   - [ ] Sélectionner classe
   - [ ] Commencer l'aventure

3. **Gameplay de Base**
   - [ ] Explorer la forêt
   - [ ] Combattre un ennemi
   - [ ] Utiliser attaque/défense/fuite
   - [ ] Gagner de l'expérience
   - [ ] Gagner de l'or

4. **Village**
   - [ ] Visiter le village
   - [ ] Entrer dans la boutique
   - [ ] Acheter un objet
   - [ ] Rencontrer un NPC
   - [ ] Se reposer

5. **Sauvegarde**
   - [ ] Menu → Sauvegarder
   - [ ] Recharger la page
   - [ ] Restaurer la sauvegarde
   - [ ] Vérifier que tout est restauré

6. **Multijoueur (si disponible)**
   - [ ] Configurer le serveur
   - [ ] Se connecter
   - [ ] Vérifier le classement
   - [ ] Synchronisation en temps réel

## 🐛 Problèmes Connus et Solutions

### Safari iOS/iPadOS

**Problème:** Connexion multijoueur échoue
- **Solution:** Voir `SAFARI_FIX_SUMMARY.md`
- Utiliser polling avant WebSocket
- Charger Socket.IO depuis le serveur local

**Problème:** Audio ne démarre pas
- **Solution:** Nécessite interaction utilisateur (tap/click)
- Bouton audio toujours affiché

**Problème:** LocalStorage quota dépassé
- **Solution:** Limiter la taille des sauvegardes
- Offrir export/import de sauvegardes

### Chrome Mobile

**Problème:** Viewport trop zoomed
- **Solution:** `<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">`

**Problème:** PWA ne s'installe pas
- **Solution:** Vérifier le manifeste et HTTPS (ou localhost)

### Firefox

**Problème:** ES6 modules en mode strict
- **Solution:** Toujours utiliser `'use strict'` dans les modules

## 📊 Rapport de Test

### Template de Rapport

```markdown
# Rapport de Test - [Navigateur/Dispositif]

**Date:** [Date du test]
**Testeur:** [Nom]
**Version:** [Version du jeu]
**Navigateur:** [Nom et version]
**OS:** [Système d'exploitation]

## Résultats

### ✅ Tests Réussis
- [Liste des fonctionnalités qui fonctionnent]

### ❌ Tests Échoués
- [Liste des problèmes rencontrés]

### ⚠️ Avertissements
- [Points d'attention, performances, etc.]

## Captures d'Écran
[Joindre captures d'écran pertinentes]

## Recommandations
[Suggestions d'amélioration]
```

## 🚀 Automatisation CI/CD

### GitHub Actions

Créer `.github/workflows/browser-tests.yml`:

```yaml
name: Browser Compatibility Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npx playwright install --with-deps
      - run: npm start &
      - run: sleep 5
      - run: npx playwright test tests/browser-compatibility.test.js
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## 📝 Checklist de Publication

Avant chaque release:

- [ ] Exécuter tous les tests automatisés
- [ ] Tester sur au moins 3 navigateurs desktop
- [ ] Tester sur au moins 2 dispositifs mobiles
- [ ] Vérifier PWA sur mobile
- [ ] Tester le multijoueur
- [ ] Valider les performances
- [ ] Vérifier l'accessibilité
- [ ] Documenter les problèmes connus

## 🔗 Ressources

- [Playwright Documentation](https://playwright.dev/)
- [Can I Use](https://caniuse.com/) - Vérifier la compatibilité des fonctionnalités
- [BrowserStack](https://www.browserstack.com/) - Tests sur vrais dispositifs
- [MDN Web Docs](https://developer.mozilla.org/) - Référence Web

## 📞 Support

Pour signaler des problèmes de compatibilité:
- Ouvrir un issue sur GitHub
- Inclure: navigateur, version, OS, captures d'écran
- Fournir les étapes de reproduction
