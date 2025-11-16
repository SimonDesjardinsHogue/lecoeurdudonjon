// Game Events Data Module
// Random events

import { rollGold, rollXP, rollRange, rollHealing } from '../dice.js';

export const randomEvents = [
    {
        type: 'treasure',
        name: 'Coffre au Trésor',
        icon: '💰',
        description: 'Vous découvrez un coffre rempli de pièces d\'or !',
        effect: (p) => {
            const gold = rollGold(30, 150); // 5d6 gold, scaled to 30-180 range
            p.gold += gold;
            return `Vous gagnez ${gold} pièces d\'or !`;
        },
        location: 'forest'
    },
    {
        type: 'treasure',
        name: 'Gemme Magique',
        icon: '💎',
        description: 'Une gemme magique brille dans l\'obscurité...',
        effect: (p) => {
            const xp = rollXP(30, 90); // 3d6 XP scaled to 30-120 range
            p.xp += xp;
            return `Vous absorbez son énergie et gagnez ${xp} XP !`;
        },
        location: 'forest'
    },
    {
        type: 'trap',
        name: 'Piège à Pointes',
        icon: '🗡️',
        description: 'Vous déclenchez un piège caché dans les fourrés !',
        effect: (p) => {
            const baseDamage = rollRange(15, 35); // ~3d6+5 damage
            const damage = Math.max(1, baseDamage - p.defense);
            p.health = Math.max(1, p.health - damage);
            return `Vous perdez ${damage} HP !`;
        },
        location: 'forest'
    },
    {
        type: 'trap',
        name: 'Gaz Toxique',
        icon: '☠️',
        description: 'Une brume toxique émane des plantes de la forêt !',
        effect: (p) => {
            const baseDamage = rollRange(10, 25); // ~2d6+5 damage
            const damage = Math.max(1, baseDamage - Math.floor(p.puissance / 2));
            p.health = Math.max(1, p.health - damage);
            return `Vous perdez ${damage} HP à cause du poison !`;
        },
        location: 'forest'
    },
    {
        type: 'trap',
        name: 'Piège à Collet',
        icon: '🪤',
        description: 'Vous êtes pris dans un collet de chasseur !',
        effect: (p) => {
            const baseDamage = rollRange(12, 30); // ~3d6 damage
            const damage = Math.max(1, baseDamage - p.defense);
            p.health = Math.max(1, p.health - damage);
            return `Vous vous débattez et perdez ${damage} HP avant de vous libérer !`;
        },
        location: 'forest'
    },
    {
        type: 'trap',
        name: 'Racines Traîtresses',
        icon: '🌿',
        description: 'Vous trébuchez sur des racines enchevêtrées !',
        effect: (p) => {
            const baseDamage = rollRange(8, 20); // ~2d6 damage
            const damage = Math.max(1, baseDamage - p.defense);
            p.health = Math.max(1, p.health - damage);
            return `Vous tombez lourdement et perdez ${damage} HP !`;
        },
        location: 'forest'
    },
    {
        type: 'special',
        name: 'Fontaine de Guérison',
        icon: '⛲',
        description: 'Vous trouvez une fontaine aux eaux cristallines...',
        effect: (p) => {
            const healing = rollHealing(p.maxHealth, 0.40, 0.70); // 40-70% healing using dice
            p.health = Math.min(p.maxHealth, p.health + healing);
            return `Vous buvez l\'eau et récupérez ${healing} HP !`;
        },
        location: 'forest'
    },
    {
        type: 'special',
        name: 'Sanctuaire Ancien',
        icon: '⛪',
        description: 'Un sanctuaire ancien vous accorde sa bénédiction...',
        effect: (p) => {
            p.health = p.maxHealth;
            p.energy = Math.min(p.maxEnergy, p.energy + 20);
            return 'Vous êtes complètement guéri et recevez 20 énergie !';
        },
        location: 'forest'
    },
    {
        type: 'mystery',
        name: 'Inscription Mystérieuse',
        icon: '📜',
        description: 'Vous découvrez une inscription ancienne sur un arbre. Elle ressemble aux symboles que les M&M ont mentionnés...',
        effect: (p) => {
            const xp = rollXP(40, 60); // ~3d6 XP
            const gold = rollGold(20, 40); // ~2d6 gold
            p.xp += xp;
            p.gold += gold;
            return `En déchiffrant l\'inscription, vous gagnez ${xp} XP et trouvez ${gold} pièces d\'or cachées !`;
        },
        location: 'forest'
    },
    {
        type: 'mystery',
        name: 'Passage Secret',
        icon: '🚪',
        description: 'Vous trouvez un passage secret marqué du symbole des M&M ! Il mène à une grotte oubliée...',
        effect: (p) => {
            const gold = rollGold(80, 120); // ~5d6 gold  
            const xp = rollXP(50, 50); // ~3d6 XP
            p.gold += gold;
            p.xp += xp;
            return `Dans la grotte secrète, vous découvrez ${gold} pièces d\'or et des artefacts anciens qui vous donnent ${xp} XP !`;
        },
        location: 'forest'
    },
    {
        type: 'mystery',
        name: 'Fragment du Savoir',
        icon: '🔮',
        description: 'Vous trouvez un parchemin laissé par les M&M. Il contient des connaissances sur les anciens gardiens de Valéria...',
        effect: (p) => {
            const espritBonus = rollRange(2, 4); // 1d6, clamped to 2-4 range
            p.esprit += espritBonus;
            return `Vous étudiez le parchemin avec attention. Votre esprit augmente de ${espritBonus} !`;
        },
        location: 'forest'
    },
    // Village events
    {
        type: 'theft',
        name: 'Pickpocket',
        icon: '👤',
        description: 'Un pickpocket vous bouscule dans la foule du village !',
        effect: (p) => {
            const stolenGold = rollGold(20, 30); // ~2d6 gold theft
            const actualLoss = Math.min(stolenGold, p.gold);
            p.gold = Math.max(0, p.gold - actualLoss);
            return actualLoss > 0 ? `Le voleur s\'enfuit avec ${actualLoss} pièces d\'or !` : 'Heureusement, vous n\'aviez pas d\'or sur vous !';
        },
        location: 'village'
    },
    {
        type: 'theft',
        name: 'Voleur Nocturne',
        icon: '🥷',
        description: 'Un voleur essaie de vous dérober vos biens dans une ruelle sombre !',
        effect: (p) => {
            const stolenGold = rollGold(30, 50); // ~3d6 gold theft
            const actualLoss = Math.min(stolenGold, p.gold);
            p.gold = Math.max(0, p.gold - actualLoss);
            return actualLoss > 0 ? `Le voleur s\'échappe avec ${actualLoss} pièces d\'or avant que vous ne puissiez réagir !` : 'Le voleur part bredouille, vous n\'aviez pas d\'or !';
        },
        location: 'village'
    },
    {
        type: 'theft',
        name: 'Arnaqueur',
        icon: '🎭',
        description: 'Un marchand malhonnête essaie de vous arnaquer avec de fausses potions !',
        effect: (p) => {
            const stolenGold = rollGold(15, 25); // ~2d6 gold loss
            const actualLoss = Math.min(stolenGold, p.gold);
            p.gold = Math.max(0, p.gold - actualLoss);
            return actualLoss > 0 ? `Vous réalisez trop tard l\'arnaque et perdez ${actualLoss} pièces d\'or !` : 'Heureusement, vous n\'avez pas d\'argent pour acheter ses fausses potions !';
        },
        location: 'village'
    },
    {
        type: 'treasure',
        name: 'Récompense du Village',
        icon: '🎁',
        description: 'Le maire du village vous remercie pour votre présence et vous offre une récompense !',
        effect: (p) => {
            const gold = rollGold(40, 60); // ~3d6 gold
            p.gold += gold;
            return `Vous recevez ${gold} pièces d\'or !`;
        },
        location: 'village'
    },
    {
        type: 'special',
        name: 'Fête du Village',
        icon: '🎉',
        description: 'Vous arrivez pendant une fête villageoise ! Les habitants partagent leur nourriture et leur joie.',
        effect: (p) => {
            const healing = Math.floor(p.maxHealth * 0.30);
            p.health = Math.min(p.maxHealth, p.health + healing);
            p.energy = Math.min(p.maxEnergy, p.energy + 10);
            return `Vous récupérez ${healing} HP et 10 énergie grâce à la générosité des villageois !`;
        },
        location: 'village'
    },
    // Additional Forest Events
    {
        type: 'treasure',
        name: 'Ruche d\'Abeilles',
        icon: '🍯',
        description: 'Vous découvrez une ruche abandonnée remplie de miel doré !',
        effect: (p) => {
            const healing = Math.floor(p.maxHealth * 0.25);
            p.health = Math.min(p.maxHealth, p.health + healing);
            const gold = rollGold(15, 25); // ~2d6 gold
            p.gold += gold;
            return `Vous récupérez ${healing} HP et trouvez ${gold} pièces d\'or cachées près de la ruche !`;
        },
        location: 'forest'
    },
    {
        type: 'special',
        name: 'Arbre Ancien',
        icon: '🌳',
        description: 'Un arbre millénaire vous murmure des secrets oubliés...',
        effect: (p) => {
            const xp = rollXP(50, 70); // ~4d6 XP
            p.xp += xp;
            p.esprit += 1;
            return `La sagesse de l\'arbre vous accorde ${xp} XP et augmente votre esprit de 1 !`;
        },
        location: 'forest'
    },
    {
        type: 'trap',
        name: 'Marécage Traître',
        icon: '🌊',
        description: 'Vous vous enfoncez dans un marécage boueux !',
        effect: (p) => {
            const baseDamage = rollRange(18, 40); // ~4d6 damage
            const damage = Math.max(1, baseDamage - p.defense);
            p.health = Math.max(1, p.health - damage);
            return `Vous perdez ${damage} HP en vous extirpant de la boue !`;
        },
        location: 'forest'
    },
    {
        type: 'treasure',
        name: 'Champignons Lumineux',
        icon: '🍄',
        description: 'Des champignons lumineux dégagent une lueur apaisante...',
        effect: (p) => {
            const healing = Math.floor(p.maxHealth * 0.20);
            p.health = Math.min(p.maxHealth, p.health + healing);
            const xp = rollXP(25, 35); // ~3d6 XP
            p.xp += xp;
            return `Leur aura magique vous restaure ${healing} HP et vous octroie ${xp} XP !`;
        },
        location: 'forest'
    },
    {
        type: 'special',
        name: 'Nid d\'Oiseau Rare',
        icon: '🪺',
        description: 'Vous trouvez un nid d\'oiseau rare avec des œufs précieux...',
        effect: (p) => {
            const gold = rollGold(60, 80); // ~4d6 gold
            p.gold += gold;
            return `Vous vendez délicatement les œufs et gagnez ${gold} pièces d\'or !`;
        },
        location: 'forest'
    },
    {
        type: 'trap',
        name: 'Plantes Épineuses',
        icon: '🌵',
        description: 'Vous êtes blessé par des plantes épineuses envahissantes !',
        effect: (p) => {
            const baseDamage = rollRange(10, 25); // ~2d6 damage
            const damage = Math.max(1, baseDamage - p.defense);
            p.health = Math.max(1, p.health - damage);
            return `Les épines vous infligent ${damage} HP de dégâts !`;
        },
        location: 'forest'
    },
    {
        type: 'special',
        name: 'Source Thermale',
        icon: '♨️',
        description: 'Vous découvrez une source thermale naturelle cachée dans les rochers...',
        effect: (p) => {
            const healing = Math.floor(p.maxHealth * 0.50);
            p.health = Math.min(p.maxHealth, p.health + healing);
            return `Les eaux chaudes vous revitalisent ! Vous récupérez ${healing} HP !`;
        },
        location: 'forest'
    },
    {
        type: 'treasure',
        name: 'Cristal de Mana',
        icon: '💠',
        description: 'Un cristal bleu palpite d\'énergie magique pure...',
        effect: (p) => {
            const xp = rollXP(60, 80); // ~4d6 XP
            p.xp += xp;
            if (p.maxEnergy !== undefined) {
                p.energy = Math.min(p.maxEnergy, p.energy + 25);
                return `Vous absorbez le mana et gagnez ${xp} XP et 25 énergie !`;
            }
            return `Vous absorbez le mana et gagnez ${xp} XP !`;
        },
        location: 'forest'
    },
    {
        type: 'trap',
        name: 'Guêpes Furieuses',
        icon: '🐝',
        description: 'Vous dérangez un nid de guêpes agressives !',
        effect: (p) => {
            const baseDamage = rollRange(20, 45); // ~4d6 damage
            const damage = Math.max(1, baseDamage - p.defense);
            p.health = Math.max(1, p.health - damage);
            return `Les piqûres vous causent ${damage} HP de dégâts !`;
        },
        location: 'forest'
    },
    {
        type: 'special',
        name: 'Cerf Majestueux',
        icon: '🦌',
        description: 'Un cerf blanc majestueux croise votre chemin et vous bénit de son regard...',
        effect: (p) => {
            const xp = rollXP(40, 50); // ~3d6 XP
            p.xp += xp;
            p.presence += 1;
            return `Cette rencontre rare vous accorde ${xp} XP et augmente votre présence de 1 !`;
        },
        location: 'forest'
    },
    {
        type: 'treasure',
        name: 'Grotte aux Pierres Précieuses',
        icon: '⛏️',
        description: 'Vous découvrez une petite grotte remplie de pierres précieuses !',
        effect: (p) => {
            const gold = rollGold(100, 150); // ~6d6 gold
            p.gold += gold;
            return `Vous récoltez des gemmes et gagnez ${gold} pièces d\'or !`;
        },
        location: 'forest'
    },
    {
        type: 'trap',
        name: 'Brouillard Égarant',
        icon: '🌫️',
        description: 'Un brouillard épais vous fait perdre votre chemin pendant des heures...',
        effect: (p) => {
            const baseDamage = rollRange(5, 15);
            const damage = Math.max(1, baseDamage);
            p.health = Math.max(1, p.health - damage);
            if (p.energy !== undefined) {
                p.energy = Math.max(0, p.energy - 10);
                return `La fatigue vous fait perdre ${damage} HP et 10 énergie !`;
            }
            return `La fatigue vous fait perdre ${damage} HP !`;
        },
        location: 'forest'
    },
    {
        type: 'special',
        name: 'Rencontre avec un Ermite',
        icon: '🧙',
        description: 'Un ermite sage partage ses connaissances avec vous...',
        effect: (p) => {
            const xp = rollXP(70, 60);
            p.xp += xp;
            p.esprit += 2;
            return `Vous apprenez beaucoup et gagnez ${xp} XP ! Votre esprit augmente de 2 !`;
        },
        location: 'forest'
    },
    // Additional Village Events
    {
        type: 'treasure',
        name: 'Loterie du Village',
        icon: '🎫',
        description: 'Vous gagnez à la loterie du village !',
        effect: (p) => {
            const gold = rollGold(70, 100);
            p.gold += gold;
            return `Félicitations ! Vous remportez ${gold} pièces d\'or !`;
        },
        location: 'village'
    },
    {
        type: 'special',
        name: 'Guérisseur du Village',
        icon: '⚕️',
        description: 'Un guérisseur généreux vous offre ses soins gratuitement...',
        effect: (p) => {
            const healing = Math.floor(p.maxHealth * 0.60);
            p.health = Math.min(p.maxHealth, p.health + healing);
            return `Le guérisseur vous restaure ${healing} HP !`;
        },
        location: 'village'
    },
    {
        type: 'theft',
        name: 'Joueur de Bonneteau',
        icon: '🃏',
        description: 'Un escroc vous défie à un jeu de bonneteau...',
        effect: (p) => {
            const stolenGold = rollGold(40, 60);
            const actualLoss = Math.min(stolenGold, p.gold);
            p.gold = Math.max(0, p.gold - actualLoss);
            return actualLoss > 0 ? `Vous perdez la partie et ${actualLoss} pièces d\'or !` : 'Sans or, vous ne pouvez pas jouer !';
        },
        location: 'village'
    },
    {
        type: 'special',
        name: 'Tournoi de Tir à l\'Arc',
        icon: '🎯',
        description: 'Vous participez à un tournoi de tir à l\'arc du village...',
        effect: (p) => {
            const gold = rollGold(50, 70);
            const xp = rollXP(45, 55);
            p.gold += gold;
            p.xp += xp;
            p.dexterite = (p.dexterite || 0) + 1;
            return `Vous remportez le tournoi ! Vous gagnez ${gold} or, ${xp} XP et +1 dextérité !`;
        },
        location: 'village'
    },
    {
        type: 'treasure',
        name: 'Bourse Trouvée',
        icon: '👛',
        description: 'Vous trouvez une bourse abandonnée dans la rue...',
        effect: (p) => {
            const gold = rollGold(35, 45);
            p.gold += gold;
            return `La bourse contient ${gold} pièces d\'or !`;
        },
        location: 'village'
    },
    {
        type: 'special',
        name: 'Bibliothèque Ancienne',
        icon: '📚',
        description: 'Vous passez du temps dans la bibliothèque du village à étudier d\'anciens grimoires...',
        effect: (p) => {
            const xp = rollXP(55, 65);
            p.xp += xp;
            p.esprit += 2;
            return `Vos études vous rapportent ${xp} XP et augmentent votre esprit de 2 !`;
        },
        location: 'village'
    },
    {
        type: 'theft',
        name: 'Taxe Imprévue',
        icon: '📜',
        description: 'Le collecteur d\'impôts exige une taxe supplémentaire inattendue !',
        effect: (p) => {
            const stolenGold = rollGold(25, 35);
            const actualLoss = Math.min(stolenGold, p.gold);
            p.gold = Math.max(0, p.gold - actualLoss);
            return actualLoss > 0 ? `Vous payez ${actualLoss} pièces d\'or en taxes !` : 'Vous êtes exempté car vous n\'avez pas d\'or !';
        },
        location: 'village'
    },
    {
        type: 'special',
        name: 'Concert de Ménestrel',
        icon: '🎵',
        description: 'Un ménestrel talentueux joue une mélodie enchanteresse sur la place du village...',
        effect: (p) => {
            const healing = Math.floor(p.maxHealth * 0.15);
            p.health = Math.min(p.maxHealth, p.health + healing);
            if (p.energy !== undefined) {
                p.energy = Math.min(p.maxEnergy, p.energy + 15);
                return `La musique apaise votre esprit ! Vous récupérez ${healing} HP et 15 énergie !`;
            }
            return `La musique apaise votre esprit ! Vous récupérez ${healing} HP !`;
        },
        location: 'village'
    },
    {
        type: 'treasure',
        name: 'Donation Généreuse',
        icon: '💝',
        description: 'Un noble riche admire votre courage et vous fait une donation !',
        effect: (p) => {
            const gold = rollGold(80, 120);
            p.gold += gold;
            return `Le noble vous offre généreusement ${gold} pièces d\'or !`;
        },
        location: 'village'
    },
    {
        type: 'special',
        name: 'Forge du Maître',
        icon: '⚒️',
        description: 'Le forgeron maître vous enseigne quelques techniques...',
        effect: (p) => {
            const xp = rollXP(50, 50);
            p.xp += xp;
            p.puissance = (p.puissance || 0) + 1;
            return `Vous apprenez de nouvelles techniques ! Vous gagnez ${xp} XP et +1 puissance !`;
        },
        location: 'village'
    },
    {
        type: 'theft',
        name: 'Jeu de Dés Truqué',
        icon: '🎲',
        description: 'Vous êtes piégé dans un jeu de dés truqué à la taverne...',
        effect: (p) => {
            const stolenGold = rollGold(35, 55);
            const actualLoss = Math.min(stolenGold, p.gold);
            p.gold = Math.max(0, p.gold - actualLoss);
            return actualLoss > 0 ? `Les dés étaient pipés ! Vous perdez ${actualLoss} pièces d\'or !` : 'Sans argent, vous ne pouvez pas jouer !';
        },
        location: 'village'
    },
    {
        type: 'special',
        name: 'Marché aux Épices',
        icon: '🌶️',
        description: 'Un marchand d\'épices exotiques vous offre un échantillon gratuit...',
        effect: (p) => {
            const healing = Math.floor(p.maxHealth * 0.20);
            p.health = Math.min(p.maxHealth, p.health + healing);
            const xp = rollXP(30, 40);
            p.xp += xp;
            return `Les épices revigorent votre corps ! Vous récupérez ${healing} HP et gagnez ${xp} XP !`;
        },
        location: 'village'
    },
    {
        type: 'treasure',
        name: 'Héritage Inattendu',
        icon: '📨',
        description: 'Vous recevez un message concernant un petit héritage d\'un parent éloigné...',
        effect: (p) => {
            const gold = rollGold(90, 110);
            p.gold += gold;
            return `Vous héritez de ${gold} pièces d\'or !`;
        },
        location: 'village'
    },
    {
        type: 'special',
        name: 'Temple de la Sagesse',
        icon: '🕌',
        description: 'Vous méditez dans le temple du village et trouvez la paix intérieure...',
        effect: (p) => {
            const healing = Math.floor(p.maxHealth * 0.40);
            p.health = Math.min(p.maxHealth, p.health + healing);
            p.esprit += 1;
            return `La méditation vous restaure ${healing} HP et augmente votre esprit de 1 !`;
        },
        location: 'village'
    },
    {
        type: 'theft',
        name: 'Fausse Quête',
        icon: '🗺️',
        description: 'Un escroc vous vend une fausse carte au trésor...',
        effect: (p) => {
            const stolenGold = rollGold(20, 30);
            const actualLoss = Math.min(stolenGold, p.gold);
            p.gold = Math.max(0, p.gold - actualLoss);
            return actualLoss > 0 ? `Vous réalisez l\'arnaque trop tard et perdez ${actualLoss} pièces d\'or !` : 'Vous n\'avez pas d\'argent pour acheter la carte !';
        },
        location: 'village'
    },
    {
        type: 'special',
        name: 'Leçon d\'Équitation',
        icon: '🐴',
        description: 'Un chevalier vous donne une leçon d\'équitation gratuite...',
        effect: (p) => {
            const xp = rollXP(40, 50);
            p.xp += xp;
            p.dexterite = (p.dexterite || 0) + 1;
            return `Vous apprenez à mieux contrôler une monture ! Vous gagnez ${xp} XP et +1 dextérité !`;
        },
        location: 'village'
    },
    {
        type: 'treasure',
        name: 'Vente aux Enchères',
        icon: '🔨',
        description: 'Vous trouvez une affaire incroyable lors d\'une vente aux enchères !',
        effect: (p) => {
            const gold = rollGold(55, 75);
            p.gold += gold;
            return `Vous revendez l\'objet avec profit et gagnez ${gold} pièces d\'or !`;
        },
        location: 'village'
    },
    {
        type: 'special',
        name: 'Entraînement au Dojo',
        icon: '🥋',
        description: 'Le maître du dojo vous invite à une session d\'entraînement...',
        effect: (p) => {
            const xp = rollXP(60, 70);
            p.xp += xp;
            p.defense = (p.defense || 0) + 1;
            return `L\'entraînement intensif vous rapporte ${xp} XP et augmente votre défense de 1 !`;
        },
        location: 'village'
    },
    {
        type: 'treasure',
        name: 'Spectacle de Rue',
        icon: '🎭',
        description: 'Vous impressionnez la foule avec vos talents et recevez des pourboires...',
        effect: (p) => {
            const gold = rollGold(30, 50);
            p.gold += gold;
            p.presence += 1;
            return `Vos talents sont applaudis ! Vous gagnez ${gold} pièces d\'or et +1 présence !`;
        },
        location: 'village'
    }
];

// Riddles
export const riddles = [
    {
        question: 'Je parle sans bouche et j\'entends sans oreilles. Je n\'ai pas de corps, mais je prends vie avec le vent. Qui suis-je ?',
        answers: ['écho', 'echo', 'l\'écho', "l'écho"],
        getReward: () => ({ gold: rollGold(80, 40), xp: rollXP(60, 30) })
    },
    {
        question: 'Plus on m\'enlève, plus je deviens grand. Que suis-je ?',
        answers: ['trou', 'un trou', 'le trou'],
        getReward: () => ({ gold: rollGold(65, 30), xp: rollXP(50, 20) })
    },
    {
        question: 'Je suis toujours devant toi mais tu ne peux jamais me voir. Qui suis-je ?',
        answers: ['futur', 'avenir', 'le futur', 'l\'avenir', "l'avenir"],
        getReward: () => ({ gold: rollGold(75, 30), xp: rollXP(60, 20) })
    }
];

// Moral choices
export const moralChoices = [
    {
        situation: 'Un mendiant affamé vous supplie de lui donner de la nourriture. Que faites-vous ?',
        choices: [
            {
                text: 'Donner 50 pièces d\'or',
                effect: (p) => {
                    if (p.gold >= 50) {
                        p.gold -= 50;
                        const presenceBonus = rollRange(1, 3);
                        p.presence += presenceBonus;
                        return `Vous aidez le mendiant. Votre présence augmente de ${presenceBonus} ! (-50 or)`;
                    } else {
                        return 'Vous n\'avez pas assez d\'or...';
                    }
                }
            },
            {
                text: 'Ignorer et continuer',
                effect: (p) => {
                    p.presence -= 1;
                    return 'Vous ignorez le mendiant. Votre présence diminue de 1.';
                }
            }
        ]
    },
    {
        situation: 'Vous trouvez une bourse remplie d\'or près d\'un cadavre. Que faites-vous ?',
        choices: [
            {
                text: 'Prendre l\'or',
                effect: (p) => {
                    const goldFound = rollGold(60, 40);
                    p.gold += goldFound;
                    p.esprit -= 1;
                    return `Vous prenez l\'or. Vous gagnez ${goldFound} pièces d\'or mais votre esprit diminue de 1.`;
                }
            },
            {
                text: 'Laisser l\'or et prier pour le défunt',
                effect: (p) => {
                    const espritBonus = rollRange(1, 2);
                    const xpBonus = rollXP(40, 30);
                    p.esprit += espritBonus;
                    p.xp += xpBonus;
                    return `Vous respectez les morts. Votre esprit augmente de ${espritBonus} et vous gagnez ${xpBonus} XP.`;
                }
            }
        ]
    }
];
