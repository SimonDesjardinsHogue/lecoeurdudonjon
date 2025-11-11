# 📋 Liste de Vérification pour les Releases

Ce document décrit le processus pour publier une nouvelle version de **Le Coeur du Dragon**.

## Avant de Commencer

- [ ] Toutes les fonctionnalités prévues sont complètes
- [ ] Tous les tests passent
- [ ] Aucun bug critique n'est ouvert
- [ ] La documentation est à jour

## 1️⃣ Préparation de la Release

### Code et Documentation

- [ ] Vérifier que tous les changements sont committés
- [ ] Mettre à jour le numéro de version dans :
  - [ ] `manifest.json`
  - [ ] `package.json`
  - [ ] `index.html` (ligne de version dans le footer)
  - [ ] `README.md` (badges de version)
- [ ] Mettre à jour `CHANGELOG.md` avec :
  - [ ] Tous les changements depuis la dernière version
  - [ ] Date de release
  - [ ] Liens vers les comparaisons GitHub
- [ ] Mettre à jour `ROADMAP.md` si nécessaire
- [ ] Vérifier que `CONTRIBUTORS.md` est à jour

### Tests

- [ ] Tests manuels complets sur :
  - [ ] Chrome (dernière version)
  - [ ] Firefox (dernière version)
  - [ ] Safari (dernière version)
  - [ ] Mobile (Chrome Android)
  - [ ] Mobile (Safari iOS)
- [ ] Test du mode multijoueur LAN
- [ ] Test de l'installation PWA
- [ ] Test de sauvegarde/restauration
- [ ] Test des nouvelles fonctionnalités
- [ ] Test de régression (fonctionnalités existantes)

### Sécurité

- [ ] Revue de sécurité du code
- [ ] Vérifier qu'aucun secret n'est exposé
- [ ] Tester la Content Security Policy
- [ ] Vérifier les dépendances pour vulnérabilités connues

## 2️⃣ Création de la Release

### Git et GitHub

- [ ] Créer une branche de release : `git checkout -b release/vX.Y.Z`
- [ ] Commit final des changements de version
- [ ] Push de la branche : `git push origin release/vX.Y.Z`
- [ ] Créer une Pull Request vers `main`
- [ ] Faire réviser la PR
- [ ] Merger la PR dans `main`

### Tag et Release GitHub

- [ ] Checkout de `main` : `git checkout main`
- [ ] Pull des derniers changements : `git pull origin main`
- [ ] Créer un tag : `git tag -a vX.Y.Z -m "Version X.Y.Z"`
- [ ] Push du tag : `git push origin vX.Y.Z`
- [ ] Créer une Release sur GitHub :
  - [ ] Titre : `Version X.Y.Z - [Nom de la release]`
  - [ ] Description depuis le CHANGELOG
  - [ ] Joindre les assets si nécessaire
  - [ ] Marquer comme pre-release si applicable

## 3️⃣ Déploiement

### GitHub Pages

- [ ] Vérifier que le workflow de déploiement s'exécute
- [ ] Attendre que le déploiement soit terminé
- [ ] Tester le site déployé : https://simondesjardinshogue.github.io/lecoeurdudragon/
- [ ] Vérifier que la bonne version est affichée
- [ ] Tester les fonctionnalités principales en production

### PWA

- [ ] Vérifier que le Service Worker se met à jour
- [ ] Tester l'installation PWA sur mobile
- [ ] Vérifier le cache offline

## 4️⃣ Communication

### Annonces

- [ ] Créer une annonce sur GitHub Discussions
- [ ] Mettre à jour le README avec la nouvelle version
- [ ] Tweet/post sur les réseaux sociaux (optionnel)

### Documentation

- [ ] S'assurer que tous les guides sont à jour
- [ ] Mettre à jour les screenshots si l'UI a changé
- [ ] Vérifier que les liens dans la documentation fonctionnent

## 5️⃣ Post-Release

### Monitoring

- [ ] Surveiller les issues pour bugs de la nouvelle version
- [ ] Vérifier les analytics (si configurés)
- [ ] Collecter les retours utilisateurs

### Planification

- [ ] Créer des milestones pour la prochaine version
- [ ] Trier et prioriser les issues
- [ ] Mettre à jour la ROADMAP si nécessaire

## 🚨 En Cas de Problème

Si un bug critique est découvert après la release :

1. **Évaluer la gravité** :
   - Critique : Empêche de jouer → Hotfix immédiat
   - Majeur : Affecte une fonctionnalité importante → Hotfix dans 24-48h
   - Mineur : Inconvénient → Inclure dans prochaine version

2. **Pour un Hotfix** :
   - [ ] Créer une branche `hotfix/vX.Y.Z+1`
   - [ ] Corriger le bug
   - [ ] Tester la correction
   - [ ] Suivre le processus de release accéléré
   - [ ] Incrémenter le PATCH (vX.Y.Z → vX.Y.Z+1)

## 📝 Template d'Annonce de Release

```markdown
# 🎉 Le Coeur du Dragon vX.Y.Z est disponible !

Nous sommes heureux d'annoncer la sortie de la version X.Y.Z de Le Coeur du Dragon !

## 🎯 Points Forts

- [Fonctionnalité principale 1]
- [Fonctionnalité principale 2]
- [Fonctionnalité principale 3]

## 📝 Changelog Complet

[Lien vers CHANGELOG.md ou copier les notes de version]

## 🎮 Comment Jouer

Visitez https://simondesjardinshogue.github.io/lecoeurdudragon/ pour jouer immédiatement !

## 🐛 Signaler un Bug

Trouvé un bug ? Signalez-le ici : [lien vers issues]

Merci à tous pour votre soutien ! ⚔️
```

---

## Semantic Versioning

Ce projet suit le Semantic Versioning (semver) :

- **MAJOR** (X.0.0) : Changements incompatibles avec l'API/sauvegarde
- **MINOR** (x.Y.0) : Nouvelles fonctionnalités rétro-compatibles
- **PATCH** (x.y.Z) : Corrections de bugs rétro-compatibles

Exemples :
- Nouvelle classe de personnage → MINOR
- Correction d'un bug de combat → PATCH
- Changement du format de sauvegarde → MAJOR

---

**Dernière mise à jour** : Novembre 2024
