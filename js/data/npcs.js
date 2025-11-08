// NPC Data Module
export const npcs = [
    { 
        name: 'Sage Mystérieux',
        icon: '🧙‍♂️',
        dialogue: 'Je sens en toi un grand potentiel, jeune aventurier. Chaque combat te rendra plus fort !',
        reward: null
    },
    { 
        name: 'Forgeron',
        icon: '⚒️',
        dialogue: 'Mes armes sont les meilleures du royaume ! Visite ma boutique si tu as de l\'or.',
        reward: null
    },
    { 
        name: 'Prêtre',
        icon: '⛪',
        dialogue: 'Que la lumière te guide dans les ténèbres du donjon. Tiens, prends cette bénédiction !',
        reward: { type: 'heal', amount: 30 }
    },
    { 
        name: 'Chasseur de Trésors',
        icon: '🗺️',
        dialogue: 'J\'ai trouvé quelques pièces d\'or en explorant. Tiens, prends-les, j\'en ai assez !',
        reward: { type: 'gold', amount: 25 }
    },
    { 
        name: 'Vieux Guerrier',
        icon: '🛡️',
        dialogue: 'La classe d\'armure est tout aussi importante que l\'attaque. N\'oublie jamais cela !',
        reward: null
    },
    {
        name: 'Marchand Itinérant',
        icon: '🧙‍♂️',
        dialogue: 'Psst... J\'ai des objets rares à vendre. Intéressé ?',
        reward: null,
        special: 'wandering_merchant'
    },
    {
        name: 'Bijoutier',
        icon: '💎',
        dialogue: 'Bienvenue dans ma bijouterie ! J\'achète et vends des métaux précieux. Mes prix varient selon le marché du jour...',
        reward: null,
        special: 'jeweler'
    }
];
