# 🎨 Assets du Jeu - Le Coeur du Dragon

Ce dossier contient tous les assets graphiques pour la PWA, la publication sur les stores et le marketing.

## 📚 Documentation

- **[SPECIFICATIONS.md](SPECIFICATIONS.md)** - Spécifications techniques complètes de tous les assets
- **[templates/README.md](templates/README.md)** - Guides et templates pour créer les assets
- **[../MARKETING_ASSETS_GUIDE.md](../MARKETING_ASSETS_GUIDE.md)** - Guide complet de création des assets marketing

## 📁 Structure

```
assets/
├── icons/                   # Icônes d'application PWA
│   ├── icon-72x72.png à icon-512x512.png     # Icônes standard
│   ├── icon-*-maskable.png                    # Icônes adaptatives Android
│   └── apple-touch-icon-*.png                 # Icônes iOS
├── screenshots/             # Captures d'écran existantes (PWA/Google Play)
│   ├── mobile-*.png         # Screenshots mobiles (540x960)
│   ├── desktop-*.png        # Screenshots desktop (1280x720)
│   ├── ios/                 # Screenshots iOS avec annotations
│   └── android/             # Screenshots Android avec texte
│       ├── phone/           # Téléphone (1080x1920)
│       └── tablet/          # Tablette (optionnel)
├── video/                   # Trailers et contenus vidéo
├── gifs/                    # GIFs de gameplay
├── social/                  # Graphiques réseaux sociaux
│   ├── facebook/            # 1200x628px
│   └── instagram/           # 1080x1080px et 1080x1920px
├── banners/                 # Bannières publicitaires
├── templates/               # Templates et guides de création
├── feature-graphic.png      # Feature graphic Google Play (1024x500)
└── SPECIFICATIONS.md        # Spécifications techniques
```

## 🎯 Icônes d'Application

### Icônes PWA Standard
Toutes les tailles requises pour une PWA complète :

| Fichier | Taille | Usage |
|---------|--------|-------|
| `icon-72x72.png` | 72×72 | Petit écran, notifications |
| `icon-96x96.png` | 96×96 | Écran normal |
| `icon-128x128.png` | 128×128 | Écran normal HD |
| `icon-144x144.png` | 144×144 | Tablette |
| `icon-152x152.png` | 152×152 | Tablette HD |
| `icon-192x192.png` | 192×192 | **Requis** pour PWA |
| `icon-384x384.png` | 384×384 | Haute résolution |
| `icon-512x512.png` | 512×512 | **Requis** pour PWA |

### Icônes Maskables (Android Adaptive)
Pour s'adapter aux différentes formes d'icônes sur Android :

| Fichier | Taille | Purpose |
|---------|--------|---------|
| `icon-192x192-maskable.png` | 192×192 | PWA maskable minimum |
| `icon-512x512-maskable.png` | 512×512 | PWA maskable haute résolution |

### Icônes Apple (iOS)
Pour l'ajout à l'écran d'accueil iOS :

| Fichier | Taille | Appareil |
|---------|--------|----------|
| `apple-touch-icon-120x120.png` | 120×120 | iPhone/iPod Touch |
| `apple-touch-icon-180x180.png` | 180×180 | iPhone Retina |

## 📱 Screenshots

### Existants - PWA/Web (dans `/screenshots/`)

#### Mobile (9:16 ratio)
Format : 540×960 pixels
- `mobile-1.png` - Menu principal
- `mobile-2.png` - Combat épique
- `mobile-3.png` - Statistiques du héros
- `mobile-4.png` - Village et marchands

#### Desktop (16:9 ratio)
Format : 1280×720 pixels
- `desktop-1.png` - Interface complète
- `desktop-2.png` - Combat en plein écran

### À Créer - App Stores

#### Screenshots iOS (dans `/screenshots/ios/`)
Format : 1290×2796 pixels (iPhone 6.7")
- 3-5 screenshots minimum requis
- Avec annotations textuelles
- Voir [SPECIFICATIONS.md](SPECIFICATIONS.md) pour détails

#### Screenshots Android (dans `/screenshots/android/phone/`)
Format : 1080×1920 pixels
- 4-8 screenshots recommandés
- Avec texte descriptif
- Voir [SPECIFICATIONS.md](SPECIFICATIONS.md) pour détails

## 🎮 Feature Graphic

**Fichier** : `feature-graphic.png`
**Taille** : 1024×500 pixels
**Usage** : Bannière principale sur Google Play Store

## 🎬 Assets Marketing (À Créer)

### Trailer Vidéo (dans `/video/`)
Format : MP4 (H.264)
- Durée : 30-60 secondes
- Résolution : 1920×1080 (1080p)
- Versions : YouTube, Instagram (carré et story), Facebook, TikTok
- Voir [SPECIFICATIONS.md](SPECIFICATIONS.md) et [MARKETING_ASSETS_GUIDE.md](../MARKETING_ASSETS_GUIDE.md)

### GIFs de Gameplay (dans `/gifs/`)
Format : GIF ou MP4
- Durée : 3-10 secondes
- Types à créer :
  - Combat en action
  - Boss battle
  - Level up
  - Loot légendaire
  - Compétences spéciales (par classe)
  - Progression du personnage

### Graphiques Réseaux Sociaux (dans `/social/`)

#### Facebook (dans `/social/facebook/`)
Format : PNG/JPG, 1200×628 pixels
- 4 designs recommandés :
  - Hero/Introduction
  - Features Highlight
  - Boss Battle
  - Social Proof/Testimonial

#### Instagram (dans `/social/instagram/`)
Format : PNG/JPG, 1080×1080 pixels (carré)
- 5 designs recommandés :
  - Logo/Branding
  - Screenshot Focus
  - Classes Showcase
  - Stats/Numbers
  - Value Proposition

### Bannières Publicitaires (dans `/banners/`)
Formats multiples pour différentes plateformes :
- Leaderboard (728×90)
- Medium Rectangle (300×250)
- Mobile Banner (320×50)
- Large Mobile Banner (320×100)
- Skyscraper (160×600)
- Half Page (300×600)

## 🎨 Design

### Thème Visuel
- **Couleur de fond** : `#1a1a1a` (noir profond)
- **Couleur d'accent** : `#8B4513` (brun selle)
- **Couleur or** : `#DAA520` (or goldenrod)
- **Épée** : `#C0C0C0` (argent)

### Symboles
- ⚔️ Épée - Symbole principal du jeu
- 🐉 Dragon - Thème fantastique
- 🏰 Château - Monde médiéval

## 📐 Spécifications Techniques

### Format
- Type : PNG 24-bit ou 32-bit
- Optimisation : Oui (pngquant)
- Transparence : Non (fond plein)

### Maskable Icons
Les icônes maskables respectent la **safe zone de 80%** :
- Zone sûre : Le contenu important est dans les 80% centraux
- Zone de débordement : 10% de padding de chaque côté
- Permet l'adaptation à toutes les formes (cercle, carré arrondi, etc.)

## 🔧 Régénération des Assets

Si vous devez régénérer les assets, utilisez le script Python fourni :

```bash
python3 /tmp/generate_icons.py
python3 /tmp/generate_screenshots.py
```

**Note** : Les scripts de génération créent des assets de base. Pour une version de production, il est recommandé de créer des assets personnalisés avec un logiciel de design graphique.

## 📋 Utilisation dans le Code

### manifest.json
Tous les icônes sont référencés dans `/manifest.json` :

```json
{
  "icons": [
    {
      "src": "/assets/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    ...
  ]
}
```

### index.html
Les icônes Apple et favicons sont référencés dans `<head>` :

```html
<link rel="icon" href="/favicon.ico">
<link rel="apple-touch-icon" href="/assets/icons/apple-touch-icon-180x180.png">
```

### Service Worker
Les icônes essentiels sont mis en cache pour le mode hors ligne :

```javascript
'/assets/icons/icon-192x192.png',
'/assets/icons/icon-512x512.png',
```

## ✅ Validation

Pour vérifier que tous les assets sont corrects :

1. **PWA Manifest** : Testez avec [Manifest Validator](https://manifest-validator.appspot.com/)
2. **Lighthouse** : Exécutez un audit PWA dans Chrome DevTools
3. **Maskable Icons** : Testez avec [Maskable.app](https://maskable.app/)

## 📚 Références

- [Web App Manifest (MDN)](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [PWA Icon Guide](https://web.dev/add-manifest/)
- [Maskable Icons](https://web.dev/maskable-icon/)
- [Google Play Store Assets](https://developer.android.com/distribute/google-play/resources/icon-design-specifications)

## 📄 Licence

Ces assets font partie du projet "Le Coeur du Dragon" et sont distribués sous la même licence que le projet principal.
