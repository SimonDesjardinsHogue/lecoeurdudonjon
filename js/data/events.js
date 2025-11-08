// Game Events Data Module
// Random events
export const randomEvents = [
    {
        type: 'treasure',
        name: 'Coffre au Trésor',
        icon: '💰',
        description: 'Vous découvrez un coffre rempli de pièces d\'or !',
        effect: (p) => {
            const gold = 30 + Math.floor(Math.random() * 150);
            p.gold += gold;
            return `Vous gagnez ${gold} pièces d\'or !`;
        }
    },
    {
        type: 'treasure',
        name: 'Gemme Magique',
        icon: '💎',
        description: 'Une gemme magique brille dans l\'obscurité...',
        effect: (p) => {
            const xp = 30 + Math.floor(Math.random() * 90);
            p.xp += xp;
            return `Vous absorbez son énergie et gagnez ${xp} XP !`;
        }
    },
    {
        type: 'trap',
        name: 'Piège à Pointes',
        icon: '🗡️',
        description: 'Vous déclenchez un piège caché !',
        effect: (p) => {
            const baseDamage = 15 + Math.floor(Math.random() * 20);
            const damage = Math.max(1, baseDamage - p.defense);
            p.health = Math.max(1, p.health - damage);
            return `Vous perdez ${damage} HP !`;
        }
    },
    {
        type: 'trap',
        name: 'Gaz Toxique',
        icon: '☠️',
        description: 'Une brume toxique emplit la pièce !',
        effect: (p) => {
            const baseDamage = 10 + Math.floor(Math.random() * 15);
            const damage = Math.max(1, baseDamage - Math.floor(p.constitution / 2));
            p.health = Math.max(1, p.health - damage);
            return `Vous perdez ${damage} HP à cause du poison !`;
        }
    },
    {
        type: 'special',
        name: 'Fontaine de Guérison',
        icon: '⛲',
        description: 'Vous trouvez une fontaine aux eaux cristallines...',
        effect: (p) => {
            const healingPercent = 0.40 + Math.random() * 0.30; // 40% to 70%
            const healing = Math.floor(p.maxHealth * healingPercent);
            p.health = Math.min(p.maxHealth, p.health + healing);
            return `Vous buvez l\'eau et récupérez ${healing} HP !`;
        }
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
        }
    }
];

// Riddles
export const riddles = [
    {
        question: 'Je parle sans bouche et j\'entends sans oreilles. Je n\'ai pas de corps, mais je prends vie avec le vent. Qui suis-je ?',
        answers: ['écho', 'echo', 'l\'écho', "l'écho"],
        getReward: () => ({ gold: 80 + Math.floor(Math.random() * 40), xp: 60 + Math.floor(Math.random() * 30) })
    },
    {
        question: 'Plus on m\'enlève, plus je deviens grand. Que suis-je ?',
        answers: ['trou', 'un trou', 'le trou'],
        getReward: () => ({ gold: 65 + Math.floor(Math.random() * 30), xp: 50 + Math.floor(Math.random() * 20) })
    },
    {
        question: 'Je suis toujours devant toi mais tu ne peux jamais me voir. Qui suis-je ?',
        answers: ['futur', 'avenir', 'le futur', 'l\'avenir', "l'avenir"],
        getReward: () => ({ gold: 75 + Math.floor(Math.random() * 30), xp: 60 + Math.floor(Math.random() * 20) })
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
                        const charismaBonus = 1 + Math.floor(Math.random() * 3); // 1-3 charisma
                        p.charisma += charismaBonus;
                        return `Vous aidez le mendiant. Votre charisme augmente de ${charismaBonus} ! (-50 or)`;
                    } else {
                        return 'Vous n\'avez pas assez d\'or...';
                    }
                }
            },
            {
                text: 'Ignorer et continuer',
                effect: (p) => {
                    p.charisma -= 1;
                    return 'Vous ignorez le mendiant. Votre charisme diminue de 1.';
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
                    const goldFound = 60 + Math.floor(Math.random() * 40); // 60-100 gold
                    p.gold += goldFound;
                    p.wisdom -= 1;
                    return `Vous prenez l\'or. Vous gagnez ${goldFound} pièces d\'or mais votre sagesse diminue de 1.`;
                }
            },
            {
                text: 'Laisser l\'or et prier pour le défunt',
                effect: (p) => {
                    const wisdomBonus = 1 + Math.floor(Math.random() * 2); // 1-2 wisdom
                    const xpBonus = 40 + Math.floor(Math.random() * 30); // 40-70 XP
                    p.wisdom += wisdomBonus;
                    p.xp += xpBonus;
                    return `Vous respectez les morts. Votre sagesse augmente de ${wisdomBonus} et vous gagnez ${xpBonus} XP.`;
                }
            }
        ]
    }
];
