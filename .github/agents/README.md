# Custom Agents for GitHub Copilot

This directory contains custom agent definitions for GitHub Copilot to assist with development of "Le Coeur du Dragon".

## Available Agents

### 🎮 Le Coeur du Dragon Game Developer
**File**: `dragon-heart-agent.agent.md`  
**Alias**: `@dragon-heart-agent`

Expert general du jeu "Le Coeur du Dragon" - Coordinateur principal pour le développement, l'architecture et l'intégration des systèmes de jeu.

**Use for**: General game development, feature integration, architecture decisions, coordinating complex tasks

---

### 💻 JavaScript ES6 Module Expert
**File**: `javascript-expert.agent.md`  
**Alias**: `@javascript-expert`

Spécialiste en développement JavaScript moderne avec modules ES6 - Architecture modulaire, bonnes pratiques, performance et compatibilité navigateur.

**Use for**: JavaScript code architecture, ES6 modules, refactoring, performance optimization, debugging

---

### 🇫🇷 French Localization Expert
**File**: `french-localization-expert.agent.md`  
**Alias**: `@french-localization-expert`

Expert en localisation française et contenu de jeu - Français natif, terminologie médiévale-fantastique, traduction et adaptation culturelle.

**Use for**: French text creation, translation, medieval fantasy terminology, dialogue writing, content review

---

### ⚖️ Game Balance Expert
**File**: `game-balance-expert.agent.md`  
**Alias**: `@game-balance-expert`

Spécialiste de l'équilibre de jeu et des mécaniques RPG - Systèmes de combat, progression, économie du jeu, difficulté et design de boss.

**Use for**: Game balance, combat stats, enemy design, progression curves, reward systems, difficulty tuning

---

### 📚 Documentation Writer
**File**: `documentation-writer.agent.md`  
**Alias**: `@documentation-writer`

Expert en documentation technique et guides utilisateur - Rédaction technique, documentation API, guides utilisateur, markdown.

**Use for**: Creating documentation, updating guides, API documentation, README files, technical writing

---

### 🔍 Code Review Expert
**File**: `code-review-expert.agent.md`  
**Alias**: `@code-review-expert`

Spécialiste de la qualité de code et des revues - Revue approfondie, bonnes pratiques, sécurité, performance et maintenabilité.

**Use for**: Code reviews, quality assurance, security analysis, refactoring suggestions, best practices validation

---

## Usage

### In GitHub Issues and Pull Requests

Mention an agent in comments to get specialized help:

```markdown
@javascript-expert How can I refactor this module to avoid circular dependencies?

@game-balance-expert What stats should this level 15 boss have?

@french-localization-expert Can you review this French dialogue text?
```

### With GitHub Copilot CLI

If you have GitHub Copilot CLI installed:

```bash
gh copilot agent ask @game-balance-expert "What stats for a level 10 enemy?"
```

### In Your IDE

GitHub Copilot will automatically use these agents to provide better context-aware suggestions when working in this repository.

---

## Agent File Format

Each agent file must:
1. Have a `.agent.md` extension (e.g., `my-agent.agent.md`)
2. Include YAML frontmatter with `name` and `description` fields
3. Contain detailed instructions in Markdown

Example format:

```markdown
---
name: my-agent
description: Brief description of the agent's expertise and role
---

# Agent Name

Brief description of the agent's expertise

Detailed instructions for the agent including:
- Expertise areas
- Responsibilities
- Guidelines
- Best practices
- Examples
```

---

## Contributing New Agents

To add a new custom agent:

1. Create a new `.agent.md` file in this directory (must have `.agent.md` extension)
2. Add YAML frontmatter with `name` and `description` fields
3. Follow the format shown above with a title and detailed instructions
4. Add documentation to this README
5. Update `CUSTOM_AGENTS.md` in the root directory
6. Submit a Pull Request

---

## Resources

- [GitHub Copilot Custom Agents Documentation](https://docs.github.com/en/copilot)
- [Project Custom Agents Guide](../../CUSTOM_AGENTS.md)
- [Contributing Guidelines](../../CONTRIBUTING.md)

---

**Last Updated**: November 2024  
**Total Agents**: 6
