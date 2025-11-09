// Shop Items Data Module
// Shop items (functions will be set by shop system module)
// Categories: heal, damage, energy, exp, equipment
export const shopItems = [
    // Healing potions (10 tiers for level 1-20)
    { name: 'Potion de Soin Minuscule', icon: '🧪', description: 'Restaure 20 HP', cost: 15, category: 'heal', type: 'potion', strength: 'tier1', effect: null },
    { name: 'Petite Potion de Soin', icon: '🧪', description: 'Restaure 40 HP', cost: 25, category: 'heal', type: 'potion', strength: 'tier2', effect: null },
    { name: 'Potion de Soin', icon: '🧪', description: 'Restaure 60 HP', cost: 40, category: 'heal', type: 'potion', strength: 'tier3', effect: null },
    { name: 'Grande Potion de Soin', icon: '⚗️', description: 'Restaure 90 HP', cost: 60, category: 'heal', type: 'potion', strength: 'tier4', effect: null },
    { name: 'Potion de Soin Majeure', icon: '⚗️', description: 'Restaure 120 HP', cost: 85, category: 'heal', type: 'potion', strength: 'tier5', effect: null },
    { name: 'Potion de Soin Suprême', icon: '⚗️', description: 'Restaure 160 HP', cost: 115, category: 'heal', type: 'potion', strength: 'tier6', effect: null },
    { name: 'Potion de Soin Ultime', icon: '⚗️', description: 'Restaure 220 HP', cost: 150, category: 'heal', type: 'potion', strength: 'tier7', effect: null },
    { name: 'Élixir de Soin Divin', icon: '⚗️', description: 'Restaure 300 HP', cost: 200, category: 'heal', type: 'potion', strength: 'tier8', effect: null },
    { name: 'Élixir de Soin Céleste', icon: '⚗️', description: 'Restaure 400 HP', cost: 275, category: 'heal', type: 'potion', strength: 'tier9', effect: null },
    { name: 'Élixir de Soin Immortel', icon: '⚗️', description: 'Restaure 550 HP', cost: 375, category: 'heal', type: 'potion', strength: 'tier10', effect: null },
    
    // Damage potions (10 tiers for level 1-20)
    { name: 'Potion de Force Minuscule', icon: '💪', description: '+1 Force', cost: 30, category: 'damage', type: 'potion', strength: 'tier1', effect: null },
    { name: 'Potion de Force Mineure', icon: '💪', description: '+3 Force', cost: 50, category: 'damage', type: 'potion', strength: 'tier2', effect: null },
    { name: 'Potion de Force', icon: '💪', description: '+5 Force', cost: 75, category: 'damage', type: 'potion', strength: 'tier3', effect: null },
    { name: 'Potion de Force Supérieure', icon: '💪', description: '+7 Force', cost: 110, category: 'damage', type: 'potion', strength: 'tier4', effect: null },
    { name: 'Potion de Force Majeure', icon: '💪', description: '+9 Force', cost: 150, category: 'damage', type: 'potion', strength: 'tier5', effect: null },
    { name: 'Potion de Force Extrême', icon: '💪', description: '+10 Force', cost: 195, category: 'damage', type: 'potion', strength: 'tier6', effect: null },
    { name: 'Potion de Force Titanesque', icon: '💪', description: '+12 Force', cost: 250, category: 'damage', type: 'potion', strength: 'tier7', effect: null },
    { name: 'Potion de Force Divine', icon: '💪', description: '+15 Force', cost: 325, category: 'damage', type: 'potion', strength: 'tier8', effect: null },
    { name: 'Potion de Force Céleste', icon: '💪', description: '+18 Force', cost: 425, category: 'damage', type: 'potion', strength: 'tier9', effect: null },
    { name: 'Potion de Force Immortelle', icon: '💪', description: '+22 Force', cost: 550, category: 'damage', type: 'potion', strength: 'tier10', effect: null },
    
    // Energy potions
    { name: 'Potion d\'Énergie Mineure', icon: '⚡', description: 'Restaure 30 Énergie', cost: 25, category: 'energy', type: 'potion', strength: 'weak', effect: null },
    { name: 'Potion d\'Énergie', icon: '⚡', description: 'Restaure 50 Énergie', cost: 40, category: 'energy', type: 'potion', strength: 'normal', effect: null },
    { name: 'Potion d\'Énergie Majeure', icon: '⚡', description: 'Restaure 100 Énergie', cost: 80, category: 'energy', type: 'potion', strength: 'strong', effect: null },
    
    // Experience potions
    { name: 'Potion d\'Expérience Mineure', icon: '✨', description: '+30 XP', cost: 40, category: 'exp', type: 'potion', strength: 'weak', effect: null },
    { name: 'Potion d\'Expérience', icon: '✨', description: '+60 XP', cost: 70, category: 'exp', type: 'potion', strength: 'normal', effect: null },
    { name: 'Potion d\'Expérience Majeure', icon: '✨', description: '+120 XP', cost: 130, category: 'exp', type: 'potion', strength: 'strong', effect: null },
    
    // Weapons for Guerrier (Warrior) - 10 tiers for level 1-20
    { name: 'Épée Rouillée', icon: '⚔️', description: '1 de dégât\n✨ +1 Force', cost: 40, category: 'equipment', type: 'weapon', classRestriction: 'guerrier', bonus: 1, rarity: 'commun', effect: null },
    { name: 'Épée en Fer', icon: '⚔️', description: '3 de dégât\n✨ +1 Force', cost: 80, category: 'equipment', type: 'weapon', classRestriction: 'guerrier', bonus: 3, rarity: 'commun', effect: null },
    { name: 'Épée en Acier', icon: '⚔️', description: '5 de dégât\n✨ +1 Force', cost: 130, category: 'equipment', type: 'weapon', classRestriction: 'guerrier', bonus: 5, rarity: 'rare', effect: null },
    { name: 'Épée Enchantée', icon: '⚔️', description: '7 de dégât\n✨ +1 Force', cost: 200, category: 'equipment', type: 'weapon', classRestriction: 'guerrier', bonus: 7, rarity: 'rare', effect: null },
    { name: 'Épée Flamboyante', icon: '⚔️', description: '9 de dégât\n✨ +1 Force', cost: 290, category: 'equipment', type: 'weapon', classRestriction: 'guerrier', bonus: 9, rarity: 'epique', effect: null },
    { name: 'Épée Runique', icon: '⚔️', description: '10 de dégât\n✨ +1 Force', cost: 400, category: 'equipment', type: 'weapon', classRestriction: 'guerrier', bonus: 10, rarity: 'epique', effect: null },
    { name: 'Épée Légendaire', icon: '⚔️', description: '12 de dégât\n✨ +1 Force', cost: 550, category: 'equipment', type: 'weapon', classRestriction: 'guerrier', bonus: 12, rarity: 'legendaire', effect: null },
    { name: 'Épée Divine', icon: '⚔️', description: '15 de dégât\n✨ +1 Force', cost: 750, category: 'equipment', type: 'weapon', classRestriction: 'guerrier', bonus: 15, rarity: 'legendaire', effect: null },
    { name: 'Épée Céleste', icon: '⚔️', description: '18 de dégât\n✨ +1 Force', cost: 1000, category: 'equipment', type: 'weapon', classRestriction: 'guerrier', bonus: 18, rarity: 'legendaire', effect: null },
    { name: 'Épée du Conquérant Suprême', icon: '⚔️', description: '22 de dégât\n✨ +1 Force', cost: 1350, category: 'equipment', type: 'weapon', classRestriction: 'guerrier', bonus: 22, rarity: 'legendaire', effect: null },
    
    // Weapons for Archer - 10 tiers for level 1-20
    { name: 'Arc Basique', icon: '🏹', description: '1 de dégât\n✨ +1 Force', cost: 40, category: 'equipment', type: 'weapon', classRestriction: 'archer', bonus: 1, rarity: 'commun', effect: null },
    { name: 'Arc Court', icon: '🏹', description: '3 de dégât\n✨ +1 Force', cost: 80, category: 'equipment', type: 'weapon', classRestriction: 'archer', bonus: 3, rarity: 'commun', effect: null },
    { name: 'Arc Long', icon: '🏹', description: '5 de dégât\n✨ +1 Force', cost: 130, category: 'equipment', type: 'weapon', classRestriction: 'archer', bonus: 5, rarity: 'rare', effect: null },
    { name: 'Arc Composite', icon: '🏹', description: '7 de dégât\n✨ +1 Force', cost: 200, category: 'equipment', type: 'weapon', classRestriction: 'archer', bonus: 7, rarity: 'rare', effect: null },
    { name: 'Arc Elfique', icon: '🏹', description: '9 de dégât\n✨ +1 Force', cost: 290, category: 'equipment', type: 'weapon', classRestriction: 'archer', bonus: 9, rarity: 'epique', effect: null },
    { name: 'Arc Runique', icon: '🏹', description: '10 de dégât\n✨ +1 Force', cost: 400, category: 'equipment', type: 'weapon', classRestriction: 'archer', bonus: 10, rarity: 'epique', effect: null },
    { name: 'Arc Légendaire', icon: '🏹', description: '12 de dégât\n✨ +1 Force', cost: 550, category: 'equipment', type: 'weapon', classRestriction: 'archer', bonus: 12, rarity: 'legendaire', effect: null },
    { name: 'Arc du Chasseur Divin', icon: '🏹', description: '15 de dégât\n✨ +1 Force', cost: 750, category: 'equipment', type: 'weapon', classRestriction: 'archer', bonus: 15, rarity: 'legendaire', effect: null },
    { name: 'Arc Céleste', icon: '🏹', description: '18 de dégât\n✨ +1 Force', cost: 1000, category: 'equipment', type: 'weapon', classRestriction: 'archer', bonus: 18, rarity: 'legendaire', effect: null },
    { name: 'Arc de l\'Étoile Filante', icon: '🏹', description: '22 de dégât\n✨ +1 Force', cost: 1350, category: 'equipment', type: 'weapon', classRestriction: 'archer', bonus: 22, rarity: 'legendaire', effect: null },
    
    // Weapons for Magicien (Mage) - 10 tiers for level 1-20
    { name: 'Bâton de Bois', icon: '🔮', description: '1 de dégât\n✨ +1 Force', cost: 40, category: 'equipment', type: 'weapon', classRestriction: 'magicien', bonus: 1, rarity: 'commun', effect: null },
    { name: 'Bâton d\'Apprenti', icon: '🔮', description: '3 de dégât\n✨ +1 Force', cost: 80, category: 'equipment', type: 'weapon', classRestriction: 'magicien', bonus: 3, rarity: 'commun', effect: null },
    { name: 'Bâton Mystique', icon: '🔮', description: '5 de dégât\n✨ +1 Force', cost: 130, category: 'equipment', type: 'weapon', classRestriction: 'magicien', bonus: 5, rarity: 'rare', effect: null },
    { name: 'Bâton Enchanté', icon: '🔮', description: '7 de dégât\n✨ +1 Force', cost: 200, category: 'equipment', type: 'weapon', classRestriction: 'magicien', bonus: 7, rarity: 'rare', effect: null },
    { name: 'Bâton de Pouvoir', icon: '🔮', description: '9 de dégât\n✨ +1 Force', cost: 290, category: 'equipment', type: 'weapon', classRestriction: 'magicien', bonus: 9, rarity: 'epique', effect: null },
    { name: 'Bâton Runique', icon: '🔮', description: '10 de dégât\n✨ +1 Force', cost: 400, category: 'equipment', type: 'weapon', classRestriction: 'magicien', bonus: 10, rarity: 'epique', effect: null },
    { name: 'Bâton Légendaire', icon: '🔮', description: '12 de dégât\n✨ +1 Force', cost: 550, category: 'equipment', type: 'weapon', classRestriction: 'magicien', bonus: 12, rarity: 'legendaire', effect: null },
    { name: 'Bâton de l\'Archimage', icon: '🔮', description: '15 de dégât\n✨ +1 Force', cost: 750, category: 'equipment', type: 'weapon', classRestriction: 'magicien', bonus: 15, rarity: 'legendaire', effect: null },
    { name: 'Bâton Céleste', icon: '🔮', description: '18 de dégât\n✨ +1 Force', cost: 1000, category: 'equipment', type: 'weapon', classRestriction: 'magicien', bonus: 18, rarity: 'legendaire', effect: null },
    { name: 'Bâton de l\'Univers', icon: '🔮', description: '22 de dégât\n✨ +1 Force', cost: 1350, category: 'equipment', type: 'weapon', classRestriction: 'magicien', bonus: 22, rarity: 'legendaire', effect: null },
    
    // Armors (10 tiers for level 1-20)
    { name: 'Armure en Tissu', icon: '🛡️', description: '+1 Défense', cost: 35, category: 'equipment', type: 'armor', bonus: 1, rarity: 'commun', effect: null },
    { name: 'Armure de Cuir', icon: '🛡️', description: '+3 Défense', cost: 70, category: 'equipment', type: 'armor', bonus: 3, rarity: 'commun', effect: null },
    { name: 'Armure Clouée', icon: '🛡️', description: '+5 Défense', cost: 115, category: 'equipment', type: 'armor', bonus: 5, rarity: 'rare', effect: null },
    { name: 'Cotte de Mailles', icon: '🛡️', description: '+7 Défense', cost: 180, category: 'equipment', type: 'armor', bonus: 7, rarity: 'rare', effect: null },
    { name: 'Armure d\'Acier', icon: '🛡️', description: '+9 Défense', cost: 265, category: 'equipment', type: 'armor', bonus: 9, rarity: 'epique', effect: null },
    { name: 'Armure Enchantée', icon: '🛡️', description: '+10 Défense', cost: 370, category: 'equipment', type: 'armor', bonus: 10, rarity: 'epique', effect: null },
    { name: 'Armure Runique', icon: '🛡️', description: '+12 Défense', cost: 510, category: 'equipment', type: 'armor', bonus: 12, rarity: 'legendaire', effect: null },
    { name: 'Armure Divine', icon: '🛡️', description: '+15 Défense', cost: 700, category: 'equipment', type: 'armor', bonus: 15, rarity: 'legendaire', effect: null },
    { name: 'Armure Céleste', icon: '🛡️', description: '+18 Défense', cost: 950, category: 'equipment', type: 'armor', bonus: 18, rarity: 'legendaire', effect: null },
    { name: 'Armure Immortelle', icon: '🛡️', description: '+22 Défense', cost: 1300, category: 'equipment', type: 'armor', bonus: 22, rarity: 'legendaire', effect: null }
];

// Rare items for wandering merchant
export const rareItems = [
    { name: 'Élixir de Résurrection', icon: '🧬', description: 'Restaure toute la santé et l\'énergie', cost: 300, category: 'heal', effect: null },
    { name: 'Potion de Géant', icon: '💪', description: '+12 Force', cost: 350, category: 'damage', effect: null },
    { name: 'Armure Runique', icon: '🛡️', description: '+8 Défense, +2 toutes stats', cost: 450, category: 'equipment', effect: null },
    { name: 'Amulette de Fortune', icon: '🍀', description: '+100 Or, +5 Charisme', cost: 250, category: 'equipment', effect: null },
    { name: 'Grimoire Ancien', icon: '📖', description: '+10 Intelligence, +200 XP', cost: 400, category: 'exp', effect: null }
];

// Legendary items - rewards from bosses
export const legendaryItems = [
    { name: 'Épée du Conquérant', icon: '⚔️', description: '+15 Force, +5 Dextérité', effect: (p) => { p.strength += 15; p.dexterity += 5; } },
    { name: 'Armure du Titan', icon: '🛡️', description: '+10 Défense, +30 PV Max', effect: (p) => { p.defense += 10; p.maxHealth += 30; p.health += 30; } },
    { name: 'Amulette de Vie', icon: '💎', description: '+50 PV Max, +3 Constitution', effect: (p) => { p.maxHealth += 50; p.health += 50; p.constitution += 3; } },
    { name: 'Anneau de Puissance', icon: '💍', description: '+8 Force, +8 Intelligence', effect: (p) => { p.strength += 8; p.intelligence += 8; } },
    { name: 'Cape de l\'Ombre', icon: '🦇', description: '+7 Dextérité, +5 Défense', effect: (p) => { p.dexterity += 7; p.defense += 5; } },
    { name: 'Couronne de Sagesse', icon: '👑', description: '+10 Intelligence, +10 Sagesse', effect: (p) => { p.intelligence += 10; p.wisdom += 10; } },
    { name: 'Marteau du Forgeron Divin', icon: '🔨', description: '+20 Force, +5 Constitution', effect: (p) => { p.strength += 20; p.constitution += 5; } },
    { name: 'Bâton du Mage Suprême', icon: '🔮', description: '+15 Intelligence, +50 Énergie Max', effect: (p) => { p.intelligence += 15; p.maxEnergy += 50; p.energy += 50; } }
];
