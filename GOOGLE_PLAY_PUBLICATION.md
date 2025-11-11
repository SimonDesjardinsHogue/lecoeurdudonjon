# 📱 Guide de Publication Google Play Store

Ce guide explique comment publier "Le Coeur du Dragon" sur le Google Play Store en utilisant Trusted Web Activities (TWA).

## 📋 Prérequis

- Un compte développeur Google Play ($25 USD, paiement unique)
- Android Studio ou Bubblewrap CLI
- Tous les assets graphiques (déjà créés dans `/assets/`)

## 🎨 Assets Graphiques Disponibles

### Icônes d'Application
Toutes les icônes PNG requises ont été générées dans `/assets/icons/` :

- `icon-72x72.png` à `icon-512x512.png` - Icônes standard
- `icon-192x192-maskable.png` et `icon-512x512-maskable.png` - Icônes adaptatives pour Android
- `apple-touch-icon-*.png` - Icônes pour iOS

### Screenshots
Les screenshots ont été générés dans `/assets/screenshots/` :

- `mobile-1.png` à `mobile-4.png` - Screenshots mobiles (540x960)
- `desktop-1.png` et `desktop-2.png` - Screenshots desktop (1280x720)

### Feature Graphic
Un feature graphic Google Play (1024x500) a été créé :
- `/assets/feature-graphic.png`

## 🚀 Méthode 1 : Utiliser Bubblewrap (Recommandé)

Bubblewrap est un outil de Google qui simplifie la création de TWA.

### Installation

```bash
npm install -g @bubblewrap/cli
```

### Initialisation du Projet TWA

```bash
bubblewrap init --manifest https://simondesjardinshogue.github.io/lecoeurdudragon/manifest.json
```

Répondez aux questions :
- **Application Name** : Le Coeur du Dragon
- **Package Name** : com.lecoeurdudragon.twa
- **Start URL** : https://simondesjardinshogue.github.io/lecoeurdudragon/
- **Icon URL** : https://simondesjardinshogue.github.io/lecoeurdudragon/assets/icons/icon-512x512.png
- **Maskable Icon URL** : https://simondesjardinshogue.github.io/lecoeurdudragon/assets/icons/icon-512x512-maskable.png
- **Theme Color** : #8B4513
- **Background Color** : #1a1a1a
- **Display Mode** : standalone

### Build de l'APK

```bash
bubblewrap build
```

Cela créera un fichier APK dans `./app-release-signed.apk`

### Obtenir le SHA256 Fingerprint

```bash
bubblewrap fingerprint
```

Copiez le fingerprint et mettez à jour `/.well-known/assetlinks.json` avec cette valeur.

## 🔧 Méthode 2 : Android Studio (Manuel)

### Étape 1 : Créer un Nouveau Projet

1. Ouvrez Android Studio
2. File → New → New Project
3. Sélectionnez "Empty Activity"
4. Package name : `com.lecoeurdudragon.twa`

### Étape 2 : Configurer le Projet pour TWA

Ajoutez la dépendance dans `app/build.gradle` :

```gradle
dependencies {
    implementation 'com.google.androidbrowserhelper:androidbrowserhelper:2.5.0'
}
```

### Étape 3 : Configurer AndroidManifest.xml

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.lecoeurdudragon.twa">

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="Le Coeur du Dragon"
        android:theme="@android:style/Theme.Translucent.NoTitleBar">
        
        <activity
            android:name="com.google.androidbrowserhelper.trusted.LauncherActivity"
            android:exported="true">
            
            <meta-data
                android:name="android.support.customtabs.trusted.DEFAULT_URL"
                android:value="https://simondesjardinshogue.github.io/lecoeurdudragon/" />
            
            <meta-data
                android:name="android.support.customtabs.trusted.STATUS_BAR_COLOR"
                android:resource="@color/colorPrimary" />
            
            <meta-data
                android:name="android.support.customtabs.trusted.NAVIGATION_BAR_COLOR"
                android:resource="@color/colorPrimary" />
            
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
            
            <intent-filter android:autoVerify="true">
                <action android:name="android.intent.action.VIEW"/>
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE"/>
                <data
                    android:scheme="https"
                    android:host="simondesjardinshogue.github.io"
                    android:pathPrefix="/lecoeurdudragon"/>
            </intent-filter>
        </activity>
    </application>
</manifest>
```

### Étape 4 : Ajouter les Icônes

Copiez les icônes générées dans les dossiers appropriés :
- `mipmap-mdpi` (48x48) : utiliser icon-72x72.png redimensionnée
- `mipmap-hdpi` (72x72) : icon-72x72.png
- `mipmap-xhdpi` (96x96) : icon-96x96.png
- `mipmap-xxhdpi` (144x144) : icon-144x144.png
- `mipmap-xxxhdpi` (192x192) : icon-192x192.png

### Étape 5 : Générer le Keystore et Signer l'APK

```bash
keytool -genkey -v -keystore my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias
```

Build → Generate Signed Bundle / APK → Sélectionnez votre keystore

### Étape 6 : Obtenir le SHA256 Fingerprint

```bash
keytool -list -v -keystore my-release-key.jks -alias my-key-alias
```

Copiez le SHA256 et mettez à jour `/.well-known/assetlinks.json`

## 📦 Préparer les Assets pour Google Play Console

### 1. Screenshots

Vous devez fournir au minimum :
- **2 screenshots téléphone** (minimum 320px, maximum 3840px, ratio 16:9 ou 9:16)
  - Utilisez `mobile-1.png` à `mobile-4.png`
- **2 screenshots tablette 7"** (recommandé)
- **1 screenshot tablette 10"** (recommandé)

### 2. Feature Graphic

**Requis** : 1024 x 500 pixels
- Utilisez `/assets/feature-graphic.png`

### 3. Icône d'Application

**Requis** : 512 x 512 pixels, PNG 32-bit
- Utilisez `/assets/icons/icon-512x512.png`

### 4. Description de l'App

**Titre** : Le Coeur du Dragon

**Description courte** (80 caractères max) :
```
RPG épique médiéval-fantastique. 20 niveaux, 5 Boss, 3 classes de héros !
```

**Description complète** :
```
⚔️ Le Coeur du Dragon ⚔️

Plongez dans une aventure épique inspirée par Legend of the Red Dragon !

🏰 HISTOIRE
Dans le royaume oublié de Valéria, les ténèbres s'étendent. Au cœur de la forêt ancienne se cache un artefact légendaire - le Cœur du Dragon - capable de sauver le royaume. Seul un héros courageux peut affronter les dangers qui gardent ce trésor mystique.

⚡ CARACTÉRISTIQUES
• 3 classes de héros : Guerrier, Magicien, Archer
• 3 races jouables : Humain, Elfe, Nain
• 20 niveaux de progression épique
• 5 Boss légendaires redoutables
• Système de combat stratégique
• Compétences uniques par classe
• Équipement varié et améliorable
• Succès à débloquer
• Défis quotidiens
• Mode hors ligne complet
• Multijoueur LAN familial

🎮 GAMEPLAY
Explorez la forêt mystérieuse, combattez des ennemis féroces, améliorez vos statistiques et votre équipement. Chaque décision compte dans votre quête pour devenir une légende !

🌟 PROGRESSION
• Système de niveaux avec expérience
• 6 statistiques à développer (FOR, DEX, CON, INT, SAG, CHA)
• Inventaire et gestion d'objets
• Boutique avec équipement varié
• Auberge pour repos et récupération

🏆 RÉCOMPENSES
• Succès déblocables avec bonus permanents
• Récompenses de connexion quotidiennes
• Défis quotidiens renouvelables
• Classement des héros

📱 PWA (Progressive Web App)
L'application fonctionne complètement hors ligne une fois installée. Aucune connexion Internet requise pour jouer !

🎨 GRAPHISMES
Interface soignée avec thème médiéval-fantastique, effets visuels et animations fluides.

🔒 CONFIDENTIALITÉ
Aucune collecte de données personnelles. Toutes vos sauvegardes restent sur votre appareil.

💾 SAUVEGARDE
Sauvegarde automatique après chaque action. Système d'import/export de sauvegardes.

🌐 MULTIJOUEUR LAN (Optionnel)
Jouez avec votre famille sur le même réseau local. Partagez vos scores !

📖 OPEN SOURCE
Code source disponible sur GitHub. Transparent et vérifiable.

🇫🇷 100% EN FRANÇAIS
Entièrement traduit et adapté pour les joueurs francophones.

Téléchargez maintenant et commencez votre quête légendaire ! ⚔️🐉
```

### 5. Catégorie

Sélectionnez : **Jeux** → **Jeux de rôle**

### 6. Classification du Contenu

Le jeu contient :
- Combat fantastique léger (pas de violence graphique)
- Pas de contenu pour adultes
- Classification recommandée : **PEGI 7** ou **Tout public**

### 7. Politique de Confidentialité

**URL** : https://simondesjardinshogue.github.io/lecoeurdudragon/privacy-policy.html

## 🔐 Digital Asset Links

Le fichier `/.well-known/assetlinks.json` a été créé. Vous devez :

1. Obtenir votre SHA256 fingerprint (voir étapes ci-dessus)
2. Remplacer `PLACEHOLDER_SHA256_FINGERPRINT_1` par votre fingerprint
3. Si vous avez plusieurs clés (debug + release), ajoutez les deux fingerprints
4. Commitez et poussez vers GitHub
5. Vérifiez que le fichier est accessible à : `https://simondesjardinshogue.github.io/lecoeurdudragon/.well-known/assetlinks.json`

## ✅ Checklist Finale

Avant de soumettre à Google Play :

- [ ] APK signé généré
- [ ] SHA256 fingerprint ajouté à assetlinks.json
- [ ] assetlinks.json accessible en ligne
- [ ] Au moins 2 screenshots téléphone uploadés
- [ ] Feature graphic uploadé
- [ ] Icône 512x512 uploadée
- [ ] Description complète rédigée
- [ ] Politique de confidentialité accessible
- [ ] Classification du contenu complétée
- [ ] Prix défini ($3.86 CAD - voir section Prix ci-dessous)
- [ ] Pays de distribution sélectionnés

## 💰 Prix et Monétisation

**Prix de vente** : **$3.86 CAD**

**Détails importants** :
- ✅ **Aucun coût supplémentaire** - pas d'achats in-app, pas d'abonnement
- 🎮 **Jeu complet** - tout le contenu est inclus dans le prix d'achat
- 👨‍👩‍👧‍👦 **Mode LAN familial** - jouez en réseau local avec votre famille pour du plaisir sans frais additionnels
- 💝 **Achat unique** - payez une fois, jouez pour toujours

**Stratégie de prix** :
- Le prix de $3.86 CAD est défini pour équilibrer le profit entre iOS ($4.99 CAD) et Android
- Ce prix tient compte des différences de commission des plateformes (30% Apple vs 15-30% Google)
- Aucun coût caché ou frais supplémentaire pour les joueurs

**Avantages pour les joueurs** :
- Jeu complet sans restrictions
- Mode multijoueur LAN gratuit pour jouer en famille
- Aucune publicité intrusive
- Mises à jour gratuites

## 🎯 Publication

1. Connectez-vous à [Google Play Console](https://play.google.com/console)
2. Créez une nouvelle application
3. Remplissez toutes les informations requises
4. Uploadez l'APK signé
5. Ajoutez tous les assets graphiques
6. Complétez le questionnaire de classification du contenu
7. Définissez les pays de distribution
8. Soumettez pour révision

Le processus de révision prend généralement 1-7 jours.

## 📞 Support

Pour toute question :
- GitHub Issues : https://github.com/SimonDesjardinsHogue/lecoeurdudragon/issues
- Documentation Google : https://developer.android.com/training/basics/intents/package-visibility

## 🎉 Succès !

Une fois approuvé, votre jeu sera disponible sur le Google Play Store pour des millions d'utilisateurs Android !

Bonne chance ! ⚔️🐉
