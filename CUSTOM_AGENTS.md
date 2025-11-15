# Custom Agents Guide - Le Coeur du Dragon

## 📖 Qu'est-ce que les Custom Agents ?

Les **Custom Agents** sont des assistants IA spécialisés configurés pour aider au développement de "Le Coeur du Dragon". Chaque agent est expert dans un domaine spécifique et peut fournir de l'aide, des conseils et même effectuer des tâches de développement.

## 🤖 Agents Disponibles

### 1. 🎮 Le Coeur du Dragon Game Developer
**Fichier**: `.github/agents/dragon-heart-agent.md`

Expert général du jeu "Le Coeur du Dragon" avec une connaissance approfondie de:
- Architecture modulaire ES6
- Mécaniques de jeu et système de combat
- Classes de personnages et races
- Localisation française
- Équilibre du jeu

**Quand l'utiliser**:
- Questions générales sur le projet
- Ajout de nouvelles fonctionnalités de jeu
- Compréhension de l'architecture globale
- Modifications des mécaniques de jeu existantes

**Exemple d'utilisation**:
```
@dragon-heart-agent Comment puis-je ajouter une nouvelle classe de personnage ?
```

---

### 2. 💻 JavaScript ES6 Module Expert
**Fichier**: `.github/agents/javascript-expert.md`

Spécialiste en développement JavaScript moderne avec modules ES6:
- Architecture et organisation modulaire
- Meilleures pratiques JavaScript
- Compatibilité navigateur
- Optimisation des performances
- Gestion d'erreurs et débogage

**Quand l'utiliser**:
- Refactoring de code JavaScript
- Questions sur les modules ES6
- Optimisation des performances
- Architecture de code
- Résolution de problèmes techniques

**Exemple d'utilisation**:
```
@javascript-expert Comment restructurer ce module pour éviter les dépendances circulaires ?
```

---

### 3. 🇫🇷 French Localization Expert
**Fichier**: `.github/agents/french-localization-expert.md`

Expert en localisation française et contenu de jeu:
- Français natif et grammaire
- Terminologie médiévale-fantastique
- Traduction et adaptation culturelle
- Ton et voix du jeu
- Cohérence linguistique

**Quand l'utiliser**:
- Rédaction ou correction de texte français
- Création de dialogue de personnages
- Description d'ennemis ou d'objets
- Révision de la localisation
- Questions sur le vocabulaire médiéval

**Exemple d'utilisation**:
```
@french-localization-expert Peux-tu créer une description épique pour ce nouveau boss ?
```

---

### 4. ⚖️ Game Balance Expert
**Fichier**: `.github/agents/game-balance-expert.md`

Spécialiste de l'équilibre de jeu et des mécaniques RPG:
- Systèmes de combat et équilibre
- Progression de personnages
- Économie du jeu (or, objets)
- Difficulté et courbes de progression
- Design de boss

**Quand l'utiliser**:
- Ajout de nouveaux ennemis
- Équilibrage des statistiques
- Ajustement de la difficulté
- Conception de récompenses
- Analyse de la progression

**Exemple d'utilisation**:
```
@game-balance-expert Quelles statistiques devrait avoir un boss de niveau 12 ?
```

---

### 5. 📚 Documentation Writer
**Fichier**: `.github/agents/documentation-writer.md`

Expert en documentation technique et guides utilisateur:
- Rédaction technique
- Documentation API
- Guides utilisateur
- Markdown et formatage
- Documentation bilingue (FR/EN)

**Quand l'utiliser**:
- Création ou mise à jour de documentation
- Rédaction de guides
- Documentation de code (JSDoc)
- Amélioration du README
- Création de tutoriels

**Exemple d'utilisation**:
```
@documentation-writer Peux-tu documenter cette nouvelle API de combat ?
```

---

### 6. 🔍 Code Review Expert
**Fichier**: `.github/agents/code-review-expert.md`

Spécialiste de la qualité de code et des revues:
- Revue de code approfondie
- Meilleures pratiques JavaScript
- Sécurité et vulnérabilités
- Performance et optimisation
- Maintenabilité du code

**Quand l'utiliser**:
- Revue de Pull Requests
- Analyse de qualité de code
- Identification de problèmes de sécurité
- Suggestions de refactoring
- Validation avant merge

**Exemple d'utilisation**:
```
@code-review-expert Peux-tu réviser ce code et identifier les problèmes potentiels ?
```

---

## 🚀 Comment Utiliser les Custom Agents

### Méthode 1: Mention dans les Issues/PRs
Vous pouvez mentionner un agent dans les commentaires d'issues ou de pull requests:

```markdown
@javascript-expert Je rencontre un problème avec mes imports de modules. 
Comment puis-je structurer mon code pour éviter les erreurs de chargement ?
```

### Méthode 2: GitHub Copilot CLI
Si vous utilisez GitHub Copilot CLI localement:

```bash
gh copilot agent ask @game-balance-expert "Quelles statistiques pour un ennemi niveau 15 ?"
```

### Méthode 3: Intégration dans les Workflows
Les agents peuvent être utilisés dans les workflows CI/CD pour des vérifications automatiques.

## 💡 Bonnes Pratiques

### 1. Choisir le Bon Agent
- **Développement général** → Dragon Heart Agent
- **Code JavaScript** → JavaScript Expert
- **Texte français** → French Localization Expert
- **Équilibrage** → Game Balance Expert
- **Documentation** → Documentation Writer
- **Qualité code** → Code Review Expert

### 2. Poser des Questions Claires
❌ **Mauvais**: "Aide-moi avec le code"
✅ **Bon**: "Comment puis-je refactoriser la fonction `attackEnemy()` pour la rendre plus testable ?"

### 3. Fournir du Contexte
Incluez:
- Code pertinent
- Fichiers concernés
- Comportement actuel vs attendu
- Messages d'erreur si applicable

### 4. Utiliser le Bon Langage
- **Français**: Pour les questions de jeu, localisation, documentation utilisateur
- **English**: Pour les questions techniques, code, architecture (optionnel)

## 📋 Exemples d'Utilisation

### Exemple 1: Ajouter un Nouvel Ennemi

```markdown
@game-balance-expert 
Je veux ajouter un "Dragon de Glace" comme boss au niveau 16. 
Quelles devraient être ses statistiques pour être challengeant mais juste ?

@french-localization-expert
Peux-tu créer une description épique pour un Dragon de Glace, 
incluant son nom complet et son histoire ?
```

### Exemple 2: Refactoring de Code

```markdown
@javascript-expert
J'ai ce code dans combat.js qui est devenu très long (200+ lignes).
Comment puis-je le diviser en modules plus petits tout en gardant 
l'architecture ES6 propre ?

[code ici]

@code-review-expert
Peux-tu identifier les problèmes potentiels de performance ou de sécurité 
dans ce code ?
```

### Exemple 3: Amélioration Documentation

```markdown
@documentation-writer
Le fichier CONTRIBUTING.md a besoin d'une section sur comment tester 
les modifications localement. Peux-tu créer un guide étape par étape ?

@french-localization-expert
Assure-toi que la documentation est en français clair et accessible 
aux débutants.
```

## 🎯 Cas d'Usage Spécifiques

### Développement de Fonctionnalités

1. **Planification**: @dragon-heart-agent pour la conception globale
2. **Implémentation**: @javascript-expert pour le code
3. **Équilibrage**: @game-balance-expert pour les stats
4. **Localisation**: @french-localization-expert pour le texte
5. **Documentation**: @documentation-writer pour les docs
6. **Revue**: @code-review-expert pour la qualité

### Résolution de Bugs

1. **Diagnostic**: @javascript-expert pour identifier le problème
2. **Solution**: @dragon-heart-agent ou @javascript-expert
3. **Revue**: @code-review-expert pour validation
4. **Documentation**: @documentation-writer si changement important

### Ajout de Contenu

1. **Design**: @game-balance-expert pour les stats
2. **Texte**: @french-localization-expert pour descriptions
3. **Implémentation**: @javascript-expert pour le code
4. **Revue**: @dragon-heart-agent pour cohérence globale

## 🔧 Configuration et Personnalisation

Les agents sont configurés dans `.github/agents/`. Pour créer ou modifier un agent:

1. Créer/éditer un fichier `.md` (Markdown) dans `.github/agents/`
2. Suivre le format: titre avec `#`, description, puis instructions
3. Merger dans la branche principale
4. L'agent devient disponible

## 📖 Documentation des Agents

Chaque fichier d'agent est en format Markdown et contient:

- **Titre (# Nom de l'agent)**: Nom de l'agent
- **Description**: Courte description de l'expertise (premier paragraphe)
- **Instructions**: Instructions détaillées pour l'agent (reste du document)

Exemple de structure:

```markdown
# Mon Agent

Expert en quelque chose - description courte de l'expertise de l'agent

## Responsabilités
- Tâche 1
- Tâche 2

## Quand l'utiliser
- Situation 1
- Situation 2
```


## 🤝 Contribuer aux Agents

Vous pouvez améliorer les agents existants ou en créer de nouveaux:

1. Identifier un besoin ou une expertise manquante
2. Créer un nouveau fichier dans `.github/agents/`
3. Suivre le format des agents existants
4. Tester l'agent localement si possible
5. Soumettre une Pull Request
6. Documenter le nouvel agent dans ce guide

## ❓ Questions Fréquentes

**Q: Les agents peuvent-ils modifier le code directement ?**
R: Selon la configuration et les permissions, certains agents peuvent proposer des modifications ou créer des PR.

**Q: En quelle langue dois-je communiquer avec les agents ?**
R: Français ou anglais fonctionnent tous les deux. Utilisez le français pour le contenu de jeu.

**Q: Combien d'agents puis-je mentionner en même temps ?**
R: Vous pouvez mentionner plusieurs agents, mais soyez clair sur ce que vous demandez à chacun.

**Q: Les agents ont-ils accès à tout le dépôt ?**
R: Oui, les agents ont accès au contexte du projet pour fournir des réponses pertinentes.

**Q: Puis-je utiliser les agents en local ?**
R: Oui, avec GitHub Copilot CLI installé localement.

## 📚 Ressources

- [GitHub Custom Agents Documentation](https://gh.io/customagents)
- [GitHub Copilot CLI](https://gh.io/copilot-cli)
- [Contributing Guide](CONTRIBUTING.md)
- [Project Architecture](ARCHITECTURE.md)

---

**Note**: Les custom agents sont là pour vous aider, mais la décision finale sur le code et les fonctionnalités vous revient toujours. Utilisez leur expertise comme un guide, pas comme une règle absolue.

**Bonne utilisation des agents !** 🚀
