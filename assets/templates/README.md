# 🎨 Templates pour Assets Marketing

## Vue d'Ensemble

Ce dossier contient les templates et scripts pour générer les assets marketing de Le Coeur du Dragon.

## 📁 Structure

```
templates/
├── README.md                    (ce fichier)
├── screenshot-capture.md        Guide de capture
├── gif-creation-guide.md        Guide création GIFs
├── social-media-templates.md   Templates réseaux sociaux
└── figma-templates-link.md     Liens vers templates Figma
```

## 🎬 Capture de Screenshots

### Méthode Chrome DevTools (Recommandée)

Pour capturer des screenshots aux bonnes dimensions :

```bash
# 1. Ouvrez le jeu dans Chrome
# 2. Ouvrez DevTools (F12)
# 3. Activez device toolbar (Ctrl+Shift+M)
# 4. Configurez les dimensions
```

#### Pour iOS iPhone 6.7"
```
Dimensions: 1290 x 2796 (portrait)
Device: Custom
Scale: 1
```

#### Pour Android Phone
```
Dimensions: 1080 x 1920 (portrait)
Device: Pixel 5 ou Custom
Scale: 1
```

#### Capture
```
1. Cmd/Ctrl + Shift + P
2. Tapez "Capture screenshot"
3. Sélectionnez "Capture screenshot"
4. Image sauvegardée dans Downloads
```

### Script Python pour Redimensionner (Optionnel)

```python
# resize_screenshots.py
from PIL import Image
import os

def resize_for_ios(input_path, output_path):
    """Redimensionne pour iOS 6.7" (1290x2796)"""
    img = Image.open(input_path)
    img_resized = img.resize((1290, 2796), Image.Resampling.LANCZOS)
    img_resized.save(output_path, 'PNG', optimize=True)

def resize_for_android(input_path, output_path):
    """Redimensionne pour Android phone (1080x1920)"""
    img = Image.open(input_path)
    img_resized = img.resize((1080, 1920), Image.Resampling.LANCZOS)
    img_resized.save(output_path, 'PNG', optimize=True)

# Utilisation
# resize_for_ios('screenshot.png', 'ios-screenshot.png')
# resize_for_android('screenshot.png', 'android-screenshot.png')
```

## 🎞️ Création de GIFs

### Avec ScreenToGif (Windows)

1. Téléchargez [ScreenToGif](https://www.screentogif.com/)
2. Lancez et sélectionnez "Recorder"
3. Positionnez la fenêtre sur le jeu
4. Enregistrez l'action (3-10 secondes)
5. Éditez dans l'éditeur intégré
6. Exportez en optimisant la taille

### Avec FFmpeg (Command Line)

```bash
# Convertir vidéo en GIF
ffmpeg -i input.mp4 -vf "fps=15,scale=800:-1:flags=lanczos" -loop 0 output.gif

# Optimiser GIF existant
ffmpeg -i input.gif -vf "fps=15,scale=800:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" output.gif

# Convertir GIF en MP4 (pour Facebook/Instagram)
ffmpeg -i input.gif -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" output.mp4
```

## 📱 Templates Réseaux Sociaux

### Dimensions de Référence

| Plateforme | Type | Dimensions |
|------------|------|------------|
| Facebook | Post | 1200x628 |
| Instagram | Carré | 1080x1080 |
| Instagram | Story | 1080x1920 |
| Twitter | Post | 1200x675 |

### Utiliser Canva

1. Créez un compte sur [Canva.com](https://www.canva.com/)
2. Sélectionnez le format approprié
3. Utilisez les couleurs du jeu :
   - #1a1a1a (fond)
   - #DAA520 (or/accents)
   - #FFFFFF (texte)
4. Ajoutez vos screenshots
5. Exportez en PNG

### Template Figma (Avancé)

Pour des templates réutilisables professionnels :

1. Créez un compte [Figma](https://www.figma.com/)
2. Créez un nouveau fichier
3. Configurez des frames pour chaque format
4. Créez des composants réutilisables
5. Exportez en PNG/JPG

## 🎨 Ajout d'Annotations

### Méthode Simple : Canva

```
1. Ouvrez screenshot dans Canva
2. Ajoutez un rectangle semi-transparent en bas/haut
   - Couleur : #1a1a1a
   - Opacité : 90%
   - Hauteur : 15-20% de l'image
3. Ajoutez texte
   - Police : Montserrat Bold ou Roboto Bold
   - Taille : 72pt (iOS), 96pt (Android)
   - Couleur : #DAA520 ou #FFFFFF
   - Ombre : Activée
4. Exportez
```

### Méthode Avancée : Photoshop/GIMP

```
1. Ouvrez screenshot
2. Créez nouveau calque
3. Dessinez rectangle annotation
   - Remplissage : #1a1a1a à 90% opacité
4. Ajoutez calque de texte
   - Police Bold, grande taille
   - Ombre portée (2px, 2px, 4px, noir 80%)
5. Exportez en PNG
```

## 🎬 Montage Vidéo Trailer

### DaVinci Resolve (Gratuit - Recommandé)

```
Timeline Suggérée :

00:00-00:05  [Piste 1] Logo fade in
             [Piste 2] Musique épique fade in

00:05-00:15  [Piste 1] Clips combat (3-4 clips de 2-3s)
             [Piste 2] Texte "Un RPG Épique"
             [Piste 3] Musique + SFX combat

00:15-00:35  [Piste 1] Montage features
             - Classes (5s)
             - Boss battles (8s)
             - Équipement (7s)
             [Piste 2] Textes descriptifs
             [Piste 3] Musique

00:35-00:50  [Piste 1] Features check list
             ✅ Sans Pub
             ✅ Sans IAP
             ✅ Multijoueur
             [Piste 2] Musique crescendo

00:50-01:00  [Piste 1] Logo + CTA
             [Piste 2] Texte plateformes + prix
             [Piste 3] Musique fade out
```

### Transitions Recommandées

- Cuts directs (la plupart du temps)
- Dissolve/Cross-fade (entre sections)
- Éviter effets compliqués

### Export Settings

```
Format: QuickTime
Codec: H.264
Résolution: 1920x1080
Framerate: 30 fps
Bitrate: 8000 kbps
Audio Codec: AAC
Audio Bitrate: 192 kbps
```

## 🛠️ Outils en Ligne Gratuits

### Pour Screenshots et Images

- [Canva](https://www.canva.com/) - Design facile
- [Photopea](https://www.photopea.com/) - Photoshop en ligne
- [Remove.bg](https://www.remove.bg/) - Supprimer fond
- [TinyPNG](https://tinypng.com/) - Compression

### Pour GIFs

- [Ezgif](https://ezgif.com/) - Éditeur GIF en ligne
- [GIPHY](https://giphy.com/create) - Créer et héberger GIFs

### Pour Vidéos

- [Kapwing](https://www.kapwing.com/) - Éditeur vidéo en ligne
- [ClipChamp](https://clipchamp.com/) - Éditeur vidéo simple

### Pour Mockups

- [Smartmockups](https://smartmockups.com/) - Device mockups
- [MockuPhone](https://mockuphone.com/) - Gratuit, simple
- [Placeit](https://placeit.net/) - Mockups variés

## 📚 Ressources Additionnelles

### Musique Libre de Droits

- [Incompetech](https://incompetech.com/) - Musique CC BY
- [YouTube Audio Library](https://studio.youtube.com/channel/UC/music) - Gratuit
- [Free Music Archive](https://freemusicarchive.org/) - CC0/CC BY
- [Bensound](https://www.bensound.com/) - Musique libre

### Polices Gratuites

- [Google Fonts](https://fonts.google.com/)
  - Montserrat (Bold - pour titres)
  - Roboto (Regular/Bold - pour corps)
  - Open Sans (Alternative)

### Icônes et Émojis

- [Font Awesome](https://fontawesome.com/) - Icônes
- [Flaticon](https://www.flaticon.com/) - Icônes gratuites
- [Emojipedia](https://emojipedia.org/) - Copier émojis

## ✅ Checklist Workflow

### Pour Chaque Screenshot

- [ ] Capturer à la bonne résolution
- [ ] Capturer moment intéressant du jeu
- [ ] Ajouter annotation (si requis)
- [ ] Vérifier lisibilité texte
- [ ] Optimiser/compresser
- [ ] Nommer correctement
- [ ] Sauvegarder dans bon dossier

### Pour Chaque GIF

- [ ] Enregistrer action intéressante
- [ ] Durée 3-10 secondes
- [ ] Éditer (couper début/fin)
- [ ] Optimiser taille < 2 MB
- [ ] Tester le loop
- [ ] Créer version MP4 aussi
- [ ] Nommer et sauvegarder

### Pour Chaque Graphique Social

- [ ] Utiliser template ou créer design
- [ ] Utiliser couleurs du jeu
- [ ] Ajouter branding/logo
- [ ] Texte clair et lisible
- [ ] Tester sur mobile
- [ ] Optimiser taille
- [ ] Exporter et sauvegarder

### Pour le Trailer

- [ ] Capturer clips variés (10-15 min)
- [ ] Sélectionner meilleurs moments
- [ ] Monter selon structure (intro, features, CTA)
- [ ] Ajouter musique libre de droits
- [ ] Ajouter textes/titres
- [ ] Mixer audio
- [ ] Exporter qualité maximale
- [ ] Créer versions multiples (16:9, 1:1, 9:16)
- [ ] Uploader sur YouTube/Vimeo

## 💡 Conseils Pratiques

### Capture de Gameplay

- Jouez en résolution native maximale
- Capturez plus que nécessaire (éditer ensuite)
- Capturez différents moments/angles
- Sauvegardez clips bruts (backup)

### Design Visuel

- Restez simple et clair
- Utilisez la palette de couleurs du jeu
- Assurez lisibilité sur petit écran
- Testez toujours sur mobile
- Soyez cohérent (branding)

### Optimisation

- Compressez sans perte visible
- PNG pour graphiques avec texte
- JPG pour photos/screenshots
- MP4 préféré à GIF pour réseaux sociaux
- Testez taille finale

## 🆘 Problèmes Courants

### "Ma capture est floue"
- Capturez à résolution native
- N'utilisez pas de zoom navigateur
- Utilisez PNG (pas JPG) pour captures

### "Mon GIF est trop lourd"
- Réduisez durée (< 10 sec)
- Réduisez frame rate (15 fps)
- Réduisez dimensions (800x450)
- Utilisez optimiseur (Ezgif)
- Considérez MP4 à la place

### "Le texte est illisible"
- Augmentez taille police
- Ajoutez ombre au texte
- Utilisez fond contrasté
- Testez sur petit écran

### "Vidéo trop lourde"
- Réduisez bitrate
- Réduisez résolution (720p acceptable)
- Utilisez compression H.264 efficace
- Limitez durée

---

**Bonne création !** 🎨

Pour questions, consultez le [MARKETING_ASSETS_GUIDE.md](../../MARKETING_ASSETS_GUIDE.md) principal.
