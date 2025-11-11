# 📱 Requirements pour Publication Apple App Store - Résumé

Ce document résume les requirements techniques et les améliorations nécessaires pour publier "Le Coeur du Dragon" sur l'Apple App Store.

## 🎯 Objectifs

1. **PWA pour iOS/Safari** - Installation depuis Safari (Add to Home Screen)
2. **Apple App Store** - Publication native via wrapper ou conversion

---

## ✅ État Actuel

### Ce qui fonctionne déjà
- ✅ Compatible Safari/iOS (fixes récents appliqués)
- ✅ Icons Apple Touch présentes (120x120, 180x180)
- ✅ Meta tags Apple dans index.html
- ✅ Interface responsive et mobile-friendly
- ✅ HTTPS via GitHub Pages
- ✅ Jeu jouable sur iOS

### Ce qui manque pour App Store
- ❌ Wrapper natif iOS (pas de fichier Xcode/Swift)
- ❌ Configuration spécifique iOS (Info.plist, Capabilities)
- ❌ Assets graphiques complets pour App Store
- ❌ Screenshots iPhone/iPad dans toutes les tailles requises
- ❌ Vidéo preview optionnelle
- ❌ Compte développeur Apple (99 USD/an)
- ❌ Préparation App Store Connect

---

## 🔧 Améliorations Requises

### 1. Optimisations PWA pour iOS/Safari (HAUTE PRIORITÉ)

**Ce qui est déjà fait** :
- ✅ Apple Touch Icons (120x120, 180x180)
- ✅ Meta tags apple-mobile-web-app-*
- ✅ Fixes Safari/iPad pour connexions réseau

**Améliorations à apporter** :

#### A. Icons Apple Touch Complets
Actuellement : 120x120, 180x180
**Manquant** :
```
- icon-167x167.png (iPad Pro 10.5")
- icon-1024x1024.png (App Store, iTunes)
```

**Action** : Créer ces tailles supplémentaires dans `/assets/icons/`

#### B. Splash Screens iOS
**Problème** : Aucun splash screen pour iOS lors de l'ouverture depuis l'écran d'accueil

**Solution** : Ajouter les meta tags dans `index.html` :
```html
<!-- iPhone 13 Pro Max, 12 Pro Max -->
<link rel="apple-touch-startup-image" media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3)" href="/assets/splash/iphone-13-pro-max.png">

<!-- iPhone 13 Pro, 13, 12 Pro, 12 -->
<link rel="apple-touch-startup-image" media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)" href="/assets/splash/iphone-13.png">

<!-- iPhone 13 mini, 12 mini -->
<link rel="apple-touch-startup-image" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" href="/assets/splash/iphone-13-mini.png">

<!-- iPhone 11 Pro Max, XS Max -->
<link rel="apple-touch-startup-image" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)" href="/assets/splash/iphone-11-pro-max.png">

<!-- iPhone 11, XR -->
<link rel="apple-touch-startup-image" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)" href="/assets/splash/iphone-11.png">

<!-- iPhone 11 Pro, X, XS -->
<link rel="apple-touch-startup-image" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" href="/assets/splash/iphone-x.png">

<!-- iPhone 8 Plus, 7 Plus, 6s Plus, 6 Plus -->
<link rel="apple-touch-startup-image" media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)" href="/assets/splash/iphone-8-plus.png">

<!-- iPhone 8, 7, 6s, 6 -->
<link rel="apple-touch-startup-image" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" href="/assets/splash/iphone-8.png">

<!-- iPad Pro 12.9" -->
<link rel="apple-touch-startup-image" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)" href="/assets/splash/ipad-pro-12-9.png">

<!-- iPad Pro 11" -->
<link rel="apple-touch-startup-image" media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)" href="/assets/splash/ipad-pro-11.png">

<!-- iPad Pro 10.5", Air 3rd gen -->
<link rel="apple-touch-startup-image" media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)" href="/assets/splash/ipad-air.png">

<!-- iPad Mini 6th gen -->
<link rel="apple-touch-startup-image" media="(device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2)" href="/assets/splash/ipad-mini.png">

<!-- iPad 9th gen, Air 2, Mini 5 -->
<link rel="apple-touch-startup-image" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)" href="/assets/splash/ipad.png">
```

**Tailles nécessaires** :
- iPhone : 1284x2778, 1170x2532, 1125x2436, 1242x2688, 828x1792, 750x1334, 1242x2208
- iPad : 2048x2732, 1668x2388, 1668x2224, 1488x2266, 1536x2048

**Priorité** : 🟡 MOYENNE - Améliore l'expérience mais pas bloquant

#### C. Manifest.json - Support iOS
**Amélioration** : Bien que Safari iOS ne supporte pas complètement le manifest, certains champs sont utilisés.

Vérifier que ces champs sont présents :
```json
{
  "name": "Le Coeur du Dragon",
  "short_name": "Coeur du Dragon",
  "display": "standalone",
  "theme_color": "#8B4513",
  "background_color": "#1a1a1a"
}
```

**Priorité** : ✅ DÉJÀ FAIT

#### D. Service Worker - Compatibilité iOS
**État** : Safari supporte maintenant les Service Workers (depuis iOS 11.3)

**Vérification nécessaire** :
- ✅ Cache API utilisée correctement
- ✅ Pas de fonctionnalités non-supportées
- ⚠️ Tester sur iOS réel (pas seulement simulateur)

**Priorité** : 🟢 BASSE - Déjà fonctionnel

---

### 2. Publication App Store Native (CRITIQUE pour App Store)

Pour publier sur l'App Store, il faut une application native iOS. Plusieurs options :

#### Option A : PWABuilder (RECOMMANDÉ - Plus Simple)
**Avantages** :
- Gratuit et open source
- Génère un projet Xcode automatiquement
- Wrapper léger autour de WKWebView
- Maintenu par Microsoft

**Étapes** :
1. Aller sur [PWABuilder.com](https://www.pwabuilder.com/)
2. Entrer l'URL : `https://simondesjardinshogue.github.io/lecoeurdudragon/`
3. Télécharger le package iOS
4. Ouvrir dans Xcode
5. Configurer les identifiants et certificats
6. Build et soumettre

**Priorité** : 🔴 HAUTE pour App Store

#### Option B : Capacitor (RECOMMANDÉ - Plus Flexible)
**Avantages** :
- Créé par l'équipe Ionic
- Accès aux APIs natives iOS
- Très bien documenté
- Plus de contrôle

**Étapes** :
```bash
# Installation
npm install -g @capacitor/cli @capacitor/core
npm install @capacitor/ios

# Initialisation
npx cap init "Le Coeur du Dragon" com.simondesjardinshogue.lecoeurdudragon

# Ajout iOS
npx cap add ios

# Configuration
# Éditer capacitor.config.json pour pointer vers index.html

# Ouvrir dans Xcode
npx cap open ios
```

**Configuration** `capacitor.config.json` :
```json
{
  "appId": "com.simondesjardinshogue.lecoeurdudragon",
  "appName": "Le Coeur du Dragon",
  "webDir": ".",
  "bundledWebRuntime": false,
  "server": {
    "allowNavigation": [
      "simondesjardinshogue.github.io"
    ]
  }
}
```

**Priorité** : 🔴 HAUTE pour App Store

#### Option C : Cordova (Alternative)
**Avantages** :
- Mature et stable
- Grande communauté

**Inconvénients** :
- Plus ancien que Capacitor
- API moins moderne

**Priorité** : 🟡 MOYENNE - Alternative viable

---

### 3. Assets Graphiques pour App Store (CRITIQUE)

#### A. Icône de l'Application
**Requis** :
- 1024x1024 PNG (sans transparence, sans alpha channel)
- Format : RGB (pas CMYK)
- Résolution : 72 DPI minimum

**Action** : Créer `/assets/icons/app-store-icon-1024x1024.png`

#### B. Screenshots iPhone
**Minimum requis** : 2 screenshots pour chaque taille d'écran

**Tailles obligatoires** (2024) :
1. **iPhone 6.7"** (iPhone 14 Pro Max, 13 Pro Max, 12 Pro Max) :
   - 1290x2796 pixels (portrait)
   - Ou 2796x1290 pixels (landscape)

2. **iPhone 6.5"** (iPhone 11 Pro Max, XS Max) :
   - 1284x2778 pixels (portrait)
   - Ou 2778x1284 pixels (landscape)

3. **iPhone 5.5"** (iPhone 8 Plus, 7 Plus, 6s Plus) :
   - 1242x2208 pixels (portrait)
   - Ou 2208x1242 pixels (landscape)

**Nombre** : Minimum 2, maximum 10 par taille

**Action** : Prendre screenshots du jeu :
- Menu principal
- Combat
- Équipement/Statistiques
- Village/Boutique

#### C. Screenshots iPad (si support iPad)
**Tailles obligatoires** :
1. **iPad Pro 12.9"** (3ème génération) :
   - 2048x2732 pixels (portrait)
   - Ou 2732x2048 pixels (landscape)

2. **iPad Pro 12.9"** (2ème génération) :
   - 2048x2732 pixels (portrait)
   - Ou 2732x2048 pixels (landscape)

#### D. Vidéo Preview (OPTIONNEL mais RECOMMANDÉ)
**Spécifications** :
- Format : M4V, MP4, ou MOV
- Résolution : Identique aux screenshots
- Durée : 15-30 secondes
- Taille max : 500 MB
- Frame rate : 25-30 FPS

**Contenu suggéré** :
1. Intro (2s) - Logo + Titre
2. Gameplay (20s) - Combat, exploration, progression
3. Outro (3s) - Call to action

**Priorité** : 🟢 BASSE - Améliore conversion mais pas obligatoire

---

### 4. Configuration iOS Spécifique (HAUTE PRIORITÉ)

#### A. Info.plist
Fichier de configuration iOS contenant métadonnées et permissions.

**Éléments requis** :
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDevelopmentRegion</key>
    <string>fr</string>
    <key>CFBundleDisplayName</key>
    <string>Coeur du Dragon</string>
    <key>CFBundleExecutable</key>
    <string>$(EXECUTABLE_NAME)</string>
    <key>CFBundleIdentifier</key>
    <string>com.simondesjardinshogue.lecoeurdudragon</string>
    <key>CFBundleName</key>
    <string>Le Coeur du Dragon</string>
    <key>CFBundleShortVersionString</key>
    <string>1.1.0</string>
    <key>CFBundleVersion</key>
    <string>1</string>
    <key>LSRequiresIPhoneOS</key>
    <true/>
    <key>UILaunchStoryboardName</key>
    <string>LaunchScreen</string>
    <key>UIRequiredDeviceCapabilities</key>
    <array>
        <string>armv7</string>
    </array>
    <key>UISupportedInterfaceOrientations</key>
    <array>
        <string>UIInterfaceOrientationPortrait</string>
        <string>UIInterfaceOrientationLandscapeLeft</string>
        <string>UIInterfaceOrientationLandscapeRight</string>
    </array>
    <key>UISupportedInterfaceOrientations~ipad</key>
    <array>
        <string>UIInterfaceOrientationPortrait</string>
        <string>UIInterfaceOrientationPortraitUpsideDown</string>
        <string>UIInterfaceOrientationLandscapeLeft</string>
        <string>UIInterfaceOrientationLandscapeRight</string>
    </array>
    <!-- Permissions si nécessaire -->
    <key>NSPhotoLibraryUsageDescription</key>
    <string>L'application ne demande pas d'accès aux photos</string>
    <key>NSCameraUsageDescription</key>
    <string>L'application ne demande pas d'accès à la caméra</string>
</dict>
</plist>
```

**Note** : Ce fichier sera généré automatiquement par PWABuilder ou Capacitor

#### B. Capabilities
Déclarer les fonctionnalités utilisées :
- ☐ Game Center (si implémenté)
- ☐ Push Notifications (si implémenté)
- ☐ In-App Purchases (si monétisation)
- ☐ iCloud (si sauvegarde cloud)

**État actuel** : Aucune de ces fonctionnalités n'est utilisée ✅

---

### 5. Politique de Confidentialité (CRITIQUE)

**État actuel** : ✅ Fichier `privacy-policy.html` existe

**Vérifications nécessaires** :
- [ ] Accessible via URL publique
- [ ] Mentionne spécifiquement iOS/App Store
- [ ] Conforme RGPD et lois de confidentialité Apple
- [ ] Traduit en anglais (requis si distribution internationale)

**Action** : Mettre à jour `privacy-policy.html` pour mentionner l'App Store

**URL requise** : `https://simondesjardinshogue.github.io/lecoeurdudragon/privacy-policy.html`

---

### 6. Métadonnées App Store Connect (CRITIQUE)

#### Informations de Base
```
Nom de l'app : Le Coeur du Dragon
Sous-titre : RPG épique médiéval-fantastique
Langue principale : Français (France)
Catégorie primaire : Jeux > Jeux de rôle
Catégorie secondaire : Jeux > Aventure
```

#### Description (4000 caractères max)
**À préparer** : Description engageante du jeu incluant :
- Hook accrocheur
- Fonctionnalités principales
- Classes de héros
- Nombre de niveaux et boss
- Mode multijoueur
- Progression
- Appel à l'action

#### Mots-clés (100 caractères max)
**Suggérés** : `RPG,médiéval,dragon,aventure,héros,combat,boss,quête,fantasy,multiplayer`

#### URL Support
`https://github.com/SimonDesjardinsHogue/lecoeurdudragon/issues`

#### URL Marketing (optionnel)
`https://simondesjardinshogue.github.io/lecoeurdudragon/`

#### Copyright
`© 2024 Simon Desjardins Hogue`

#### Rating
Estimation : **9+** (Mild Fantasy Violence)

**Action** : Remplir questionnaire IARC ou Apple

#### Prix
**Suggéré** : Gratuit (avec possibilité IAP futur)

---

### 7. Compte Développeur Apple (REQUIS)

**Coût** : 99 USD / an (renouvelable)

**Processus** :
1. Créer Apple ID (si pas déjà fait)
2. S'inscrire sur [developer.apple.com](https://developer.apple.com)
3. Payer 99 USD
4. Attendre approbation (1-2 jours généralement)
5. Accepter accords de licence

**Requis pour** :
- Tester sur appareil réel
- Soumettre à l'App Store
- Gérer certificats et provisioning profiles

**Priorité** : 🔴 CRITIQUE - Sans cela, impossible de publier

---

### 8. Tests et Validation (HAUTE PRIORITÉ)

#### Tests iOS
**Appareils recommandés** :
- [ ] iPhone (modèle récent, iOS 16+)
- [ ] iPad (pour vérifier responsive)
- [ ] Simulateur Xcode (tests basiques)

**Tests à effectuer** :
- [ ] Lancement de l'app
- [ ] Navigation complète
- [ ] Sauvegarde/Chargement
- [ ] Combat
- [ ] Boutique
- [ ] Multijoueur (si applicable)
- [ ] Rotation d'écran
- [ ] Multitâche iOS
- [ ] Notifications (si implémentées)

#### TestFlight
**Processus** :
1. Upload build dans App Store Connect
2. Créer groupe de testeurs
3. Inviter beta testeurs
4. Collecter feedback
5. Itérer

**Avantages** :
- Tester avant publication publique
- Feedback utilisateurs réels
- Jusqu'à 10,000 testeurs externes

**Priorité** : 🟡 MOYENNE - Recommandé mais pas obligatoire

---

## 📊 Checklist Rapide

### Phase 1 : PWA iOS Optimisée (GRATUIT)
- [ ] Créer icons manquantes (167x167, 1024x1024)
- [ ] Ajouter splash screens iOS
- [ ] Tester sur Safari iOS (iPhone + iPad)
- [ ] Vérifier Service Worker sur iOS
- [ ] Documenter processus "Add to Home Screen"

**Temps estimé** : 3-5 heures

### Phase 2 : Préparation App Store
- [ ] Choisir outil (PWABuilder ou Capacitor)
- [ ] Générer projet iOS
- [ ] Configurer Info.plist
- [ ] Créer certificats de développement
- [ ] Tester en local sur appareil iOS

**Temps estimé** : 5-8 heures

### Phase 3 : Assets et Métadonnées
- [ ] Créer icône 1024x1024
- [ ] Prendre screenshots (toutes tailles)
- [ ] Créer vidéo preview (optionnel)
- [ ] Rédiger description App Store
- [ ] Mettre à jour politique de confidentialité
- [ ] Préparer mots-clés

**Temps estimé** : 8-12 heures

### Phase 4 : Soumission App Store
- [ ] Créer compte développeur Apple (99 USD)
- [ ] Créer app dans App Store Connect
- [ ] Upload build
- [ ] Remplir métadonnées
- [ ] Upload screenshots
- [ ] Soumettre pour révision
- [ ] Attendre approbation (1-7 jours)

**Temps estimé** : 3-5 heures + délai révision

---

## 💰 Coûts

### PWA iOS Seule
- **Coût** : 0 EUR (gratuit)
- **Hébergement** : GitHub Pages (gratuit)
- **Outils** : Gratuits

### Apple App Store
- **Compte développeur** : 99 USD / an (obligatoire)
- **Certificats** : Inclus dans compte développeur
- **Outils** : Xcode (gratuit, macOS requis)
- **Matériel** : Mac requis pour build et soumission
- **TOTAL** : 99 USD/an + Mac

---

## 🚀 Recommandation

### Étape 1 : PWA iOS (Commencer ici)
**Pourquoi** :
- Gratuit
- Rapide à implémenter
- Pas besoin de Mac
- Déjà presque terminé
- Fonctionne immédiatement

**Actions** :
1. Créer icons manquantes
2. Tester sur iOS
3. Documenter installation PWA

### Étape 2 : Évaluer App Store
**Après PWA, décider si** :
- Vous avez accès à un Mac
- Vous pouvez payer 99 USD/an
- Vous voulez la visibilité App Store
- Vous voulez les fonctionnalités natives

---

## 🎯 Différences Clés : Google Play vs App Store

| Aspect | Google Play | Apple App Store |
|--------|-------------|-----------------|
| **Coût** | 25 USD (unique) | 99 USD/an |
| **Matériel requis** | Tout OS | Mac obligatoire |
| **Délai révision** | 2-3 jours | 1-7 jours |
| **Taux rejet** | ~10% | ~40% |
| **PWA alternative** | TWA (natif) | Add to Home Screen |
| **Processus** | Plus simple | Plus strict |
| **Documentation** | Bonne | Excellente |

---

## 📚 Ressources

### Outils Essentiels
- [PWABuilder](https://www.pwabuilder.com/) - Générateur de wrapper iOS
- [Capacitor](https://capacitorjs.com/) - Framework hybride moderne
- [Xcode](https://developer.apple.com/xcode/) - IDE iOS (Mac uniquement)
- [Apple Splash Screen Generator](https://appsco.pe/developer/splash-screens) - Générateur splash screens

### Documentation
- [Apple Developer](https://developer.apple.com/) - Documentation officielle
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) - Guidelines de révision
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) - Design iOS
- [App Store Connect Help](https://help.apple.com/app-store-connect/) - Guide App Store Connect

### Services
- [App Store Connect](https://appstoreconnect.apple.com/) - Gestion des apps
- [Apple Developer Portal](https://developer.apple.com/account/) - Certificats et profils

---

## ❓ FAQ

**Q: Dois-je publier sur l'App Store ?**
A: Non, la PWA fonctionne déjà sur iOS. L'App Store offre plus de visibilité mais coûte 99 USD/an.

**Q: Puis-je publier sans Mac ?**
A: Techniquement possible avec des services cloud (MacStadium, MacInCloud) mais coûteux. PWABuilder peut aider mais un Mac est fortement recommandé.

**Q: Combien de temps prend la révision Apple ?**
A: En moyenne 24-48 heures, parfois jusqu'à 7 jours.

**Q: Mon jeu sera-t-il rejeté ?**
A: Possible si :
- Contenu violant les guidelines
- Bugs critiques
- Fonctionnalités limitées
- Performance faible

Le jeu actuel semble conforme, mais testez bien avant soumission.

**Q: Puis-je mettre à jour facilement ?**
A: Oui. Pour PWA : modifications immédiates. Pour App Store : soumission nouvelle version (révision rapide pour updates).

**Q: Et si j'ajoute du contenu in-app purchase ?**
A: Apple prend 30% (15% après 1 an ou si < 1M USD/an).

**Q: Puis-je avoir le jeu sur Android et iOS ?**
A: Oui ! Utilisez Capacitor pour générer les deux. Un seul codebase.

---

## 🔄 Comparaison avec Google Play

### Similitudes
- Manifest/Configuration requise
- Icons multiples tailles
- Screenshots obligatoires
- Politique de confidentialité
- Processus de révision
- Tests requis

### Différences App Store
- ❌ Pas de TWA natif (wrapper seulement)
- ✅ Meilleure intégration Safari/iOS
- ✅ Add to Home Screen plus mature
- ❌ Coût annuel vs unique
- ❌ Mac requis
- ✅ Splash screens iOS spécifiques
- ❌ Processus plus strict

---

## 📝 Prochaines Étapes

1. **Décider** : PWA seule ou App Store ?
2. **Si PWA** :
   - Créer icons manquantes
   - Tester sur iOS
   - Mettre à jour documentation

3. **Si App Store** :
   - Obtenir compte développeur (99 USD)
   - Obtenir accès Mac
   - Choisir PWABuilder ou Capacitor
   - Préparer tous les assets
   - Configurer et tester
   - Soumettre

---

*Document créé pour "Le Coeur du Dragon"*
*Voir aussi : [GOOGLE_APP_REQUIREMENTS.md](./GOOGLE_APP_REQUIREMENTS.md) pour comparaison*
