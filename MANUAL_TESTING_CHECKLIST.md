# Checklist de Test Manuel - Le Coeur du Dragon

Ce document fournit une checklist simple pour tester manuellement "Le Coeur du Dragon" sur différents navigateurs et dispositifs.

## 🖥️ Tests Desktop

### Chrome / Edge (Chromium)

**URL de test:** http://localhost:8000 ou https://simondesjardinshogue.github.io/lecoeurdudragon/

- [ ] Ouvrir le jeu dans Chrome
- [ ] Appuyer F12 pour ouvrir DevTools
- [ ] Vérifier qu'il n'y a pas d'erreurs en rouge dans la Console
- [ ] Cliquer sur le bouton "Commencer l'Aventure"
- [ ] Vérifier que le jeu démarre correctement
- [ ] Tester l'audio (cliquer sur 🔊)
- [ ] Changer de langue (cliquer sur 🇫🇷)
- [ ] Créer un personnage et jouer quelques tours
- [ ] Sauvegarder et recharger la page
- [ ] Vérifier que la sauvegarde est restaurée
- [ ] **Installer la PWA:** Menu → Installer "Le Coeur du Dragon"
- [ ] Tester l'application installée

**Résultat:** ☐ PASS ☐ FAIL  
**Notes:**

---

### Firefox

- [ ] Ouvrir le jeu dans Firefox
- [ ] Appuyer F12 pour ouvrir la Console
- [ ] Vérifier qu'il n'y a pas d'erreurs
- [ ] Tester la création de personnage
- [ ] Tester le gameplay de base
- [ ] Vérifier l'audio
- [ ] Tester la sauvegarde/restauration

**Résultat:** ☐ PASS ☐ FAIL  
**Notes:**

---

### Safari (macOS)

- [ ] Ouvrir le jeu dans Safari
- [ ] Menu Développement → Afficher la Console JavaScript
- [ ] Vérifier qu'il n'y a pas d'erreurs
- [ ] Tester tous les éléments comme dans Chrome
- [ ] Vérifier la compatibilité ES6 modules

**Résultat:** ☐ PASS ☐ FAIL  
**Notes:**

---

## 📱 Tests Mobile

### iPhone / iPad (Safari iOS)

**Important:** Safari sur iOS a des particularités. Suivre ces étapes :

#### Préparation
1. Activer la console web :
   - Réglages → Safari → Avancé → Console Web (activer)
2. Se connecter au même WiFi que le serveur (si local)

#### Tests
- [ ] Ouvrir Safari et naviguer vers l'URL du jeu
- [ ] Vérifier le chargement (pas d'écran blanc)
- [ ] Tester le responsive design (portrait et paysage)
- [ ] Taper sur "Commencer l'Aventure"
- [ ] Vérifier les touch gestures (tap, swipe)
- [ ] Vérifier que le clavier ne cache pas le champ de nom
- [ ] Tester l'audio (nécessite un tap utilisateur)
- [ ] Créer un personnage complet
- [ ] Jouer quelques tours de combat
- [ ] Tester la sauvegarde :
  - [ ] Sauvegarder le jeu
  - [ ] Fermer Safari complètement
  - [ ] Rouvrir et restaurer
- [ ] **Installer la PWA:**
  - [ ] Appuyer sur Partager (icône ↑)
  - [ ] Sélectionner "Sur l'écran d'accueil"
  - [ ] Nommer "Coeur du Dragon"
  - [ ] Ouvrir depuis l'écran d'accueil
  - [ ] Vérifier le mode standalone

#### Tests Multijoueur (optionnel, si serveur disponible)
- [ ] Aller dans Options → Multijoueur
- [ ] Configurer l'IP du serveur (ex: 192.168.1.100:3000)
- [ ] Tester la connexion
- [ ] Vérifier le classement

**Résultat:** ☐ PASS ☐ FAIL  
**Notes:**

---

### Android (Chrome Mobile)

#### Préparation
1. Activer le mode développeur :
   - Paramètres → À propos → Appuyer 7x sur "Numéro de build"
2. Activer le débogage USB
3. Connecter au PC et ouvrir chrome://inspect

#### Tests
- [ ] Ouvrir Chrome sur Android
- [ ] Naviguer vers l'URL du jeu
- [ ] Vérifier le chargement
- [ ] Tester portrait et paysage
- [ ] Tester les touch gestures
- [ ] Créer un personnage
- [ ] Jouer quelques tours
- [ ] Tester l'audio
- [ ] Tester la sauvegarde/restauration
- [ ] **Installer la PWA:**
  - [ ] Menu (⋮) → "Installer l'application"
  - [ ] Ouvrir depuis le lanceur
  - [ ] Vérifier le mode standalone

**Résultat:** ☐ PASS ☐ FAIL  
**Notes:**

---

## 🎮 Test de Gameplay Complet (Tous Dispositifs)

### Scénario Standard

1. **Démarrage**
   - [ ] Page d'accueil affichée correctement
   - [ ] Tous les textes en français
   - [ ] Boutons visibles et cliquables

2. **Création de Personnage**
   - [ ] Entrer un nom (ou utiliser le générateur 🎲)
   - [ ] Sélectionner Masculin ou Féminin
   - [ ] Choisir une race (Humain/Elfe/Nain)
   - [ ] Choisir une classe (Guerrier/Archer/Magicien/Enchanteur)
   - [ ] Cliquer "Commencer l'Aventure"
   - [ ] Vérifier que l'écran principal apparaît

3. **Gameplay de Base**
   - [ ] Cliquer "Explorer la Forêt"
   - [ ] Rencontrer un ennemi
   - [ ] Utiliser "Attaquer"
   - [ ] Utiliser "Défendre"
   - [ ] Vérifier les points de vie
   - [ ] Gagner le combat
   - [ ] Recevoir or et XP

4. **Village**
   - [ ] Cliquer "Retour au Village"
   - [ ] Entrer dans la "Boutique"
   - [ ] Acheter un objet
   - [ ] Vérifier que l'or diminue
   - [ ] Rencontrer un NPC
   - [ ] Se reposer (restaurer PV)

5. **Progression**
   - [ ] Gagner de l'expérience
   - [ ] Monter de niveau
   - [ ] Distribuer les points de stats
   - [ ] Vérifier l'augmentation des stats

6. **Sauvegarde**
   - [ ] Menu → Sauvegarder
   - [ ] Fermer le navigateur/app
   - [ ] Rouvrir
   - [ ] Restaurer la sauvegarde
   - [ ] Vérifier que tout est intact :
     - [ ] Niveau
     - [ ] Or
     - [ ] Équipement
     - [ ] Progression

7. **Options**
   - [ ] Tester le bouton audio 🔊/🔇
   - [ ] Changer de langue 🇫🇷/🇬🇧
   - [ ] Vérifier que l'interface change

---

## 🌐 Test Multijoueur (LAN)

**Prérequis:** Serveur multijoueur lancé sur le réseau local

### Configuration Serveur
```bash
cd server
npm install
npm start
# Noter l'adresse IP affichée (ex: 192.168.1.100:3000)
```

### Test Client
- [ ] Sur le dispositif de test, aller dans Options
- [ ] Cliquer sur "Configuration Multijoueur"
- [ ] Entrer l'adresse IP du serveur
- [ ] Tester la connexion
- [ ] Vérifier "Connecté" apparaît
- [ ] Jouer quelques tours
- [ ] Vérifier que le score est synchronisé
- [ ] Ouvrir le jeu sur un 2e dispositif
- [ ] Vérifier que les deux apparaissent dans le classement
- [ ] Tester la mise à jour en temps réel

**Résultat:** ☐ PASS ☐ FAIL  
**Notes:**

---

## 🔍 Points d'Attention Spécifiques

### Safari iOS/iPadOS
⚠️ **Points critiques:**
- L'audio nécessite une interaction utilisateur (tap)
- LocalStorage peut être limité en navigation privée
- Vérifier que Socket.IO se charge depuis le serveur local
- Relais privé iCloud peut bloquer les connexions LAN

### Chrome Mobile (Android)
⚠️ **Points critiques:**
- PWA nécessite HTTPS (ou localhost)
- Vérifier les permissions audio
- Tester sur différentes tailles d'écran

### Tablettes
⚠️ **Points critiques:**
- Tester les deux orientations
- Vérifier que l'interface n'est pas trop espacée
- Tester avec un clavier externe (si applicable)

---

## 📊 Rapport de Test

### Template

```
DISPOSITIF: [iPhone 12 / Samsung Galaxy S21 / iPad Pro / etc.]
NAVIGATEUR: [Safari 15 / Chrome Mobile 110 / etc.]
OS: [iOS 15.5 / Android 12 / etc.]
DATE: [Date du test]

RÉSULTATS:
✅ Chargement: OK
✅ Responsive: OK
✅ Création personnage: OK
✅ Gameplay: OK
✅ Audio: OK
✅ Sauvegarde: OK
✅ PWA: OK
❌ Multijoueur: Échec - [raison]

PROBLÈMES RENCONTRÉS:
- [Décrire les problèmes]

CAPTURES D'ÉCRAN:
- [Joindre si nécessaire]

RECOMMANDATIONS:
- [Suggestions]
```

---

## ✅ Critères de Validation

Le jeu est considéré comme **validé** sur un dispositif/navigateur si :

- ✅ Page se charge sans erreur
- ✅ Tous les textes sont lisibles
- ✅ Tous les boutons sont cliquables
- ✅ Création de personnage fonctionne
- ✅ Gameplay de base fonctionne
- ✅ Sauvegarde persiste après rechargement
- ✅ Audio peut être activé/désactivé
- ✅ Pas de crash ou blocage

**Optionnel mais recommandé:**
- ☐ PWA installable
- ☐ Multijoueur fonctionnel
- ☐ Changement de langue fonctionne

---

## 📞 Signaler un Problème

Si vous trouvez un problème de compatibilité :

1. Créer un issue sur GitHub
2. Inclure :
   - Navigateur et version
   - Système d'exploitation
   - Étapes pour reproduire
   - Captures d'écran si possible
   - Messages d'erreur de la console

**Lien:** https://github.com/SimonDesjardinsHogue/lecoeurdudragon/issues

---

**Merci d'avoir testé Le Coeur du Dragon ! 🐉**
