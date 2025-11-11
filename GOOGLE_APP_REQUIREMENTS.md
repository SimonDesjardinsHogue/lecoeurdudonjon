# 📋 Requirements pour Publication Google App - Résumé

Ce document résume les requirements techniques et les améliorations nécessaires pour publier "Le Coeur du Dragon" en tant qu'application Google (PWA et/ou Google Play Store).

## 🎯 Objectifs

1. **PWA (Progressive Web App)** - Installation depuis le navigateur
2. **Google Play Store** - Publication via TWA (Trusted Web Activities)

---

## ✅ État Actuel

### Ce qui fonctionne déjà
- ✅ Fichier `manifest.json` de base
- ✅ Service Worker (`sw.js`) pour mode hors ligne
- ✅ Interface responsive et mobile-friendly
- ✅ HTTPS via GitHub Pages
- ✅ Jeu jouable hors ligne

### Ce qui manque
- ❌ Icônes d'application en PNG (actuellement SVG emoji)
- ❌ Manifest incomplet (manque screenshots, catégories détaillées)
- ❌ Service Worker ne cache pas tous les fichiers nécessaires
- ❌ Pas de bouton d'installation PWA visible
- ❌ Pas de Digital Asset Links pour TWA
- ❌ Assets graphiques pour Google Play Store

---

## 🔧 Améliorations Requises

### 1. Icônes d'Application (CRITIQUE)

**Problème** : Le manifest utilise des émojis SVG au lieu de vraies icônes PNG.

**Solution** :
```
Créer des icônes PNG dans /assets/icons/ :
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png (obligatoire)
- icon-384x384.png
- icon-512x512.png (obligatoire)
```

**Comment** :
- Utiliser [PWA Image Generator](https://www.pwabuilder.com/imageGenerator)
- Ou [RealFaviconGenerator](https://realfavicongenerator.net/)
- Design : Fond sombre (#1a1a1a) + icône ⚔️/🐉 + texte "LCD"

**Priorité** : 🔴 HAUTE - Sans cela, la PWA ne peut pas être installée correctement

---

### 2. Manifest.json Amélioré (CRITIQUE)

**Problème** : Manifest actuel est minimal.

**Solution** : Mettre à jour avec :
```json
{
  "name": "Le Coeur du Dragon",
  "short_name": "Coeur du Dragon",
  "description": "Un RPG épique inspiré par Legend of the Red Dragon - 20 niveaux, 5 Boss légendaires, 3 classes de héros",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "background_color": "#1a1a1a",
  "theme_color": "#8B4513",
  "orientation": "any",
  "icons": [ /* ... toutes les icônes PNG ... */ ],
  "screenshots": [ /* ... screenshots du jeu ... */ ],
  "categories": ["games", "entertainment"],
  "lang": "fr",
  "dir": "ltr",
  "prefer_related_applications": false
}
```

**Priorité** : 🔴 HAUTE

---

### 3. Service Worker Optimisé (IMPORTANT)

**Problème** : Ne cache pas tous les fichiers nécessaires.

**Solution** : Mettre à jour `urlsToCache` dans `sw.js` pour inclure :
```javascript
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/manifest.json',
  // Tous les JS
  '/js/main.js',
  '/js/game-state.js',
  '/js/game-logic.js',
  '/js/combat.js',
  '/js/ui.js',
  '/js/save-load.js',
  '/js/character-classes.js',
  '/js/character-races.js',
  '/js/audio.js',
  '/js/particles.js',
  '/js/keyboard-handler.js',
  '/js/daily-quests.js',
  // Tous les fichiers data
  '/js/data/enemies.js',
  '/js/data/shop-items.js',
  '/js/data/npcs.js',
  '/js/data/metals.js',
  '/js/data/events.js',
  '/js/data/game-constants.js',
  '/js/core/game-state.js',
  // Icônes
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-512x512.png'
];
```

**Priorité** : 🟡 MOYENNE - Améliore le mode hors ligne

---

### 4. Bouton d'Installation PWA (RECOMMANDÉ)

**Problème** : Aucun moyen évident pour l'utilisateur d'installer la PWA.

**Solution** : Créer `js/install-prompt.js` avec :
```javascript
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  
  // Afficher un bouton d'installation
  const installButton = document.getElementById('installButton');
  if (installButton) {
    installButton.style.display = 'block';
    installButton.addEventListener('click', async () => {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      deferredPrompt = null;
      installButton.style.display = 'none';
    });
  }
});
```

Ajouter dans `index.html` :
```html
<button id="installButton" style="display: none;">
  📱 Installer l'Application
</button>
```

**Priorité** : 🟢 BASSE - Améliore UX mais pas bloquant

---

### 5. Screenshots (POUR GOOGLE PLAY)

**Problème** : Aucun screenshot dans le manifest ou préparé pour le Play Store.

**Solution** : Prendre 4-8 screenshots :
- Écran de démarrage (création de personnage)
- Combat contre un boss
- Boutique / équipement
- Statistiques du personnage
- Écran de victoire

**Format** :
- Mobile portrait : 1080x1920 ou 540x960
- Mobile paysage : 1920x1080 (optionnel)

**Priorité** : 🟡 MOYENNE pour PWA, 🔴 HAUTE pour Play Store

---

### 6. Digital Asset Links (POUR TWA/GOOGLE PLAY)

**Problème** : Nécessaire pour établir la confiance entre l'app Android et le site web.

**Solution** : Créer `/.well-known/assetlinks.json` :
```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.simondesjardinshogue.lecoeurdudragon",
      "sha256_cert_fingerprints": [
        "SHA256_FINGERPRINT_FROM_KEYSTORE"
      ]
    }
  }
]
```

**Note** : GitHub Pages ne supporte pas nativement `.well-known/`. Il faut :
- Soit configurer un custom domain avec serveur personnalisé
- Soit utiliser GitHub Actions pour copier le fichier

**Priorité** : 🔴 HAUTE pour Google Play, N/A pour PWA seule

---

### 7. Assets Graphiques pour Google Play

**Problème** : Pas d'assets préparés pour la page du Play Store.

**Solution** : Créer :

**Icône de l'application** :
- 512x512 PNG
- Fond opaque (pas de transparence)

**Feature Graphic (bannière)** :
- 1024x500 PNG ou JPG
- Design accrocheur avec titre et visuels du jeu

**Screenshots** :
- Minimum 2, recommandé 4-8
- Voir point #5 ci-dessus

**Vidéo promotionnelle (optionnel)** :
- 30-60 secondes sur YouTube
- Montrer le gameplay

**Priorité** : 🔴 HAUTE pour Google Play

---

### 8. Politique de Confidentialité

**Problème** : Google Play exige une politique de confidentialité.

**Solution** : Créer `privacy-policy.html` ou `/docs/privacy-policy.md` :

```markdown
# Politique de Confidentialité - Le Coeur du Dragon

Dernière mise à jour : [Date]

## Collecte de Données

Cette application ne collecte, ne stocke et ne transmet aucune donnée personnelle.

## Stockage Local

Toutes les sauvegardes de jeu sont stockées localement sur votre appareil en utilisant le localStorage du navigateur. Ces données ne sont jamais transmises à un serveur externe.

## Cookies

Cette application n'utilise pas de cookies.

## Services Tiers

Cette application n'utilise aucun service d'analyse ou de suivi tiers.

## Modifications

Cette politique peut être mise à jour occasionnellement. Les changements seront publiés sur cette page.

## Contact

Pour toute question concernant cette politique : [email ou lien GitHub]
```

**Priorité** : 🔴 HAUTE pour Google Play

---

## 📊 Checklist Rapide

### Phase 1 : PWA Fonctionnelle
- [ ] Créer toutes les icônes PNG (72 à 512px)
- [ ] Mettre à jour manifest.json complet
- [ ] Améliorer sw.js pour cacher tous les fichiers
- [ ] Tester avec Lighthouse (score > 80)
- [ ] Ajouter bouton d'installation (optionnel)

### Phase 2 : Google Play Store
- [ ] Créer compte développeur Google Play (25 USD)
- [ ] Préparer tous les assets graphiques
- [ ] Créer politique de confidentialité
- [ ] Installer Bubblewrap CLI
- [ ] Générer AAB avec TWA
- [ ] Configurer Digital Asset Links
- [ ] Soumettre à Google Play

---

## 🎯 Estimation de Temps

### PWA Seule
- **Création icônes** : 1-2 heures
- **Mise à jour manifest + SW** : 30 minutes
- **Tests et ajustements** : 1-2 heures
- **TOTAL** : ~3-5 heures

### Google Play Store (en plus de PWA)
- **Assets graphiques** : 2-4 heures
- **Configuration TWA** : 1-2 heures
- **Création fiche Play Store** : 2-3 heures
- **Tests** : 1-2 heures
- **Délai révision Google** : 2-7 jours
- **TOTAL** : ~6-11 heures + délai révision

---

## 💰 Coûts

### PWA
- **Coût** : 0 EUR (gratuit)
- **Hébergement** : GitHub Pages (gratuit)

### Google Play Store
- **Compte développeur** : 25 USD (paiement unique, à vie)
- **Outils** : Gratuits (Bubblewrap, Android Studio)
- **TOTAL** : 25 USD

---

## 🚀 Par Où Commencer

### Option 1 : PWA d'Abord (Recommandé)
1. Générer les icônes avec [PWA Image Generator](https://www.pwabuilder.com/imageGenerator)
2. Mettre à jour `manifest.json`
3. Améliorer `sw.js`
4. Tester sur mobile
5. ✅ PWA prête !

### Option 2 : Direct Google Play
1. Faire Option 1 d'abord (PWA obligatoire pour TWA)
2. Créer compte développeur Google Play
3. Installer Bubblewrap
4. Préparer assets graphiques
5. Générer AAB
6. Soumettre

---

## 📚 Ressources

### Outils Essentiels
- [PWA Builder](https://www.pwabuilder.com/) - Test et génération PWA
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Audit PWA
- [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap) - Générateur TWA
- [RealFaviconGenerator](https://realfavicongenerator.net/) - Générateur d'icônes

### Documentation
- [Guide complet](./GOOGLE_APP_GUIDE.md) - Documentation détaillée (ce projet)
- [PWA Checklist](https://web.dev/pwa-checklist/) - Google
- [TWA Documentation](https://developer.chrome.com/docs/android/trusted-web-activity/) - Google

---

## ❓ FAQ

**Q: Dois-je publier sur Google Play ?**
A: Non, la PWA suffit pour la plupart des cas. Google Play est utile pour plus de visibilité.

**Q: Combien coûte la publication ?**
A: PWA = gratuit. Google Play = 25 USD (unique, à vie).

**Q: Combien de temps prend la révision Google ?**
A: En général 2-3 jours, parfois jusqu'à 7 jours.

**Q: Puis-je publier sur iOS App Store ?**
A: Oui, mais c'est plus complexe. Il faut utiliser un Mac et Xcode. La PWA fonctionne déjà sur iOS.

**Q: Le jeu fonctionne-t-il vraiment hors ligne ?**
A: Oui, une fois les améliorations du service worker appliquées.

**Q: Dois-je payer pour héberger le jeu ?**
A: Non, GitHub Pages est gratuit et suffisant.

---

*Document créé pour "Le Coeur du Dragon"*
*Voir [GOOGLE_APP_GUIDE.md](./GOOGLE_APP_GUIDE.md) pour la documentation complète*
