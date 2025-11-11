// Shop Items Data Module
// Shop items (functions will be set by shop system module)
// Categories: heal, damage, energy, exp, equipment
export const shopItems = [
    // Healing potions (10 tiers for level 1-20)
    { name: 'Potion de Soin Minuscule', icon: '🧪', description: 'Restaure 20 HP', cost: 14, category: 'heal', type: 'potion', strength: 'tier1', effect: null },
    { name: 'Petite Potion de Soin', icon: '🧪', description: 'Restaure 40 HP', cost: 23, category: 'heal', type: 'potion', strength: 'tier2', effect: null },
    { name: 'Potion de Soin', icon: '🧪', description: 'Restaure 60 HP', cost: 38, category: 'heal', type: 'potion', strength: 'tier3', effect: null },
    { name: 'Grande Potion de Soin', icon: '⚗️', description: 'Restaure 90 HP', cost: 57, category: 'heal', type: 'potion', strength: 'tier4', effect: null },
    { name: 'Potion de Soin Majeure', icon: '⚗️', description: 'Restaure 120 HP', cost: 80, category: 'heal', type: 'potion', strength: 'tier5', effect: null },
    { name: 'Potion de Soin Suprême', icon: '⚗️', description: 'Restaure 160 HP', cost: 222, category: 'heal', type: 'potion', strength: 'tier6', effect: null },
    { name: 'Potion de Soin Ultime', icon: '⚗️', description: 'Restaure 220 HP', cost: 346, category: 'heal', type: 'potion', strength: 'tier7', effect: null },
    { name: 'Élixir de Soin Divin', icon: '⚗️', description: 'Restaure 300 HP', cost: 519, category: 'heal', type: 'potion', strength: 'tier8', effect: null },
    { name: 'Élixir de Soin Céleste', icon: '⚗️', description: 'Restaure 400 HP', cost: 766, category: 'heal', type: 'potion', strength: 'tier9', effect: null },
    { name: 'Élixir de Soin Immortel', icon: '⚗️', description: 'Restaure 550 HP', cost: 1112, category: 'heal', type: 'potion', strength: 'tier10', effect: null },
    
    // Damage potions (10 tiers for level 1-20)
    { name: 'Potion de Force Minuscule', icon: '💪', description: '+1 Puissance', cost: 28, category: 'damage', type: 'potion', strength: 'tier1', effect: null },
    { name: 'Potion de Force Mineure', icon: '💪', description: '+3 Puissance', cost: 47, category: 'damage', type: 'potion', strength: 'tier2', effect: null },
    { name: 'Potion de Force', icon: '💪', description: '+5 Puissance', cost: 71, category: 'damage', type: 'potion', strength: 'tier3', effect: null },
    { name: 'Potion de Force Supérieure', icon: '💪', description: '+7 Puissance', cost: 104, category: 'damage', type: 'potion', strength: 'tier4', effect: null },
    { name: 'Potion de Force Majeure', icon: '💪', description: '+9 Puissance', cost: 142, category: 'damage', type: 'potion', strength: 'tier5', effect: null },
    { name: 'Potion de Force Extrême', icon: '💪', description: '+10 Puissance', cost: 346, category: 'damage', type: 'potion', strength: 'tier6', effect: null },
    { name: 'Potion de Force Titanesque', icon: '💪', description: '+12 Puissance', cost: 519, category: 'damage', type: 'potion', strength: 'tier7', effect: null },
    { name: 'Potion de Force Divine', icon: '💪', description: '+15 Puissance', cost: 766, category: 'damage', type: 'potion', strength: 'tier8', effect: null },
    { name: 'Potion de Force Céleste', icon: '💪', description: '+18 Puissance', cost: 1087, category: 'damage', type: 'potion', strength: 'tier9', effect: null },
    { name: 'Potion de Force Immortelle', icon: '💪', description: '+22 Puissance', cost: 1482, category: 'damage', type: 'potion', strength: 'tier10', effect: null },
    
    // Energy potions
    { name: 'Potion d\'Énergie Mineure', icon: '⚡', description: 'Restaure 30 Énergie', cost: 23, category: 'energy', type: 'potion', strength: 'weak', effect: null },
    { name: 'Potion d\'Énergie', icon: '⚡', description: 'Restaure 50 Énergie', cost: 38, category: 'energy', type: 'potion', strength: 'normal', effect: null },
    { name: 'Potion d\'Énergie Majeure', icon: '⚡', description: 'Restaure 100 Énergie', cost: 76, category: 'energy', type: 'potion', strength: 'strong', effect: null },
    
    // Experience potions
    { name: 'Potion d\'Expérience Mineure', icon: '✨', description: '+30 XP', cost: 38, category: 'exp', type: 'potion', strength: 'weak', effect: null },
    { name: 'Potion d\'Expérience', icon: '✨', description: '+60 XP', cost: 66, category: 'exp', type: 'potion', strength: 'normal', effect: null },
    { name: 'Potion d\'Expérience Majeure', icon: '✨', description: '+120 XP', cost: 123, category: 'exp', type: 'potion', strength: 'strong', effect: null },
    
    // Weapons for Guerrier (Warrior) - 10 tiers for level 1-20
    { name: 'Épée Rouillée', icon: '⚔️', description: '1 de dégât\n✨ +1 Puissance', cost: 49, category: 'equipment', type: 'weapon', classRestriction: 'guerrier', bonus: 1, rarity: 'commun', levelRequirement: 1, effect: null },
    { name: 'Épée en Fer', icon: '⚔️', description: '3 de dégât\n✨ +1 Puissance', cost: 99, category: 'equipment', type: 'weapon', classRestriction: 'guerrier', bonus: 3, rarity: 'commun', levelRequirement: 3, effect: null },
    { name: 'Épée en Acier', icon: '⚔️', description: '5 de dégât\n✨ +1 Puissance', cost: 160, category: 'equipment', type: 'weapon', classRestriction: 'guerrier', bonus: 5, rarity: 'rare', levelRequirement: 5, effect: null },
    { name: 'Épée Enchantée', icon: '⚔️', description: '7 de dégât\n✨ +1 Puissance', cost: 247, category: 'equipment', type: 'weapon', classRestriction: 'guerrier', bonus: 7, rarity: 'rare', levelRequirement: 7, effect: null },
    { name: 'Épée Flamboyante', icon: '⚔️', description: '9 de dégât\n✨ +1 Puissance', cost: 358, category: 'equipment', type: 'weapon', classRestriction: 'guerrier', bonus: 9, rarity: 'epique', levelRequirement: 9, effect: null },
    { name: 'Épée Runique', icon: '⚔️', description: '10 de dégât\n✨ +1 Puissance', cost: 679, category: 'equipment', type: 'weapon', classRestriction: 'guerrier', bonus: 10, rarity: 'epique', levelRequirement: 11, effect: null },
    { name: 'Épée Légendaire', icon: '⚔️', description: '12 de dégât\n✨ +1 Puissance', cost: 1049, category: 'equipment', type: 'weapon', classRestriction: 'guerrier', bonus: 12, rarity: 'legendaire', levelRequirement: 13, effect: null },
    { name: 'Épée Divine', icon: '⚔️', description: '15 de dégât\n✨ +1 Puissance', cost: 1543, category: 'equipment', type: 'weapon', classRestriction: 'guerrier', bonus: 15, rarity: 'legendaire', levelRequirement: 15, effect: null },
    { name: 'Épée Céleste', icon: '⚔️', description: '18 de dégât\n✨ +1 Puissance', cost: 2223, category: 'equipment', type: 'weapon', classRestriction: 'guerrier', bonus: 18, rarity: 'legendaire', levelRequirement: 17, effect: null },
    { name: 'Épée du Conquérant Suprême', icon: '⚔️', description: '22 de dégât\n✨ +1 Puissance', cost: 3088, category: 'equipment', type: 'weapon', classRestriction: 'guerrier', bonus: 22, rarity: 'legendaire', levelRequirement: 20, effect: null },
    
    // Weapons for Archer - 10 tiers for level 1-20
    { name: 'Arc Basique', icon: '🏹', description: '1 de dégât\n✨ +1 Puissance', cost: 49, category: 'equipment', type: 'weapon', classRestriction: 'archer', bonus: 1, rarity: 'commun', levelRequirement: 1, effect: null },
    { name: 'Arc Court', icon: '🏹', description: '3 de dégât\n✨ +1 Puissance', cost: 99, category: 'equipment', type: 'weapon', classRestriction: 'archer', bonus: 3, rarity: 'commun', levelRequirement: 3, effect: null },
    { name: 'Arc Long', icon: '🏹', description: '5 de dégât\n✨ +1 Puissance', cost: 160, category: 'equipment', type: 'weapon', classRestriction: 'archer', bonus: 5, rarity: 'rare', levelRequirement: 5, effect: null },
    { name: 'Arc Composite', icon: '🏹', description: '7 de dégât\n✨ +1 Puissance', cost: 247, category: 'equipment', type: 'weapon', classRestriction: 'archer', bonus: 7, rarity: 'rare', levelRequirement: 7, effect: null },
    { name: 'Arc Elfique', icon: '🏹', description: '9 de dégât\n✨ +1 Puissance', cost: 358, category: 'equipment', type: 'weapon', classRestriction: 'archer', bonus: 9, rarity: 'epique', levelRequirement: 9, effect: null },
    { name: 'Arc Runique', icon: '🏹', description: '10 de dégât\n✨ +1 Puissance', cost: 679, category: 'equipment', type: 'weapon', classRestriction: 'archer', bonus: 10, rarity: 'epique', levelRequirement: 11, effect: null },
    { name: 'Arc Légendaire', icon: '🏹', description: '12 de dégât\n✨ +1 Puissance', cost: 1049, category: 'equipment', type: 'weapon', classRestriction: 'archer', bonus: 12, rarity: 'legendaire', levelRequirement: 13, effect: null },
    { name: 'Arc du Chasseur Divin', icon: '🏹', description: '15 de dégât\n✨ +1 Puissance', cost: 1543, category: 'equipment', type: 'weapon', classRestriction: 'archer', bonus: 15, rarity: 'legendaire', levelRequirement: 15, effect: null },
    { name: 'Arc Céleste', icon: '🏹', description: '18 de dégât\n✨ +1 Puissance', cost: 2223, category: 'equipment', type: 'weapon', classRestriction: 'archer', bonus: 18, rarity: 'legendaire', levelRequirement: 17, effect: null },
    { name: 'Arc de l\'Étoile Filante', icon: '🏹', description: '22 de dégât\n✨ +1 Puissance', cost: 3088, category: 'equipment', type: 'weapon', classRestriction: 'archer', bonus: 22, rarity: 'legendaire', levelRequirement: 20, effect: null },
    
    // Weapons for Magicien (Mage) - 10 tiers for level 1-20
    { name: 'Bâton de Bois', icon: '🔱', description: '1 de dégât\n✨ +1 Puissance', cost: 49, category: 'equipment', type: 'weapon', classRestriction: 'magicien', bonus: 1, rarity: 'commun', levelRequirement: 1, effect: null },
    { name: 'Bâton d\'Apprenti', icon: '🔱', description: '3 de dégât\n✨ +1 Puissance', cost: 99, category: 'equipment', type: 'weapon', classRestriction: 'magicien', bonus: 3, rarity: 'commun', levelRequirement: 3, effect: null },
    { name: 'Bâton Mystique', icon: '🔱', description: '5 de dégât\n✨ +1 Puissance', cost: 160, category: 'equipment', type: 'weapon', classRestriction: 'magicien', bonus: 5, rarity: 'rare', levelRequirement: 5, effect: null },
    { name: 'Bâton Enchanté', icon: '🔱', description: '7 de dégât\n✨ +1 Puissance', cost: 247, category: 'equipment', type: 'weapon', classRestriction: 'magicien', bonus: 7, rarity: 'rare', levelRequirement: 7, effect: null },
    { name: 'Bâton de Pouvoir', icon: '🔱', description: '9 de dégât\n✨ +1 Puissance', cost: 358, category: 'equipment', type: 'weapon', classRestriction: 'magicien', bonus: 9, rarity: 'epique', levelRequirement: 9, effect: null },
    { name: 'Bâton Runique', icon: '🔱', description: '10 de dégât\n✨ +1 Puissance', cost: 679, category: 'equipment', type: 'weapon', classRestriction: 'magicien', bonus: 10, rarity: 'epique', levelRequirement: 11, effect: null },
    { name: 'Bâton Légendaire', icon: '🔱', description: '12 de dégât\n✨ +1 Puissance', cost: 1049, category: 'equipment', type: 'weapon', classRestriction: 'magicien', bonus: 12, rarity: 'legendaire', levelRequirement: 13, effect: null },
    { name: 'Bâton de l\'Archimage', icon: '🔱', description: '15 de dégât\n✨ +1 Puissance', cost: 1543, category: 'equipment', type: 'weapon', classRestriction: 'magicien', bonus: 15, rarity: 'legendaire', levelRequirement: 15, effect: null },
    { name: 'Bâton Céleste', icon: '🔱', description: '18 de dégât\n✨ +1 Puissance', cost: 2223, category: 'equipment', type: 'weapon', classRestriction: 'magicien', bonus: 18, rarity: 'legendaire', levelRequirement: 17, effect: null },
    { name: 'Bâton de l\'Univers', icon: '🔱', description: '22 de dégât\n✨ +1 Puissance', cost: 3088, category: 'equipment', type: 'weapon', classRestriction: 'magicien', bonus: 22, rarity: 'legendaire', levelRequirement: 20, effect: null },
    
    // Weapons for Enchanteur - 10 tiers for level 1-20
    { name: 'Orbe Terni', icon: '🔮', description: '1 de dégât\n✨ +1 Puissance', cost: 49, category: 'equipment', type: 'weapon', classRestriction: 'enchanteur', bonus: 1, rarity: 'commun', levelRequirement: 1, effect: null },
    { name: 'Orbe de Cristal', icon: '🔮', description: '3 de dégât\n✨ +1 Puissance', cost: 99, category: 'equipment', type: 'weapon', classRestriction: 'enchanteur', bonus: 3, rarity: 'commun', levelRequirement: 3, effect: null },
    { name: 'Orbe Mystique', icon: '🔮', description: '5 de dégât\n✨ +1 Puissance', cost: 160, category: 'equipment', type: 'weapon', classRestriction: 'enchanteur', bonus: 5, rarity: 'rare', levelRequirement: 5, effect: null },
    { name: 'Orbe d\'Illusion', icon: '🔮', description: '7 de dégât\n✨ +1 Puissance', cost: 247, category: 'equipment', type: 'weapon', classRestriction: 'enchanteur', bonus: 7, rarity: 'rare', levelRequirement: 7, effect: null },
    { name: 'Orbe de Manipulation', icon: '🔮', description: '9 de dégât\n✨ +1 Puissance', cost: 358, category: 'equipment', type: 'weapon', classRestriction: 'enchanteur', bonus: 9, rarity: 'epique', levelRequirement: 9, effect: null },
    { name: 'Orbe Runique', icon: '🔮', description: '10 de dégât\n✨ +1 Puissance', cost: 679, category: 'equipment', type: 'weapon', classRestriction: 'enchanteur', bonus: 10, rarity: 'epique', levelRequirement: 11, effect: null },
    { name: 'Orbe Légendaire', icon: '🔮', description: '12 de dégât\n✨ +1 Puissance', cost: 1049, category: 'equipment', type: 'weapon', classRestriction: 'enchanteur', bonus: 12, rarity: 'legendaire', levelRequirement: 13, effect: null },
    { name: 'Orbe de l\'Enchanteur Divin', icon: '🔮', description: '15 de dégât\n✨ +1 Puissance', cost: 1543, category: 'equipment', type: 'weapon', classRestriction: 'enchanteur', bonus: 15, rarity: 'legendaire', levelRequirement: 15, effect: null },
    { name: 'Orbe Céleste', icon: '🔮', description: '18 de dégât\n✨ +1 Puissance', cost: 2223, category: 'equipment', type: 'weapon', classRestriction: 'enchanteur', bonus: 18, rarity: 'legendaire', levelRequirement: 17, effect: null },
    { name: 'Orbe de la Conscience Suprême', icon: '🔮', description: '22 de dégât\n✨ +1 Puissance', cost: 3088, category: 'equipment', type: 'weapon', classRestriction: 'enchanteur', bonus: 22, rarity: 'legendaire', levelRequirement: 20, effect: null },
    
    // Shields for Guerrier (Warrior) - 10 tiers for level 1-20
    { name: 'Bouclier en Bois', icon: '🛡️', description: '+1 Défense', cost: 43, category: 'classes', type: 'shield', classRestriction: 'guerrier', bonus: 1, rarity: 'commun', levelRequirement: 1, effect: null },
    { name: 'Bouclier en Fer', icon: '🛡️', description: '+3 Défense', cost: 86, category: 'classes', type: 'shield', classRestriction: 'guerrier', bonus: 3, rarity: 'commun', levelRequirement: 3, effect: null },
    { name: 'Bouclier Renforcé', icon: '🛡️', description: '+5 Défense', cost: 142, category: 'classes', type: 'shield', classRestriction: 'guerrier', bonus: 5, rarity: 'rare', levelRequirement: 5, effect: null },
    { name: 'Bouclier d\'Acier', icon: '🛡️', description: '+7 Défense', cost: 222, category: 'classes', type: 'shield', classRestriction: 'guerrier', bonus: 7, rarity: 'rare', levelRequirement: 7, effect: null },
    { name: 'Bouclier de Chevalier', icon: '🛡️', description: '+9 Défense', cost: 326, category: 'classes', type: 'shield', classRestriction: 'guerrier', bonus: 9, rarity: 'epique', levelRequirement: 9, effect: null },
    { name: 'Bouclier Enchanté', icon: '🛡️', description: '+10 Défense', cost: 629, category: 'classes', type: 'shield', classRestriction: 'guerrier', bonus: 10, rarity: 'epique', levelRequirement: 11, effect: null },
    { name: 'Bouclier Runique', icon: '🛡️', description: '+12 Défense', cost: 988, category: 'classes', type: 'shield', classRestriction: 'guerrier', bonus: 12, rarity: 'legendaire', levelRequirement: 13, effect: null },
    { name: 'Bouclier Divin', icon: '🛡️', description: '+15 Défense', cost: 1482, category: 'classes', type: 'shield', classRestriction: 'guerrier', bonus: 15, rarity: 'legendaire', levelRequirement: 15, effect: null },
    { name: 'Bouclier Céleste', icon: '🛡️', description: '+18 Défense', cost: 2100, category: 'classes', type: 'shield', classRestriction: 'guerrier', bonus: 18, rarity: 'legendaire', levelRequirement: 17, effect: null },
    { name: 'Bouclier du Protecteur Immortel', icon: '🛡️', description: '+22 Défense', cost: 2964, category: 'classes', type: 'shield', classRestriction: 'guerrier', bonus: 22, rarity: 'legendaire', levelRequirement: 20, effect: null },
    
    // Books for Magicien (Mage) - 10 tiers for level 1-20
    { name: 'Livre Usé', icon: '📕', description: '+1 Intelligence', cost: 43, category: 'classes', type: 'book', classRestriction: 'magicien', bonus: 1, rarity: 'commun', levelRequirement: 1, effect: null },
    { name: 'Livre de Sorts Mineurs', icon: '📕', description: '+3 Intelligence', cost: 86, category: 'classes', type: 'book', classRestriction: 'magicien', bonus: 3, rarity: 'commun', levelRequirement: 3, effect: null },
    { name: 'Grimoire d\'Apprenti', icon: '📗', description: '+5 Intelligence', cost: 142, category: 'classes', type: 'book', classRestriction: 'magicien', bonus: 5, rarity: 'rare', levelRequirement: 5, effect: null },
    { name: 'Tome de Magie Ancienne', icon: '📗', description: '+7 Intelligence', cost: 222, category: 'classes', type: 'book', classRestriction: 'magicien', bonus: 7, rarity: 'rare', levelRequirement: 7, effect: null },
    { name: 'Codex Mystique', icon: '📘', description: '+9 Intelligence', cost: 326, category: 'classes', type: 'book', classRestriction: 'magicien', bonus: 9, rarity: 'epique', levelRequirement: 9, effect: null },
    { name: 'Livre des Secrets', icon: '📘', description: '+10 Intelligence', cost: 629, category: 'classes', type: 'book', classRestriction: 'magicien', bonus: 10, rarity: 'epique', levelRequirement: 11, effect: null },
    { name: 'Grimoire Légendaire', icon: '📙', description: '+12 Intelligence', cost: 988, category: 'classes', type: 'book', classRestriction: 'magicien', bonus: 12, rarity: 'legendaire', levelRequirement: 13, effect: null },
    { name: 'Livre des Arcanes Divins', icon: '📙', description: '+15 Intelligence', cost: 1482, category: 'classes', type: 'book', classRestriction: 'magicien', bonus: 15, rarity: 'legendaire', levelRequirement: 15, effect: null },
    { name: 'Codex Céleste', icon: '📙', description: '+18 Intelligence', cost: 2100, category: 'classes', type: 'book', classRestriction: 'magicien', bonus: 18, rarity: 'legendaire', levelRequirement: 17, effect: null },
    { name: 'Tome de la Connaissance Ultime', icon: '📙', description: '+22 Intelligence', cost: 2964, category: 'classes', type: 'book', classRestriction: 'magicien', bonus: 22, rarity: 'legendaire', levelRequirement: 20, effect: null },
    
    // Quivers for Archer - 10 tiers for level 1-20
    { name: 'Carquois Usé', icon: '🏹', description: '+1 Adresse', cost: 43, category: 'classes', type: 'quiver', classRestriction: 'archer', bonus: 1, rarity: 'commun', levelRequirement: 1, effect: null },
    { name: 'Carquois en Cuir', icon: '🏹', description: '+3 Adresse', cost: 86, category: 'classes', type: 'quiver', classRestriction: 'archer', bonus: 3, rarity: 'commun', levelRequirement: 3, effect: null },
    { name: 'Carquois Renforcé', icon: '🏹', description: '+5 Adresse', cost: 142, category: 'classes', type: 'quiver', classRestriction: 'archer', bonus: 5, rarity: 'rare', levelRequirement: 5, effect: null },
    { name: 'Carquois Elfique', icon: '🏹', description: '+7 Adresse', cost: 222, category: 'classes', type: 'quiver', classRestriction: 'archer', bonus: 7, rarity: 'rare', levelRequirement: 7, effect: null },
    { name: 'Carquois du Chasseur', icon: '🏹', description: '+9 Adresse', cost: 326, category: 'classes', type: 'quiver', classRestriction: 'archer', bonus: 9, rarity: 'epique', levelRequirement: 9, effect: null },
    { name: 'Carquois Enchanté', icon: '🏹', description: '+10 Adresse', cost: 629, category: 'classes', type: 'quiver', classRestriction: 'archer', bonus: 10, rarity: 'epique', levelRequirement: 11, effect: null },
    { name: 'Carquois Runique', icon: '🏹', description: '+12 Adresse', cost: 988, category: 'classes', type: 'quiver', classRestriction: 'archer', bonus: 12, rarity: 'legendaire', levelRequirement: 13, effect: null },
    { name: 'Carquois du Tireur d\'Élite', icon: '🏹', description: '+15 Adresse', cost: 1482, category: 'classes', type: 'quiver', classRestriction: 'archer', bonus: 15, rarity: 'legendaire', levelRequirement: 15, effect: null },
    { name: 'Carquois Céleste', icon: '🏹', description: '+18 Adresse', cost: 2100, category: 'classes', type: 'quiver', classRestriction: 'archer', bonus: 18, rarity: 'legendaire', levelRequirement: 17, effect: null },
    { name: 'Carquois de l\'Archer Suprême', icon: '🏹', description: '+22 Adresse', cost: 2964, category: 'classes', type: 'quiver', classRestriction: 'archer', bonus: 22, rarity: 'legendaire', levelRequirement: 20, effect: null },
    
    // Amulets for Enchanteur - 10 tiers for level 1-20
    { name: 'Amulette Basique', icon: '📿', description: '+1 Esprit', cost: 43, category: 'classes', type: 'amulet', classRestriction: 'enchanteur', bonus: 1, rarity: 'commun', levelRequirement: 1, effect: null },
    { name: 'Amulette en Pierre', icon: '📿', description: '+3 Esprit', cost: 86, category: 'classes', type: 'amulet', classRestriction: 'enchanteur', bonus: 3, rarity: 'commun', levelRequirement: 3, effect: null },
    { name: 'Amulette Mystique', icon: '📿', description: '+5 Esprit', cost: 142, category: 'classes', type: 'amulet', classRestriction: 'enchanteur', bonus: 5, rarity: 'rare', levelRequirement: 5, effect: null },
    { name: 'Talisman d\'Esprit', icon: '📿', description: '+7 Esprit', cost: 222, category: 'classes', type: 'amulet', classRestriction: 'enchanteur', bonus: 7, rarity: 'rare', levelRequirement: 7, effect: null },
    { name: 'Médaillon Enchanté', icon: '📿', description: '+9 Esprit', cost: 326, category: 'classes', type: 'amulet', classRestriction: 'enchanteur', bonus: 9, rarity: 'epique', levelRequirement: 9, effect: null },
    { name: 'Amulette Runique', icon: '📿', description: '+10 Esprit', cost: 629, category: 'classes', type: 'amulet', classRestriction: 'enchanteur', bonus: 10, rarity: 'epique', levelRequirement: 11, effect: null },
    { name: 'Talisman Légendaire', icon: '📿', description: '+12 Esprit', cost: 988, category: 'classes', type: 'amulet', classRestriction: 'enchanteur', bonus: 12, rarity: 'legendaire', levelRequirement: 13, effect: null },
    { name: 'Médaillon de l\'Esprit Divin', icon: '📿', description: '+15 Esprit', cost: 1482, category: 'classes', type: 'amulet', classRestriction: 'enchanteur', bonus: 15, rarity: 'legendaire', levelRequirement: 15, effect: null },
    { name: 'Amulette Céleste', icon: '📿', description: '+18 Esprit', cost: 2100, category: 'classes', type: 'amulet', classRestriction: 'enchanteur', bonus: 18, rarity: 'legendaire', levelRequirement: 17, effect: null },
    { name: 'Talisman de la Conscience Absolue', icon: '📿', description: '+22 Esprit', cost: 2964, category: 'classes', type: 'amulet', classRestriction: 'enchanteur', bonus: 22, rarity: 'legendaire', levelRequirement: 20, effect: null },
    
    // Armors (10 tiers for level 1-20)
    { name: 'Armure en Tissu', icon: '🛡️', description: '+1 Défense', cost: 43, category: 'equipment', type: 'armor', bonus: 1, rarity: 'commun', levelRequirement: 1, effect: null },
    { name: 'Armure de Cuir', icon: '🛡️', description: '+3 Défense', cost: 86, category: 'equipment', type: 'armor', bonus: 3, rarity: 'commun', levelRequirement: 3, effect: null },
    { name: 'Armure Clouée', icon: '🛡️', description: '+5 Défense', cost: 142, category: 'equipment', type: 'armor', bonus: 5, rarity: 'rare', levelRequirement: 5, effect: null },
    { name: 'Cotte de Mailles', icon: '🛡️', description: '+7 Défense', cost: 222, category: 'equipment', type: 'armor', bonus: 7, rarity: 'rare', levelRequirement: 7, effect: null },
    { name: 'Armure d\'Acier', icon: '🛡️', description: '+9 Défense', cost: 326, category: 'equipment', type: 'armor', bonus: 9, rarity: 'epique', levelRequirement: 9, effect: null },
    { name: 'Armure Enchantée', icon: '🛡️', description: '+10 Défense', cost: 629, category: 'equipment', type: 'armor', bonus: 10, rarity: 'epique', levelRequirement: 11, effect: null },
    { name: 'Armure Runique', icon: '🛡️', description: '+12 Défense', cost: 988, category: 'equipment', type: 'armor', bonus: 12, rarity: 'legendaire', levelRequirement: 13, effect: null },
    { name: 'Armure Divine', icon: '🛡️', description: '+15 Défense', cost: 1482, category: 'equipment', type: 'armor', bonus: 15, rarity: 'legendaire', levelRequirement: 15, effect: null },
    { name: 'Armure Céleste', icon: '🛡️', description: '+18 Défense', cost: 2100, category: 'equipment', type: 'armor', bonus: 18, rarity: 'legendaire', levelRequirement: 17, effect: null },
    { name: 'Armure Immortelle', icon: '🛡️', description: '+22 Défense', cost: 2964, category: 'equipment', type: 'armor', bonus: 22, rarity: 'legendaire', levelRequirement: 20, effect: null }
];

// Rare items for wandering merchant
export const rareItems = [
    { name: 'Élixir de Résurrection', icon: '🧬', description: 'Restaure toute la santé et l\'énergie', cost: 285, category: 'heal', effect: null },
    { name: 'Potion de Géant', icon: '💪', description: '+12 Puissance', cost: 332, category: 'damage', effect: null },
    { name: 'Armure Runique', icon: '🛡️', description: '+8 Défense, +2 toutes stats', cost: 427, category: 'equipment', effect: null },
    { name: 'Amulette de Fortune', icon: '🍀', description: '+100 Or, +5 Présence', cost: 237, category: 'equipment', effect: null },
    { name: 'Grimoire Ancien', icon: '📖', description: '+10 Esprit, +200 XP', cost: 380, category: 'exp', effect: null }
];

// Legendary items - rewards from bosses
export const legendaryItems = [
    { name: 'Épée du Conquérant', icon: '⚔️', description: '+15 Puissance, +5 Adresse', effect: (p) => { p.puissance += 15; p.adresse += 5; } },
    { name: 'Armure du Titan', icon: '🛡️', description: '+10 Défense, +30 PV Max', effect: (p) => { p.defense += 10; p.maxHealth += 30; p.health += 30; } },
    { name: 'Amulette de Vie', icon: '💎', description: '+50 PV Max, +3 Puissance', effect: (p) => { p.maxHealth += 50; p.health += 50; p.puissance += 3; } },
    { name: 'Anneau de Puissance', icon: '💍', description: '+8 Puissance, +8 Esprit', effect: (p) => { p.puissance += 8; p.esprit += 8; } },
    { name: 'Cape de l\'Ombre', icon: '🦇', description: '+7 Adresse, +5 Défense', effect: (p) => { p.adresse += 7; p.defense += 5; } },
    { name: 'Couronne de Sagesse', icon: '👑', description: '+10 Esprit, +10 Présence', effect: (p) => { p.esprit += 10; p.presence += 10; } },
    { name: 'Marteau du Forgeron Divin', icon: '🔨', description: '+20 Puissance, +5 Esprit', effect: (p) => { p.puissance += 20; p.esprit += 5; } },
    { name: 'Bâton du Mage Suprême', icon: '🔮', description: '+15 Esprit, +50 Énergie Max', effect: (p) => { p.esprit += 15; p.maxEnergy += 50; p.energy += 50; } }
];
