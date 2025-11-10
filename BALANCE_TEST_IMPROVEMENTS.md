# Améliorations du Test d'Équilibre du Jeu

## Vue d'ensemble

Le "Test d'Équilibre du jeu" dans le panneau d'administration a été amélioré pour que l'IA joue de manière plus intelligente et fournisse des suggestions plus ciblées.

## Spécifications

- **Total de simulations**: 3,600 parties
- **Combinaisons testées**: 18 (2 sexes × 3 races × 3 classes)
- **Parties par combinaison**: 200
- **Niveau maximum**: 20
- **Temps d'exécution estimé**: 30-60 secondes

## Améliorations Clés

### 1. Allocation Intelligente des Points de Statistiques

Chaque montée de niveau accorde maintenant:
- **3 points de statistiques** distribués selon les priorités de classe
- **+20 PV maximum**
- **+10 Énergie maximum**

#### Priorités par Classe

**Guerrier** (Focus: Survivabilité et Dégâts)
- Force: 40%
- Constitution: 30%
- Défense: 20%
- Dextérité: 10%

**Magicien** (Focus: Intelligence et Mana)
- Intelligence: 50%
- Sagesse: 20%
- Constitution: 20%
- Dextérité: 10%

**Archer** (Focus: Précision et Mobilité)
- Dextérité: 40%
- Force: 30%
- Constitution: 20%
- Sagesse: 10%

### 2. Achats d'Objets Améliorés

L'IA achète maintenant intelligemment en suivant ces priorités:

#### Priorité Critique
- **Potions de soin** quand PV < 40%

#### Haute Priorité
- **Armes** (épées, arcs, bâtons) - amélioration permanente
- **Armures** - amélioration permanente
- **Objets de classe**:
  - Boucliers pour Guerrier (+Défense)
  - Livres pour Magicien (+Intelligence)
  - Carquois pour Archer (+Dextérité)

#### Priorité Moyenne
- **Potions de soin** quand PV < 60%
- **Potions d'énergie** quand Énergie < 30%

#### Priorité Basse
- Potions de force
- Potions d'expérience

### 3. Vérifications de Prérequis

L'IA vérifie maintenant:
- **Niveau requis** avant d'acheter un objet
- **Restriction de classe** (ne peut pas acheter d'objets d'autres classes)
- **Amélioration d'équipement** (évite les achats en double)

### 4. Suggestions Basées sur Comparaisons Extrêmes

Le système compare TOUTES les classes, races et sexes, et suggère des améliorations UNIQUEMENT pour:

#### Classes
1. **Classe qui meurt le plus** (+30% de morts vs moyenne)
2. **Classe qui tue le moins** (-20% de kills vs moyenne)
3. **Classe avec le moins d'or** (-30% d'or vs moyenne)
4. **Classe avec pire taux de victoire** (-15% vs moyenne)

#### Races
- **Race qui meurt le plus** (+25% de morts vs moyenne)

#### Sexes
- **Sexe qui meurt le plus** (+20% de morts vs moyenne)

### 5. Suggestions Générales du Jeu

Le système génère aussi des suggestions pour:
- **Difficulté globale** (si taux de victoire < 60% ou > 85%)
- **Progression vers niveau 20** (si < 10% atteignent niveau 20)
- **Prix des objets** (si trop élevés)

## Utilisation

### Dans l'Interface Web

1. Connectez-vous au panneau d'administration (bouton "🔐 Admin" en bas)
2. Cliquez sur "🧪 Test d'Équilibre"
3. Cliquez sur "🧪 Lancer le Test d'Équilibre"
4. Attendez 30-60 secondes
5. Consultez les résultats et suggestions

### En Ligne de Commande

```bash
node run-balance-analysis.js
```

Cela générera:
- Rapport console avec statistiques détaillées
- Fichier HTML avec rapport complet

## Métriques Analysées

Pour chaque classe, race et sexe, le système calcule:

- **Niveau moyen atteint**
- **Taux de victoire moyen**
- **Nombre de kills moyen**
- **Nombre de morts moyen**
- **Boss vaincus (moyen)**
- **Or gagné/dépensé**
- **Objets achetés par catégorie**
- **Statistiques finales** (Force, Défense, PV, etc.)
- **% atteignant niveau 20**

## Score d'Équilibre

Chaque classe/race/sexe reçoit un score sur 100 basé sur:
- Déviation du niveau moyen
- Déviation du taux de victoire moyen
- Déviation des kills moyens

Score de 90-100 = Bien équilibré
Score de 80-89 = Légèrement déséquilibré
Score < 80 = Nécessite des ajustements

## Fichiers Modifiés

- `js/balance-tester.js` - Logique principale améliorée
- `js/game-logic.js` - Nombre d'itérations mis à jour (200)
- `index.html` - Texte mis à jour (3,600 parties)
- `run-balance-analysis.js` - Nombre d'itérations corrigé (200)

## Notes Techniques

- Le test utilise une copie simulée du joueur
- Les combats sont résolus avec les mêmes calculs que le jeu réel
- L'équilibrage aléatoire (variance de dégâts, récompenses) est préservé
- Les statistiques sont agrégées sur 200 parties pour réduire la variance
