# 🍎 Guide de Publication sur Apple App Store et PWA iOS

Ce guide détaillé explique comment publier "Le Coeur du Dragon" sur l'Apple App Store et comment optimiser l'expérience PWA pour iOS/Safari.

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Option 1 : Progressive Web App (PWA) pour iOS](#option-1--progressive-web-app-pwa-pour-ios)
3. [Option 2 : Apple App Store via Wrapper Natif](#option-2--apple-app-store-via-wrapper-natif)
4. [Différences avec Google Play](#différences-avec-google-play)
5. [Améliorations Recommandées](#améliorations-recommandées)
6. [Requirements Techniques](#requirements-techniques)
7. [Guide Pas à Pas](#guide-pas-à-pas)
8. [Résolution de Problèmes](#résolution-de-problèmes)

---

## 🎯 Vue d'ensemble

"Le Coeur du Dragon" peut être déployé sur iOS de deux façons principales :

### Option 1 : PWA (Progressive Web App) pour iOS/Safari
✅ **Recommandé pour commencer**
- Installation via "Ajouter à l'écran d'accueil" dans Safari
- Fonctionne comme une app native
- Mises à jour instantanées
- Pas besoin d'approbation Apple
- **Gratuit et immédiat**
- **Fonctionne déjà** (avec optimisations à venir)

### Option 2 : Apple App Store via Wrapper
📱 **Pour une distribution maximale**
- Présence sur l'App Store officiel
- Découverte par nouveaux utilisateurs
- Crédibilité accrue
- Possibilité de monétisation IAP
- Nécessite un compte développeur Apple (99 USD/an)
- Nécessite un Mac pour build et soumission
- Processus de révision Apple (1-7 jours)

---

## 📲 Option 1 : Progressive Web App (PWA) pour iOS

### État Actuel

Le jeu est déjà compatible iOS/Safari grâce aux améliorations récentes :
- ✅ Fixes Safari/iPad pour connexions réseau
- ✅ Icons Apple Touch (120x120, 180x180)
- ✅ Meta tags Apple dans `index.html`
- ✅ Interface responsive
- ✅ Service Worker fonctionnel
- ✅ Manifest.json configuré

### Optimisations Recommandées

#### 1. Icônes Apple Touch Complètes

**État actuel** :
```
/assets/icons/apple-touch-icon-120x120.png ✅
/assets/icons/apple-touch-icon-180x180.png ✅
```

**À ajouter** :
```bash
# Créer les tailles manquantes
/assets/icons/apple-touch-icon-167x167.png  # iPad Pro 10.5"
/assets/icons/apple-touch-icon-1024x1024.png  # App Store / iTunes
```

**Comment créer** :
1. Utiliser un outil comme [RealFaviconGenerator](https://realfavicongenerator.net/)
2. Ou redimensionner l'icon existante avec ImageMagick :
   ```bash
   convert apple-touch-icon-180x180.png -resize 167x167 apple-touch-icon-167x167.png
   convert apple-touch-icon-180x180.png -resize 1024x1024 apple-touch-icon-1024x1024.png
   ```

**Mise à jour dans `index.html`** :
```html
<!-- Apple Touch Icons - Ajouter ces lignes -->
<link rel="apple-touch-icon" sizes="167x167" href="/assets/icons/apple-touch-icon-167x167.png">
<link rel="apple-touch-icon" sizes="1024x1024" href="/assets/icons/apple-touch-icon-1024x1024.png">
```

---

#### 2. Splash Screens iOS

Les splash screens améliorent l'expérience au lancement de la PWA depuis l'écran d'accueil.

**Pourquoi** :
- Sans splash screen : écran blanc pendant le chargement
- Avec splash screen : image de marque pendant le chargement

**Tailles requises pour couverture complète** :

```html
<!-- Dans <head> de index.html -->

<!-- iPhone 14 Pro Max, 13 Pro Max, 12 Pro Max -->
<link rel="apple-touch-startup-image" 
      media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" 
      href="/assets/splash/iphone-14-pro-max-portrait.png">
<link rel="apple-touch-startup-image" 
      media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" 
      href="/assets/splash/iphone-14-pro-max-landscape.png">

<!-- iPhone 14 Plus, 13, 12 -->
<link rel="apple-touch-startup-image" 
      media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" 
      href="/assets/splash/iphone-14-portrait.png">
<link rel="apple-touch-startup-image" 
      media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" 
      href="/assets/splash/iphone-14-landscape.png">

<!-- iPhone SE (3rd gen), 8, 7, 6s -->
<link rel="apple-touch-startup-image" 
      media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" 
      href="/assets/splash/iphone-se-portrait.png">
<link rel="apple-touch-startup-image" 
      media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" 
      href="/assets/splash/iphone-se-landscape.png">

<!-- iPad Pro 12.9" -->
<link rel="apple-touch-startup-image" 
      media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" 
      href="/assets/splash/ipad-pro-12-9-portrait.png">
<link rel="apple-touch-startup-image" 
      media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" 
      href="/assets/splash/ipad-pro-12-9-landscape.png">

<!-- iPad Pro 11" -->
<link rel="apple-touch-startup-image" 
      media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" 
      href="/assets/splash/ipad-pro-11-portrait.png">
<link rel="apple-touch-startup-image" 
      media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" 
      href="/assets/splash/ipad-pro-11-landscape.png">

<!-- iPad 10th gen, Air 4/5 -->
<link rel="apple-touch-startup-image" 
      media="(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" 
      href="/assets/splash/ipad-air-portrait.png">
<link rel="apple-touch-startup-image" 
      media="(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" 
      href="/assets/splash/ipad-air-landscape.png">

<!-- iPad Mini 6th gen -->
<link rel="apple-touch-startup-image" 
      media="(device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" 
      href="/assets/splash/ipad-mini-portrait.png">
<link rel="apple-touch-startup-image" 
      media="(device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" 
      href="/assets/splash/ipad-mini-landscape.png">
```

**Générer les splash screens** :

Option A - Outil en ligne :
- [Appscope Splash Screen Generator](https://appsco.pe/developer/splash-screens)
- Upload votre icône, télécharger toutes les tailles

Option B - Script personnalisé :
```javascript
// generate-splash-screens.js
const sharp = require('sharp');

const sizes = [
  { name: 'iphone-14-pro-max-portrait', width: 1290, height: 2796 },
  { name: 'iphone-14-pro-max-landscape', width: 2796, height: 1290 },
  { name: 'iphone-14-portrait', width: 1170, height: 2532 },
  { name: 'iphone-14-landscape', width: 2532, height: 1170 },
  // ... autres tailles
];

async function generateSplashScreens() {
  for (const size of sizes) {
    await sharp({
      create: {
        width: size.width,
        height: size.height,
        channels: 4,
        background: { r: 26, g: 26, b: 26, alpha: 1 } // #1a1a1a
      }
    })
    .composite([
      {
        input: 'logo.png',
        gravity: 'center'
      }
    ])
    .png()
    .toFile(`assets/splash/${size.name}.png`);
  }
}

generateSplashScreens();
```

---

#### 3. Optimisations Meta Tags

**État actuel dans `index.html`** :
```html
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Coeur du Dragon">
```

**Vérifications** :
- ✅ `apple-mobile-web-app-capable="yes"` - Active le mode standalone
- ✅ `apple-mobile-web-app-status-bar-style` - Contrôle la barre de statut
- ✅ `apple-mobile-web-app-title` - Nom sous l'icône

**Options pour status-bar-style** :
- `default` - Blanc avec texte noir
- `black` - Noir avec texte blanc
- `black-translucent` - ✅ Recommandé - Transparent avec texte blanc

**Aucun changement nécessaire** - Déjà optimal ✅

---

#### 4. Service Worker - Compatibilité iOS

Safari supporte les Service Workers depuis iOS 11.3 (2018).

**Vérifications dans `sw.js`** :

✅ **Cache API** - Supportée
✅ **Fetch API** - Supportée
✅ **Background Sync** - ❌ Non supportée sur iOS
✅ **Push Notifications** - ⚠️ Limitées sur iOS (iOS 16.4+, expérimental)

**Recommandations** :
1. Ne pas utiliser Background Sync (déjà le cas ✅)
2. Notifications push - implémenter avec détection de support
3. Tester régulièrement sur Safari iOS réel

**Test rapide** :
```javascript
// Dans la console Safari iOS
if ('serviceWorker' in navigator) {
  console.log('Service Worker supporté ✅');
} else {
  console.log('Service Worker non supporté ❌');
}
```

---

#### 5. Viewport et Responsive

**État actuel** :
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
```

**Analyse** :
- ✅ `width=device-width` - Largeur adaptée
- ✅ `initial-scale=1.0` - Zoom initial
- ✅ `maximum-scale=1.0, user-scalable=no` - Désactive zoom (comportement app)
- ✅ `viewport-fit=cover` - Support iPhone X+ notch

**Parfait pour iOS** - Aucun changement nécessaire ✅

---

#### 6. Documentation Utilisateur

Créer un guide simple pour installer la PWA sur iOS.

**Créer** : `/docs/install-ios.md`

```markdown
# 📱 Installer Le Coeur du Dragon sur iPhone/iPad

## Installation

1. **Ouvrir Safari** sur votre iPhone ou iPad
2. **Aller sur** : https://simondesjardinshogue.github.io/lecoeurdudragon/
3. **Toucher l'icône Partager** (carré avec flèche vers le haut) en bas de l'écran
4. **Faire défiler** et toucher "Sur l'écran d'accueil"
5. **Toucher "Ajouter"** en haut à droite

## Utilisation

- L'icône apparaît sur votre écran d'accueil
- Touchez l'icône pour lancer le jeu
- Le jeu s'ouvre en plein écran, comme une app native
- Fonctionne hors ligne après la première ouverture

## Compatibilité

- iOS 11.3 ou plus récent
- Safari uniquement (Chrome iOS ne supporte pas l'installation PWA)
- iPhone et iPad
```

---

### Installation PWA iOS - Guide Complet

#### Pour l'Utilisateur

**Étapes d'installation** :
1. Ouvrir Safari (navigateur natif iOS)
2. Naviguer vers `https://simondesjardinshogue.github.io/lecoeurdudragon/`
3. Toucher bouton "Partager" (icône carré avec flèche)
4. Sélectionner "Sur l'écran d'accueil"
5. Confirmer en touchant "Ajouter"

**Résultat** :
- Icône sur écran d'accueil
- Ouverture en plein écran (sans barre Safari)
- Fonctionne hors ligne
- Se comporte comme une app native

#### Pour le Développeur

**Vérifier que l'installation est proposée** :
```javascript
// Pas d'événement beforeinstallprompt sur iOS
// iOS gère l'installation via le menu Safari automatiquement
// Vérifier dans Safari : Share > Add to Home Screen devrait être disponible
```

**Détecter si lancé depuis écran d'accueil** :
```javascript
function isStandalone() {
  return ('standalone' in navigator) && navigator.standalone;
}

if (isStandalone()) {
  console.log('App lancée depuis écran d\'accueil ✅');
} else {
  console.log('App lancée dans navigateur');
}
```

---

## 📱 Option 2 : Apple App Store via Wrapper Natif

### Prérequis

**Absolument nécessaires** :
- ✅ Mac (MacBook, iMac, Mac Mini, etc.) avec macOS 12+ recommandé
- ✅ Compte développeur Apple (99 USD/an)
- ✅ Xcode 14+ (gratuit sur Mac App Store)
- ✅ Connaissance basique de Xcode (ou volonté d'apprendre)

**Optionnel mais recommandé** :
- 🔶 iPhone/iPad physique pour tests
- 🔶 Espace disque : ~50 GB (Xcode + simulateurs)

---

### Choix du Framework

#### Option A : PWABuilder (Le Plus Simple)

**Avantages** :
- ⚡ Génération automatique du projet Xcode
- 🎯 Configuré spécifiquement pour PWA
- 🆓 Gratuit et open source
- 📚 Bien documenté
- 🚀 Rapide à mettre en place

**Inconvénients** :
- ⚠️ Moins de contrôle sur le code natif
- ⚠️ Personnalisation limitée
- ⚠️ Pas d'accès APIs natives complexes

**Quand utiliser** :
✅ Première publication App Store
✅ Pas besoin de fonctionnalités natives avancées
✅ Veux résultat rapide

**Guide PWABuilder** :

1. **Générer le package** :
   ```
   https://www.pwabuilder.com/
   ```
   - Entrer URL : `https://simondesjardinshogue.github.io/lecoeurdudragon/`
   - Cliquer "Start"
   - Aller dans "Publish" tab
   - Sélectionner "iOS"
   - Télécharger package

2. **Ouvrir dans Xcode** :
   ```bash
   cd PWABuilder-iOS
   open PWABuilder.xcodeproj
   ```

3. **Configuration** :
   - Bundle ID : `com.simondesjardinshogue.lecoeurdudragon`
   - Display Name : `Le Coeur du Dragon`
   - Version : `1.1.0`
   - Build : `1`

4. **Build et Test** :
   - Sélectionner simulateur iPhone
   - Cmd + R pour build et run
   - Tester le jeu

---

#### Option B : Capacitor (Recommandé - Plus Flexible)

**Avantages** :
- 🎯 Contrôle total du projet
- 🔌 Accès à toutes les APIs natives iOS
- 🔄 Mises à jour faciles
- 📦 Plugins disponibles (camera, storage, etc.)
- 🏢 Utilisé par de grandes entreprises (Ionic, etc.)

**Inconvénients** :
- 📚 Plus de configuration initiale
- 🧠 Courbe d'apprentissage légèrement plus élevée

**Quand utiliser** :
✅ Besoin de fonctionnalités natives avancées
✅ Veux contrôle complet
✅ Plan d'ajouter features natives futures
✅ Distribution Android + iOS

**Guide Capacitor** :

1. **Installation** :
   ```bash
   cd /home/runner/work/lecoeurdudragon/lecoeurdudragon
   
   # Installer Capacitor
   npm install @capacitor/core @capacitor/cli
   npm install @capacitor/ios
   ```

2. **Initialisation** :
   ```bash
   npx cap init
   ```
   
   Répondre aux questions :
   ```
   App name: Le Coeur du Dragon
   App Package ID: com.simondesjardinshogue.lecoeurdudragon
   ```

3. **Configuration** `capacitor.config.json` :
   ```json
   {
     "appId": "com.simondesjardinshogue.lecoeurdudragon",
     "appName": "Le Coeur du Dragon",
     "webDir": ".",
     "bundledWebRuntime": false,
     "server": {
       "androidScheme": "https"
     },
     "ios": {
       "contentInset": "automatic",
       "scheme": "LeCoeurDuDragon"
     }
   }
   ```

4. **Ajouter plateforme iOS** :
   ```bash
   npx cap add ios
   ```

5. **Copier fichiers web** :
   ```bash
   npx cap copy ios
   ```

6. **Ouvrir dans Xcode** :
   ```bash
   npx cap open ios
   ```

7. **Configuration Xcode** :
   - Signing & Capabilities :
     - Team : Sélectionner votre compte développeur
     - Bundle Identifier : `com.simondesjardinshogue.lecoeurdudragon`
   
   - General :
     - Display Name : `Le Coeur du Dragon`
     - Version : `1.1.0`
     - Build : `1`
     - Deployment Target : iOS 13.0 minimum

8. **Build et Test** :
   - Cmd + B pour build
   - Cmd + R pour run
   - Tester sur simulateur

---

### Configuration iOS Spécifique

#### Info.plist

**Fichier** : `ios/App/App/Info.plist` (Capacitor) ou généré automatiquement (PWABuilder)

**Vérifications clés** :
```xml
<key>CFBundleDisplayName</key>
<string>Coeur du Dragon</string>

<key>CFBundleIdentifier</key>
<string>com.simondesjardinshogue.lecoeurdudragon</string>

<key>CFBundleShortVersionString</key>
<string>1.1.0</string>

<key>CFBundleVersion</key>
<string>1</string>

<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <false/>
</dict>

<key>UIRequiredDeviceCapabilities</key>
<array>
    <string>arm64</string>
</array>

<key>UISupportedInterfaceOrientations</key>
<array>
    <string>UIInterfaceOrientationPortrait</string>
    <string>UIInterfaceOrientationLandscapeLeft</string>
    <string>UIInterfaceOrientationLandscapeRight</string>
</array>

<key>UILaunchStoryboardName</key>
<string>LaunchScreen</string>
```

---

### Assets pour App Store

#### 1. Icône de l'Application

**Requis** : 1024x1024 PNG

**Spécifications** :
- Format : PNG
- Espace colorimétrique : RGB (pas CMYK)
- Pas de transparence (alpha channel)
- Pas de coins arrondis (iOS les ajoute automatiquement)
- Résolution : 72 DPI minimum

**Créer** :
```bash
# Si vous avez ImageMagick
convert apple-touch-icon-180x180.png -resize 1024x1024 -background "#1a1a1a" -flatten app-store-icon.png
```

**Où** : `ios/App/App/Assets.xcassets/AppIcon.appiconset/`

---

#### 2. Screenshots

**Requirements officiels Apple (2024)** :

**iPhone** :
- **6.7" Display** (iPhone 14 Pro Max, 13 Pro Max, 12 Pro Max) :
  - Portrait : 1290 x 2796 pixels
  - Landscape : 2796 x 1290 pixels
  - Minimum : 2 screenshots
  - Maximum : 10 screenshots

- **6.5" Display** (iPhone 11 Pro Max, XS Max) :
  - Portrait : 1284 x 2778 pixels
  - Landscape : 2778 x 1284 pixels

- **5.5" Display** (iPhone 8 Plus, 7 Plus) :
  - Portrait : 1242 x 2208 pixels
  - Landscape : 2208 x 1242 pixels

**iPad** (si support iPad) :
- **12.9" iPad Pro** :
  - Portrait : 2048 x 2732 pixels
  - Landscape : 2732 x 2048 pixels

**Screenshots suggérés** :
1. Menu principal / Création de personnage
2. Combat contre ennemi
3. Combat contre Boss
4. Boutique / Équipement
5. Statistiques du personnage
6. Village / NPCs
7. Victoire / Progression
8. Écran multijoueur (si applicable)

**Comment créer** :

Option A - Simulateur Xcode :
```bash
# Lancer simulateur
xcrun simctl list devices

# Prendre screenshot
# Dans simulateur : Cmd + S
# Sauvegarde automatique sur Desktop
```

Option B - Appareil physique :
```bash
# Connecter iPhone/iPad
# Dans Xcode : Window > Devices and Simulators
# Sélectionner appareil
# Cliquer "Take Screenshot"
```

Option C - Outils :
- [Screely](https://www.screely.com/) - Ajouter mockup device
- [Mockuphone](https://mockuphone.com/) - Templates devices

---

#### 3. Vidéo Preview (Optionnel mais Recommandé)

**Spécifications** :
- Format : .mov, .mp4, .m4v
- Résolution : Identique aux screenshots (ex: 1290 x 2796)
- Durée : 15-30 secondes
- Taille max : 500 MB
- Frame rate : 25-30 FPS
- Codec : H.264 ou HEVC

**Contenu suggéré** :
```
0-3s : Logo + Titre "Le Coeur du Dragon"
3-8s : Création de personnage (rapide)
8-15s : Combat dynamique
15-20s : Exploration village
20-25s : Boss fight (climax)
25-30s : Call to action "Télécharger maintenant"
```

**Créer avec** :
- iMovie (gratuit sur Mac)
- Final Cut Pro
- Screen recording + montage

---

### Compte Développeur Apple

#### Inscription

1. **Aller sur** : https://developer.apple.com/programs/enroll/
2. **Se connecter** avec Apple ID
3. **Choisir** : Individual (personnel) ou Organization (entreprise)
4. **Accepter** Apple Developer Agreement
5. **Payer** 99 USD (carte bancaire ou Apple Pay)
6. **Attendre** approbation (généralement 24-48h)

#### Après Approbation

1. **Créer certificats** :
   - Xcode > Preferences > Accounts
   - Ajouter Apple ID
   - "Manage Certificates"
   - Créer "Apple Development" et "Apple Distribution"

2. **Créer App ID** :
   - Developer Portal > Certificates, IDs & Profiles
   - Identifiers > App IDs
   - Register : `com.simondesjardinshogue.lecoeurdudragon`

3. **Créer Provisioning Profiles** :
   - Development (pour tester)
   - Distribution (pour App Store)

**Note** : Xcode peut gérer automatiquement la plupart de ces étapes.

---

### App Store Connect

#### Créer l'App

1. **Aller sur** : https://appstoreconnect.apple.com/
2. **My Apps** > **+** > **New App**
3. **Remplir** :
   ```
   Platforms: iOS
   Name: Le Coeur du Dragon
   Primary Language: French (France)
   Bundle ID: com.simondesjardinshogue.lecoeurdudragon
   SKU: lecoeurdudragon-ios-2024
   User Access: Full Access
   ```

#### Métadonnées

**App Information** :
```
Name: Le Coeur du Dragon
Subtitle: RPG épique médiéval-fantastique
Category: Games > Role-Playing
Secondary Category: Games > Adventure
```

**Description** (4000 caractères max) :
```
⚔️ Entrez dans le royaume légendaire de Valéria ⚔️

Le Coeur du Dragon est un RPG épique qui rend hommage aux grands classiques du genre, inspiré par Legend of the Red Dragon. Choisissez votre destin, forgez votre légende !

🎭 CRÉEZ VOTRE HÉROS
• 3 classes uniques : Guerrier, Mage, Voleur
• Personnalisation complète
• 24 niveaux de progression
• Montée en puissance satisfaisante

⚔️ COMBATS ÉPIQUES
• Système de combat stratégique
• 4 Boss légendaires redoutables
• Dizaines d'ennemis variés
• Butin et équipement

🏰 EXPLOREZ VALÉRIA
• Village vivant avec marchands
• Taverne, forge, temple
• Quêtes quotidiennes
• Événements aléatoires

🌟 FONCTIONNALITÉS
• Mode hors ligne complet
• Sauvegarde automatique
• Multijoueur asynchrone
• Achievements et progression
• Interface intuitive

🎮 GAMEPLAY ADDICTIF
• Sessions courtes ou longues
• Difficulté progressive
• Rejouabilité élevée
• Équilibrage soigné

Téléchargez maintenant et devenez le héros dont Valéria a besoin !
```

**Keywords** (100 caractères max, séparés par virgule) :
```
RPG,médiéval,dragon,aventure,héros,combat,boss,quête,fantasy,jeu de rôle
```

**Support URL** :
```
https://github.com/SimonDesjardinsHogue/lecoeurdudragon/issues
```

**Marketing URL** (optionnel) :
```
https://simondesjardinshogue.github.io/lecoeurdudragon/
```

**Privacy Policy URL** :
```
https://simondesjardinshogue.github.io/lecoeurdudragon/privacy-policy.html
```

**Copyright** :
```
© 2024 Simon Desjardins Hogue
```

---

#### Rating

**Questionnaire de contenu** :

- Violence de type cartoon ou fantasy : **Peu fréquent/Modéré**
- Contenu sexuel : **Aucun**
- Grossièreté ou humour vulgaire : **Aucun**
- Horreur/Peur : **Peu fréquent/Modéré**
- Contenu médical/Traitement : **Aucun**
- Alcool, tabac, drogue : **Peu fréquent/Modéré** (taverne)
- Jeux d'argent simulés : **Aucun**
- Thèmes provocants/adultes : **Aucun**
- Contenu à caractère sexuel : **Aucun**
- Jeux d'argent : **Aucun**

**Rating estimé** : **9+** (Mild Fantasy Violence)

---

#### Prix

**Prix de vente** : **$4.99 CAD**

**Détails importants** :
- ✅ **Aucun coût supplémentaire** - pas d'achats in-app, pas d'abonnement
- 🎮 **Jeu complet** - tout le contenu est inclus dans le prix d'achat
- 👨‍👩‍👧‍👦 **Mode LAN familial** - jouez en réseau local avec votre famille pour du plaisir sans frais additionnels
- 💝 **Achat unique** - payez une fois, jouez pour toujours

**Options alternatives** :
- Gratuit avec publicités
- Freemium avec achats in-app

**Note** : Le prix de $4.99 CAD permet d'équilibrer le profit tout en maintenant l'accessibilité pour les joueurs.

---

### Build et Soumission

#### Build dans Xcode

1. **Préparer le build** :
   ```
   Product > Scheme > Edit Scheme
   Run > Build Configuration > Release
   ```

2. **Sélectionner destination** :
   ```
   Product > Destination > Any iOS Device (arm64)
   ```

3. **Archiver** :
   ```
   Product > Archive
   ```
   
   Attendre la fin (peut prendre 5-10 minutes)

4. **Dans Organizer** :
   - Sélectionner l'archive
   - "Distribute App"
   - "App Store Connect"
   - "Upload"
   - Suivre l'assistant

#### TestFlight (Optionnel mais Recommandé)

**Pourquoi** :
- Tester sur vrais appareils
- Partager avec beta testeurs
- Collecter feedback avant publication

**Comment** :
1. Upload build (étapes ci-dessus)
2. Dans App Store Connect > TestFlight
3. Ajouter testeurs (email)
4. Les testeurs reçoivent invitation
5. Téléchargent via app TestFlight
6. Donnent feedback

#### Soumission pour Révision

1. **Dans App Store Connect** :
   - Version Information > Build > Sélectionner build uploadé
   - Vérifier toutes les métadonnées
   - Upload screenshots
   - Upload vidéo preview (optionnel)

2. **Compliance** :
   - Encryption : Non (pas de crypto forte)
   - Third-party content : Non
   - Advertising identifier : Non (sauf si pub)

3. **Soumettre** :
   - "Add for Review"
   - Confirmer

4. **Attendre révision** :
   - Généralement : 24-48 heures
   - Maximum : 7 jours
   - Statut : "In Review"

5. **Après approbation** :
   - Statut : "Pending Developer Release"
   - Ou publication automatique si configuré

---

## 🔄 Différences avec Google Play

| Aspect | Apple App Store | Google Play Store |
|--------|----------------|-------------------|
| **Coût annuel** | 99 USD/an | 25 USD (unique) |
| **Matériel requis** | Mac obligatoire | Windows/Mac/Linux |
| **IDE requis** | Xcode (Mac only) | Android Studio |
| **Délai révision** | 1-7 jours (moy. 24-48h) | 2-3 jours |
| **Taux de rejet** | ~30-40% | ~10% |
| **Processus** | Plus strict | Plus permissif |
| **PWA alternative** | Add to Home Screen | TWA (natif) |
| **Wrapper** | Requis pour App Store | TWA intégré |
| **Distribution Beta** | TestFlight (intégré) | Google Play Beta |
| **Paiement IAP** | 30% (15% an 2+) | 30% (15% an 2+) |
| **Politique** | Stricte | Modérée |

---

## 🎯 Recommandation par Scénario

### Scénario 1 : Budget Limité
**Recommandation** : PWA iOS seule
- Gratuit
- Rapide
- Fonctionne immédiatement
- Mises à jour instantanées

### Scénario 2 : Pas de Mac
**Recommandation** : PWA iOS seule ou louer Mac cloud
- PWA fonctionne sur tous OS
- Ou services cloud (MacStadium, MacInCloud) ~30 USD/mois

### Scénario 3 : Maximum Visibilité
**Recommandation** : App Store + PWA
- Compte développeur 99 USD/an
- Présence officielle App Store
- PWA comme backup/alternative

### Scénario 4 : Multi-plateforme
**Recommandation** : Capacitor pour iOS + Android
- Un code, deux plateformes
- iOS : App Store
- Android : Google Play
- PWA : Tous navigateurs

---

## 🛠️ Résolution de Problèmes

### Problème : Build échoue dans Xcode

**Solution** :
```bash
# Nettoyer build
Product > Clean Build Folder (Cmd + Shift + K)

# Vérifier certificats
Xcode > Preferences > Accounts > Download Manual Profiles

# Vérifier Provisioning Profile
Signing & Capabilities > Automaticgly manage signing
```

### Problème : App rejetée pour "4.2 Minimum Functionality"

**Raison** : App considérée comme trop simple ou "wrapper" évident

**Solution** :
- Ajouter valeur unique
- Améliorer UI native
- Documenter gameplay riche
- Ajouter fonctionnalité native (ex: partage, achievements)

### Problème : Splash screens ne s'affichent pas

**Solution** :
```bash
# Vérifier syntaxe media query
# Tester dans Safari iOS réel (pas Chrome)
# Vider cache Safari
# Réinstaller PWA
```

### Problème : Service Worker ne fonctionne pas sur iOS

**Solution** :
```javascript
// Vérifier HTTPS (obligatoire)
// Vérifier support
if ('serviceWorker' in navigator) {
  // OK
} else {
  console.log('Non supporté');
}

// Forcer mise à jour
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(reg => reg.update());
});
```

### Problème : Upload build vers App Store échoue

**Solution** :
```bash
# Vérifier version et build number
# Build number doit être supérieur au précédent
# Version doit correspondre à App Store Connect

# Utiliser Application Loader comme alternative
Xcode > Open Developer Tool > Application Loader
```

---

## 📚 Ressources

### Documentation Officielle
- [Apple Developer](https://developer.apple.com/) - Documentation complète
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)

### Outils
- [PWABuilder](https://www.pwabuilder.com/) - Générateur wrapper
- [Capacitor](https://capacitorjs.com/) - Framework hybride
- [RealFaviconGenerator](https://realfavicongenerator.net/) - Générateur icônes
- [Appscope](https://appsco.pe/developer/splash-screens) - Splash screens iOS

### Communautés
- [Apple Developer Forums](https://developer.apple.com/forums/)
- [Stack Overflow - iOS](https://stackoverflow.com/questions/tagged/ios)
- [Reddit - r/iOSProgramming](https://www.reddit.com/r/iOSProgramming/)

---

## ✅ Checklist Complète

### Phase 1 : PWA iOS Optimisée

- [ ] Créer icons manquantes (167x167, 1024x1024)
- [ ] Générer splash screens iOS (toutes tailles)
- [ ] Ajouter splash screens dans index.html
- [ ] Tester sur Safari iOS (iPhone)
- [ ] Tester sur Safari iOS (iPad)
- [ ] Vérifier Service Worker sur iOS
- [ ] Créer documentation install-ios.md
- [ ] Tester installation "Add to Home Screen"
- [ ] Vérifier fonctionnement hors ligne
- [ ] Tester toutes les fonctionnalités

**Temps estimé** : 4-6 heures

### Phase 2 : Préparation App Store

- [ ] Obtenir compte développeur Apple (99 USD)
- [ ] Installer Xcode sur Mac
- [ ] Choisir framework (PWABuilder ou Capacitor)
- [ ] Générer projet iOS
- [ ] Configurer Bundle ID et identifiants
- [ ] Configurer Info.plist
- [ ] Build et test simulateur
- [ ] Test sur appareil iOS physique
- [ ] Résoudre bugs iOS-spécifiques

**Temps estimé** : 6-10 heures

### Phase 3 : Assets et Métadonnées

- [ ] Créer icône 1024x1024 pour App Store
- [ ] Prendre screenshots iPhone (toutes tailles)
- [ ] Prendre screenshots iPad (si support)
- [ ] Créer vidéo preview (optionnel)
- [ ] Rédiger description App Store (FR)
- [ ] Rédiger description App Store (EN) si international
- [ ] Choisir mots-clés
- [ ] Mettre à jour privacy-policy.html
- [ ] Préparer URL support

**Temps estimé** : 8-12 heures

### Phase 4 : Soumission et Publication

- [ ] Créer app dans App Store Connect
- [ ] Remplir toutes les métadonnées
- [ ] Upload screenshots et vidéo
- [ ] Archive build dans Xcode
- [ ] Upload build vers App Store Connect
- [ ] Assigner build à version
- [ ] Remplir questionnaire de contenu (rating)
- [ ] Soumettre pour révision
- [ ] Répondre aux questions Apple (si demandées)
- [ ] Attendre approbation
- [ ] Publier !

**Temps estimé** : 3-5 heures + 1-7 jours révision

---

## 💡 Conseils de Pro

1. **Commencer par PWA** - Tester la demande avant d'investir dans App Store
2. **Utiliser TestFlight** - Beta testeurs donnent feedback précieux
3. **Lire les Guidelines** - 90% des rejets sont évitables
4. **Préparer les assets tôt** - Screenshots prennent plus de temps que prévu
5. **Tester sur vrais appareils** - Simulateur ne suffit pas
6. **Documenter tout** - Facilite les mises à jour futures
7. **Planifier les mises à jour** - Soumissions régulières = meilleur ranking
8. **Répondre vite aux reviews** - Engagement améliore rating
9. **Optimiser ASO** (App Store Optimization) - Mots-clés = découvrabilité
10. **Être patient** - Première soumission peut prendre du temps

---

*Document créé pour "Le Coeur du Dragon"*
*Dernière mise à jour : Novembre 2024*
*Voir aussi : [APPLE_STORE_REQUIREMENTS.md](./APPLE_STORE_REQUIREMENTS.md) et [GOOGLE_APP_GUIDE.md](./GOOGLE_APP_GUIDE.md)*
