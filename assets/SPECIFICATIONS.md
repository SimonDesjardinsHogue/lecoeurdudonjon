# 📐 Spécifications Techniques des Assets Marketing

## Vue d'Ensemble

Ce document détaille les spécifications exactes pour tous les assets marketing de **Le Coeur du Dragon**.

---

## 📋 Table des Matières

1. [Trailer Vidéo](#trailer-vidéo)
2. [GIFs de Gameplay](#gifs-de-gameplay)
3. [Graphiques Facebook](#graphiques-facebook-1200x628px)
4. [Graphiques Instagram](#graphiques-instagram-1080x1080px)
5. [Bannières Publicitaires](#bannières-publicitaires)
6. [Screenshots iOS](#screenshots-ios)
7. [Screenshots Android](#screenshots-android)
8. [Quick Reference](#quick-reference)

---

## 🎬 Trailer Vidéo

### Spécifications Requises

```yaml
Nom: le-coeur-du-dragon-trailer
Format: MP4 (H.264)
Codec Vidéo: H.264 (x264)
Codec Audio: AAC
Résolution: 1920x1080 (Full HD 1080p)
Ratio d'Aspect: 16:9
Frame Rate: 30 fps
Bitrate Vidéo: 8000 kbps (8 Mbps)
Bitrate Audio: 192 kbps
Sample Rate Audio: 48 kHz
Durée: 30-60 secondes
Taille Fichier: < 50 MB (optimal < 30 MB)
```

### Versions Alternatives

#### YouTube
```yaml
Résolution: 1920x1080
Format: MP4
Durée: 60 secondes max
Optimisation: YouTube (préréglage H.264)
```

#### Instagram Feed (Carré)
```yaml
Résolution: 1080x1080
Ratio: 1:1
Durée: 60 secondes max
Format: MP4
```

#### Instagram Stories/Reels
```yaml
Résolution: 1080x1920
Ratio: 9:16
Durée: 15-30 secondes
Format: MP4
```

#### Facebook
```yaml
Résolution: 1280x720 (720p acceptable)
Ratio: 16:9
Durée: 60 secondes max
Format: MP4
```

#### TikTok
```yaml
Résolution: 1080x1920
Ratio: 9:16
Durée: 15-30 secondes
Format: MP4
```

### Structure Temporelle

```
00:00-00:05  Introduction (Logo + Titre)
00:05-00:15  Accroche (Gameplay spectaculaire)
00:15-00:35  Caractéristiques (Classes, Boss, Contenu)
00:35-00:50  Valeur Unique (Sans pub, Prix, Multijoueur)
00:50-01:00  Call-to-Action (Plateformes + Prix)
```

---

## 🎞️ GIFs de Gameplay

### Spécifications Générales

```yaml
Format Principal: GIF
Format Alternatif: MP4 (pour Facebook/Instagram)
Résolution GIF: 800x450 ou 1280x720
Résolution MP4: 1280x720
Frame Rate: 15-20 fps (GIF), 30 fps (MP4)
Durée: 3-10 secondes
Loop: Infini
Taille Fichier: < 2 MB (GIF), < 5 MB (MP4)
Optimisation: Palette réduite (256 couleurs max)
```

### GIFs à Créer

#### 1. Combat Basique
```yaml
Nom: combat-action
Résolution: 800x450
Durée: 5 secondes
Taille: < 1.5 MB
Contenu:
  - Attaque joueur
  - Ennemi riposte
  - Compétence spéciale
  - Victoire
```

#### 2. Boss Battle
```yaml
Nom: boss-battle
Résolution: 1280x720
Durée: 8 secondes
Taille: < 2 MB
Contenu:
  - Boss capacité spéciale
  - Joueur esquive/défend
  - Contre-attaque
  - Gros dégâts
```

#### 3. Level Up
```yaml
Nom: level-up
Résolution: 800x450
Durée: 4 secondes
Taille: < 1 MB
Contenu:
  - Animation montée de niveau
  - Stats augmentent
  - Message "Niveau X!"
```

#### 4. Loot Légendaire
```yaml
Nom: legendary-loot
Résolution: 800x450
Durée: 5 secondes
Taille: < 1.5 MB
Contenu:
  - Coffre/victoire
  - Item légendaire (or)
  - Stats affichées
```

#### 5. Compétence Spéciale
```yaml
Nom: special-skill-[classe]
Résolution: 800x450
Durée: 4 secondes
Taille: < 1.2 MB
Nombre: 3 (une par classe)
Contenu:
  - Sélection compétence
  - Animation
  - Dégâts/effet
```

#### 6. Progression
```yaml
Nom: character-progression
Résolution: 1280x720
Durée: 6 secondes
Taille: < 1.8 MB
Contenu:
  - Niveau 1 vs Niveau 24
  - Comparaison stats
  - Transition visuelle
```

---

## 📱 Graphiques Facebook (1200x628px)

### Spécifications Requises

```yaml
Nom: facebook-[numero]-[description]
Format: PNG ou JPG
Résolution: 1200 x 628 pixels
Ratio d'Aspect: 1.91:1
Mode Couleur: RGB
Profondeur: 24-bit
Taille Fichier: < 8 MB (optimal < 1 MB)
DPI: 72 (web)
Texte: < 20% de l'image (pour ads Facebook)
```

### 4 Designs à Créer

#### Design 1: Hero/Introduction
```yaml
Nom: facebook-01-hero
Description: Présentation principale du jeu
Éléments:
  - Logo centré (300x300px zone)
  - Titre "Le Coeur du Dragon"
  - Tagline "RPG Épique • Sans Publicité"
  - Stats clés (12-18h, 4 Boss, 3 Classes)
  - CTA "Disponible sur iOS, Android & Web"
Couleurs: Fond #1a1a1a, Or #DAA520, Blanc #FFFFFF
```

#### Design 2: Features Highlight
```yaml
Nom: facebook-02-features
Description: Mise en avant des caractéristiques uniques
Éléments:
  - Screenshot gameplay (60% de l'image)
  - Zone texte (40%)
  - Liste checkmarks:
    ✅ Sans Publicité
    ✅ Sans Achats In-App
    ✅ Mode Multijoueur Inclus
  - Prix "$4.99 iOS | $3.86 Android"
Placement Texte: Droite ou Bas
```

#### Design 3: Boss Battle
```yaml
Nom: facebook-03-boss
Description: Combat épique contre un boss
Éléments:
  - Screenshot boss battle (plein écran)
  - Overlay gradient bas
  - Texte: "Affrontez 4 Boss Légendaires"
  - Sous-texte: "Chacun avec des capacités uniques"
  - Logo petit coin supérieur
Overlay: Gradient noir transparent (bas 30%)
```

#### Design 4: Social Proof
```yaml
Nom: facebook-04-testimonial
Description: Témoignage/avis positif
Éléments:
  - ⭐⭐⭐⭐⭐ (5 étoiles)
  - Citation: "Un vrai RPG complet sans publicité ni surprises. Excellent!"
  - Screenshot gameplay (50%)
  - CTA "Essayez Gratuitement sur Web"
Style: Carte/Card design
```

### Zones de Sécurité

```
┌────────────────────────────────────┐
│ 40px padding                       │
│  ┌──────────────────────────────┐  │
│  │                              │  │
│  │    Zone de Contenu Safe      │  │
│  │    1120 x 548 pixels         │  │
│  │                              │  │
│  └──────────────────────────────┘  │
│ 40px padding                       │
└────────────────────────────────────┘
```

---

## 📸 Graphiques Instagram (1080x1080px)

### Spécifications Requises

```yaml
Nom: instagram-[numero]-[description]
Format: PNG ou JPG
Résolution: 1080 x 1080 pixels
Ratio d'Aspect: 1:1 (Carré)
Mode Couleur: RGB
Profondeur: 24-bit
Taille Fichier: < 8 MB (optimal < 1 MB)
DPI: 72 (web)
```

### 5 Designs à Créer

#### Design 1: Logo/Branding
```yaml
Nom: instagram-01-logo
Description: Identité visuelle du jeu
Éléments:
  - Logo centré (600x600px)
  - Titre "Le Coeur du Dragon"
  - Icône ⚔️🐉⚔️
  - Tagline "RPG Épique • Sans Publicité"
  - "iOS • Android • Web"
Background: Gradient dark (#1a1a1a à #2a2a2a)
```

#### Design 2: Screenshot Focus
```yaml
Nom: instagram-02-screenshot
Description: Gameplay en vedette
Éléments:
  - Screenshot (80% de l'image)
  - Barre texte bas (20%)
  - Texte: "4 BOSS LÉGENDAIRES"
  - Sous-texte: "Capacités uniques"
Screenshot: Combat ou Boss battle
```

#### Design 3: Classes Showcase
```yaml
Nom: instagram-03-classes
Description: Présentation des 3 classes
Layout:
  ┌──────────────────┐
  │ CHOISISSEZ VOTRE │
  │      HÉROS       │
  ├──────────────────┤
  │  🛡️ Guerrier     │
  │  🧙 Magicien     │
  │  🏹 Archer       │
  ├──────────────────┤
  │ Chaque classe =  │
  │ gameplay unique  │
  └──────────────────┘
Icônes: 120x120px chacune
Espacement: 40px entre éléments
```

#### Design 4: Stats/Numbers
```yaml
Nom: instagram-04-stats
Description: Statistiques du jeu
Éléments:
  - Titre "PAR LES CHIFFRES"
  - 24 NIVEAUX
  - 30 ENNEMIS
  - 4 BOSS
  - 3 CLASSES
  - 12-18 HEURES
Layout: Grid ou liste verticale
Police: Bold, grande (72pt+)
```

#### Design 5: Value Proposition
```yaml
Nom: instagram-05-value
Description: Comparaison avec autres jeux
Layout:
  Autres Jeux | Le Coeur du Dragon
  ❌ Publicité | ✅ Sans Pub
  ❌ Achats IAP | ✅ Jeu Complet
  ❌ Pay-to-Win | ✅ Fair Play
  ❌ En ligne | ✅ Offline
Style: Tableau comparatif
Couleurs: Rouge pour ❌, Vert/Or pour ✅
```

### Version Instagram Stories (Bonus)

```yaml
Nom: instagram-story-[numero]
Format: PNG ou JPG
Résolution: 1080 x 1920 pixels
Ratio: 9:16
Zone Safe: 1080 x 1680 (haut et bas 120px exclus)
Durée: 15 secondes (si vidéo)
```

---

## 🖼️ Bannières Publicitaires

### Formats Standards

#### 1. Leaderboard (728x90)
```yaml
Nom: banner-leaderboard-728x90
Format: PNG ou JPG
Résolution: 728 x 90 pixels
Taille: < 150 KB
Layout:
  [Logo 60x60] | LE COEUR DU DRAGON - RPG Épique | [$4.99] [Télécharger →]
Éléments:
  - Logo (gauche)
  - Texte principal (centre)
  - Prix + CTA (droite)
```

#### 2. Medium Rectangle (300x250)
```yaml
Nom: banner-rectangle-300x250
Format: PNG ou JPG
Résolution: 300 x 250 pixels
Taille: < 150 KB
Layout:
  ┌────────────┐
  │ Screenshot │ (60%)
  ├────────────┤
  │ LE COEUR   │
  │ DU DRAGON  │
  │ RPG Épique │
  │[Télécharger]│ (40%)
  └────────────┘
```

#### 3. Mobile Banner (320x50)
```yaml
Nom: banner-mobile-320x50
Format: PNG ou JPG
Résolution: 320 x 50 pixels
Taille: < 50 KB
Layout: [🐉] Le Coeur du Dragon [Jouer →]
Texte: Max 14-16pt
```

#### 4. Large Mobile Banner (320x100)
```yaml
Nom: banner-mobile-large-320x100
Format: PNG ou JPG
Résolution: 320 x 100 pixels
Taille: < 100 KB
Layout:
  ⚔️ LE COEUR DU DRAGON ⚔️
  RPG Épique • Sans Publicité
  [  Télécharger iOS/Android  ]
```

#### 5. Skyscraper (160x600)
```yaml
Nom: banner-skyscraper-160x600
Format: PNG ou JPG
Résolution: 160 x 600 pixels
Taille: < 150 KB
Layout: Vertical
  - Logo (haut)
  - Titre
  - Screenshot
  - Features
  - Prix
  - CTA (bas)
```

#### 6. Half Page (300x600)
```yaml
Nom: banner-halfpage-300x600
Format: PNG ou JPG
Résolution: 300 x 600 pixels
Taille: < 150 KB
Layout:
  - Hero image/Logo (200px)
  - Texte marketing (150px)
  - Screenshot (150px)
  - CTA button (100px)
```

### Bannières HTML5 (Optionnel)

```yaml
Format: HTML5 + CSS + JS
Taille Max: 150 KB (tous fichiers inclus)
Animations: CSS3 ou GSAP
Pas de libraries externes lourdes
```

---

## 📱 Screenshots iOS

### Tailles Requises par Appareil

#### iPhone 6.7" (iPhone 14 Pro Max, 15 Pro Max)
```yaml
Nom: ios-6.7-[numero]-[description]
Résolution Portrait: 1290 x 2796 pixels
Résolution Paysage: 2796 x 1290 pixels (optionnel)
Format: PNG ou JPG
Mode Couleur: RGB
Profondeur: 24-bit
Taille: < 8 MB
Nombre: 3-10 screenshots
Recommandé: 5 screenshots
```

#### iPhone 6.5" (iPhone XS Max, 11 Pro Max)
```yaml
Nom: ios-6.5-[numero]-[description]
Résolution Portrait: 1242 x 2688 pixels
Résolution Paysage: 2688 x 1242 pixels (optionnel)
Format: PNG ou JPG
```

#### iPhone 5.5" (iPhone 8 Plus)
```yaml
Nom: ios-5.5-[numero]-[description]
Résolution Portrait: 1242 x 2208 pixels
Résolution Paysage: 2208 x 1242 pixels (optionnel)
Format: PNG ou JPG
```

#### iPad Pro 12.9" (optionnel)
```yaml
Nom: ipad-12.9-[numero]-[description]
Résolution Portrait: 2048 x 2732 pixels
Résolution Paysage: 2732 x 2048 pixels
Format: PNG ou JPG
```

### 5 Screenshots à Créer

#### Screenshot 1: Menu Principal/Hero
```yaml
Nom: ios-01-hero
Description: Première impression
Contenu:
  - Menu principal du jeu
  - Logo visible
  - Interface claire
Annotation:
  Position: Bas (20% de l'écran)
  Texte: "Embarquez dans une quête épique pour sauver Valéria"
  Police: 72pt Bold
  Couleur: Or #DAA520
```

#### Screenshot 2: Combat
```yaml
Nom: ios-02-combat
Description: Combat contre boss
Contenu:
  - Battle en cours
  - Boss impressionnant
  - Animation/effets
Annotation:
  Position: Bas
  Texte: "Affrontez 4 Boss légendaires avec des capacités uniques"
  Police: 64pt Bold
```

#### Screenshot 3: Classes
```yaml
Nom: ios-03-classes
Description: Sélection/Stats de classe
Contenu:
  - Écran création personnage ou stats
  - 3 classes visibles
Annotation:
  Position: Haut
  Texte: "Choisissez parmi 3 classes et 3 races uniques"
  Police: 64pt Bold
```

#### Screenshot 4: Équipement/Progression
```yaml
Nom: ios-04-loot
Description: Inventaire/Boutique
Contenu:
  - Items légendaires (or)
  - Système de rareté
  - Stats d'équipement
Annotation:
  Position: Bas
  Texte: "Équipez-vous avec des armes et armures légendaires"
  Police: 64pt Bold
```

#### Screenshot 5: Features/Valeur
```yaml
Nom: ios-05-features
Description: Multijoueur ou Stats
Contenu:
  - Mode multijoueur ou écran stats
  - Interface propre
Annotation:
  Position: Bas
  Liste:
    - ✅ Sans Publicité
    - ✅ Sans Achats In-App
    - ✅ Mode Multijoueur Inclus
  Police: 56pt Bold
```

### Zone d'Annotation

```
┌─────────────────────────────┐ ← 0px (haut)
│                             │
│                             │
│    [Screenshot Gameplay]    │
│         (80%)               │
│                             │
│                             │
├─────────────────────────────┤ ← 2236px
│  ┌─────────────────────┐   │
│  │   TEXTE ANNOTATION  │   │ 560px
│  │   Sous-titre desc   │   │ (20%)
│  └─────────────────────┘   │
└─────────────────────────────┘ ← 2796px (bas)
```

---

## 🤖 Screenshots Android

### Tailles Recommandées

#### Téléphone (Requis)
```yaml
Nom: android-phone-[numero]-[description]
Résolution Portrait: 1080 x 1920 pixels
Résolution Paysage: 1920 x 1080 pixels (optionnel)
Format: PNG ou JPG
Mode Couleur: RGB
Taille: < 8 MB
Nombre: 4-8 screenshots
Recommandé: 8 screenshots
```

#### Tablette 7" (Optionnel)
```yaml
Nom: android-tablet7-[numero]-[description]
Résolution Portrait: 1200 x 1920 pixels
Format: PNG ou JPG
```

#### Tablette 10" (Optionnel)
```yaml
Nom: android-tablet10-[numero]-[description]
Résolution Paysage: 1920 x 1200 pixels
Format: PNG ou JPG
```

### 8 Screenshots à Créer

#### Screenshot 1: Introduction
```yaml
Nom: android-01-intro
Zone Texte: Haut (15%)
Texte Principal: "LE COEUR DU DRAGON"
Sous-texte: "RPG ÉPIQUE • 12-18 HEURES • SANS PUBLICITÉ"
Police: 96pt Bold (titre), 48pt Regular (sous-titre)
Contenu: Menu principal
```

#### Screenshot 2: Classes
```yaml
Nom: android-02-classes
Zone Texte: Haut
Texte: "CHOISISSEZ VOTRE CLASSE"
Sous-texte: "Guerrier • Magicien • Archer - 3 Styles Uniques"
Contenu: Écran sélection classe
```

#### Screenshot 3: Combat
```yaml
Nom: android-03-combat
Zone Texte: Bas (15%)
Texte: "COMBAT TACTIQUE"
Sous-texte: "Attaquer • Défendre • Compétences Spéciales"
Contenu: Combat en action
```

#### Screenshot 4: Boss
```yaml
Nom: android-04-boss
Zone Texte: Haut
Texte: "4 BOSS LÉGENDAIRES"
Sous-texte: "Capacités Uniques • Récompenses Épiques"
Contenu: Boss battle
```

#### Screenshot 5: Progression
```yaml
Nom: android-05-progression
Zone Texte: Bas
Texte: "PROGRESSION PROFONDE"
Sous-texte: "24 Niveaux • 7 Statistiques • Points de Stats"
Contenu: Écran stats/level up
```

#### Screenshot 6: Loot
```yaml
Nom: android-06-loot
Zone Texte: Haut
Texte: "LOOT LÉGENDAIRE"
Sous-texte: "Armes • Armures • Potions - Commun à Légendaire"
Contenu: Inventaire/Boutique
```

#### Screenshot 7: Multijoueur
```yaml
Nom: android-07-multiplayer
Zone Texte: Bas
Texte: "MODE MULTIJOUEUR LAN"
Sous-texte: "Jouez en Famille • Classements Partagés • Gratuit"
Contenu: Écran classement
```

#### Screenshot 8: Premium
```yaml
Nom: android-08-premium
Zone Texte: Haut
Texte: "SANS COMPROMIS"
Bullet Points:
  - ✅ SANS PUBLICITÉ
  - ✅ SANS ACHATS IN-APP
  - ✅ JEU COMPLET INCLUS
Contenu: Interface de jeu propre
```

### Zone de Texte

#### Position Haut
```
┌─────────────────────────────┐ ← 0px
│  ┌─────────────────────┐   │
│  │   TEXTE PRINCIPAL   │   │ 288px
│  │   Sous-titre desc   │   │ (15%)
│  └─────────────────────┘   │
├─────────────────────────────┤
│                             │
│    [Screenshot Gameplay]    │
│         (85%)               │
│                             │
└─────────────────────────────┘ ← 1920px
```

#### Position Bas
```
┌─────────────────────────────┐ ← 0px
│                             │
│    [Screenshot Gameplay]    │
│         (85%)               │
│                             │
├─────────────────────────────┤
│  ┌─────────────────────┐   │
│  │   TEXTE PRINCIPAL   │   │ 288px
│  │   Sous-titre desc   │   │ (15%)
│  └─────────────────────┘   │
└─────────────────────────────┘ ← 1920px
```

---

## 🎨 Guide de Style Unifié

### Palette de Couleurs

```css
/* Couleurs principales */
--background-dark: #1a1a1a;
--saddle-brown: #8B4513;
--goldenrod: #DAA520;
--silver: #C0C0C0;
--white: #FFFFFF;
--dark-brown: #654321;

/* Couleurs de rareté (pour screenshots) */
--common: #9CA3AF;      /* Gris */
--rare: #3B82F6;        /* Bleu */
--epic: #A855F7;        /* Violet */
--legendary: #DAA520;   /* Or */
```

### Typographie

```css
/* Polices */
Titre Principal: "Montserrat Bold" ou "Roboto Bold"
Sous-titre: "Roboto Medium"
Corps: "Roboto Regular"

/* Tailles (basé sur 1080x1920) */
--title-large: 96pt;    /* Screenshots Android titre */
--title-medium: 72pt;   /* Screenshots iOS titre */
--subtitle: 48pt;       /* Sous-titres */
--body: 36pt;          /* Corps de texte */
--small: 24pt;         /* Petit texte */
```

### Icônes et Émojis

```
⚔️ Combat, Épée
🐉 Dragon, Boss
🛡️ Guerrier, Défense
🏹 Archer, Classe
🧙 Magicien, Magie
💎 Loot, Légendaire
⭐ Rating, Qualité
🎮 Gaming
📱 Mobile
✅ Feature positive
❌ Comparaison négative
🔥 Épique
💰 Prix, Or
```

### Effets et Ombres

```css
/* Ombre de texte pour lisibilité */
text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);

/* Ombre d'image */
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);

/* Gradient overlay pour screenshots */
background: linear-gradient(
  to top,
  rgba(26, 26, 26, 0.9) 0%,
  rgba(26, 26, 26, 0.3) 50%,
  rgba(26, 26, 26, 0) 100%
);
```

---

## 📊 Quick Reference

### Tailles Principales à Retenir

| Asset | Dimensions | Format |
|-------|------------|--------|
| **Trailer** | 1920x1080 | MP4 |
| **GIF Gameplay** | 800x450 | GIF/MP4 |
| **Facebook** | 1200x628 | PNG/JPG |
| **Instagram Carré** | 1080x1080 | PNG/JPG |
| **Instagram Story** | 1080x1920 | PNG/JPG |
| **Banner Mobile** | 320x50 | PNG/JPG |
| **Banner Rectangle** | 300x250 | PNG/JPG |
| **Screenshot iOS** | 1290x2796 | PNG/JPG |
| **Screenshot Android** | 1080x1920 | PNG/JPG |

### Limites de Taille

| Type | Limite |
|------|--------|
| Trailer | < 50 MB |
| GIF | < 2 MB |
| MP4 court | < 5 MB |
| Images réseaux sociaux | < 8 MB (optimal < 1 MB) |
| Bannières | < 150 KB |
| Screenshots | < 8 MB |

### Checklist Rapide

**Avant Export:**
- [ ] Résolution correcte
- [ ] Format correct (PNG/JPG/MP4)
- [ ] Taille fichier dans limites
- [ ] Texte lisible sur mobile
- [ ] Couleurs cohérentes (palette du jeu)
- [ ] Logo/branding présent
- [ ] Nom de fichier descriptif

**Après Export:**
- [ ] Testé sur mobile
- [ ] Optimisé/compressé
- [ ] Sauvegardé avec backup
- [ ] Ajouté au dossier assets approprié

---

## 📁 Organisation des Fichiers

### Structure Recommandée

```
assets/
├── video/
│   ├── trailer-1080p.mp4
│   ├── trailer-720p.mp4
│   ├── trailer-instagram-square.mp4
│   └── trailer-instagram-story.mp4
├── gifs/
│   ├── combat-action.gif
│   ├── combat-action.mp4
│   ├── boss-battle.gif
│   ├── boss-battle.mp4
│   ├── level-up.gif
│   ├── legendary-loot.gif
│   └── character-progression.gif
├── social/
│   ├── facebook/
│   │   ├── facebook-01-hero.png
│   │   ├── facebook-02-features.png
│   │   ├── facebook-03-boss.png
│   │   └── facebook-04-testimonial.png
│   └── instagram/
│       ├── instagram-01-logo.png
│       ├── instagram-02-screenshot.png
│       ├── instagram-03-classes.png
│       ├── instagram-04-stats.png
│       └── instagram-05-value.png
├── banners/
│   ├── leaderboard-728x90.png
│   ├── rectangle-300x250.png
│   ├── mobile-320x50.png
│   ├── mobile-large-320x100.png
│   ├── skyscraper-160x600.png
│   └── halfpage-300x600.png
├── screenshots/
│   ├── ios/
│   │   ├── ios-6.7-01-hero.png
│   │   ├── ios-6.7-02-combat.png
│   │   ├── ios-6.7-03-classes.png
│   │   ├── ios-6.7-04-loot.png
│   │   └── ios-6.7-05-features.png
│   └── android/
│       ├── phone/
│       │   ├── android-01-intro.png
│       │   ├── android-02-classes.png
│       │   ├── android-03-combat.png
│       │   ├── android-04-boss.png
│       │   ├── android-05-progression.png
│       │   ├── android-06-loot.png
│       │   ├── android-07-multiplayer.png
│       │   └── android-08-premium.png
│       └── tablet/
│           └── (optionnel)
└── SPECIFICATIONS.md (ce fichier)
```

---

## ✅ Validation Finale

### Tests à Effectuer

#### Tous les Assets
- [ ] Résolution correcte
- [ ] Format correct
- [ ] Taille fichier acceptable
- [ ] Nom de fichier descriptif
- [ ] Couleurs cohérentes
- [ ] Branding visible

#### Images Spécifiquement
- [ ] RGB mode (pas CMYK)
- [ ] 72 DPI (web)
- [ ] Texte lisible (surtout sur mobile)
- [ ] Pas de compression excessive
- [ ] Optimisé (TinyPNG, ImageOptim)

#### Vidéos Spécifiquement
- [ ] Codec H.264
- [ ] Audio AAC
- [ ] Frame rate constant
- [ ] Bitrate approprié
- [ ] Son équilibré (pas trop fort)
- [ ] Première frame attractive (thumbnail)

#### Screenshots Store
- [ ] Annotations claires
- [ ] Texte en haut ou bas (pas sur gameplay)
- [ ] Ordre logique (histoire visuelle)
- [ ] Première image = meilleure impression
- [ ] Dernière image = call-to-action

---

**Document créé pour Le Coeur du Dragon**  
*Dernière mise à jour : Novembre 2024*

Pour questions ou clarifications, consultez le [MARKETING_ASSETS_GUIDE.md](../MARKETING_ASSETS_GUIDE.md) principal.
