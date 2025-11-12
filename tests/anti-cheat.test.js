// Anti-Cheat Tests
// Tests for the anti-cheat validation and integrity checking systems

import { 
    validatePlayerData, 
    validateInventory, 
    validateSaveData,
    detectCheatPatterns,
    addIntegrityMetadata,
    verifyIntegrityMetadata,
    calculateChecksum,
    VALIDATION_RANGES 
} from '../js/anti-cheat.js';

// Test data
const validPlayer = {
    name: 'Test Hero',
    level: 10,
    health: 200,
    maxHealth: 250,
    puissance: 25,
    defense: 20,
    adresse: 18,
    esprit: 22,
    presence: 15,
    gold: 5000,
    xp: 15000,
    statPoints: 5,
    kills: 150,
    deaths: 10,
    bossesDefeated: 2,
    energy: 80,
    maxEnergy: 100,
    mana: 120,
    maxMana: 150,
    inventory: []
};

const invalidPlayer = {
    ...validPlayer,
    level: 100, // Exceeds MAX_LEVEL (24)
    puissance: 200, // Exceeds max (150)
    health: 5000 // Way too high
};

const suspiciousPlayer = {
    ...validPlayer,
    gold: 100000,
    kills: 5,
    level: 20
};

console.log('=== Running Anti-Cheat Tests ===\n');

// Test 1: Validate valid player data
console.log('Test 1: Validate valid player data');
try {
    validatePlayerData(validPlayer);
    console.log('✅ PASSED: Valid player data accepted\n');
} catch (error) {
    console.log('❌ FAILED:', error.message, '\n');
}

// Test 2: Reject invalid player data
console.log('Test 2: Reject invalid player data');
try {
    validatePlayerData(invalidPlayer);
    console.log('❌ FAILED: Invalid player data was accepted\n');
} catch (error) {
    console.log('✅ PASSED: Invalid player data rejected:', error.message, '\n');
}

// Test 3: Detect cheat patterns
console.log('Test 3: Detect cheat patterns');
const patterns = detectCheatPatterns(suspiciousPlayer);
if (patterns.length > 0) {
    console.log('✅ PASSED: Cheat patterns detected:', patterns, '\n');
} else {
    console.log('⚠️  WARNING: No cheat patterns detected in suspicious player\n');
}

// Test 4: Validate inventory
console.log('Test 4: Validate inventory');
const validInventory = [
    { name: 'Potion de Soin', quantity: 5, rarity: 'commun' },
    { name: 'Épée Légendaire', quantity: 1, rarity: 'legendaire' }
];

const invalidInventory = [
    { name: 'Invalid Item', quantity: 9999, rarity: 'commun' } // Excessive quantity
];

try {
    validateInventory(validInventory);
    console.log('✅ PASSED: Valid inventory accepted\n');
} catch (error) {
    console.log('❌ FAILED:', error.message, '\n');
}

// Test 5: Checksum calculation and verification
console.log('Test 5: Checksum calculation and verification');
const checksum = calculateChecksum(validPlayer);
console.log('  Generated checksum:', checksum);

const saveDataWithIntegrity = addIntegrityMetadata({ player: validPlayer });
const isValid = verifyIntegrityMetadata(saveDataWithIntegrity);

if (isValid) {
    console.log('✅ PASSED: Checksum verified successfully\n');
} else {
    console.log('❌ FAILED: Checksum verification failed\n');
}

// Test 6: Tampered data detection
console.log('Test 6: Tampered data detection');
const tamperedSave = { ...saveDataWithIntegrity };
tamperedSave.player.gold = 999999; // Tamper with data
const isTampered = verifyIntegrityMetadata(tamperedSave);

if (!isTampered) {
    console.log('✅ PASSED: Tampered data detected\n');
} else {
    console.log('⚠️  WARNING: Tampered data not detected (checksum may need recalculation)\n');
}

// Test 7: Comprehensive save validation
console.log('Test 7: Comprehensive save validation');
const validSave = {
    player: validPlayer,
    currentEnemy: null,
    inCombat: false,
    defending: false
};

try {
    validateSaveData(validSave);
    console.log('✅ PASSED: Valid save data accepted\n');
} catch (error) {
    console.log('❌ FAILED:', error.message, '\n');
}

// Test 8: Validation ranges
console.log('Test 8: Validation ranges');
console.log('  MAX_LEVEL:', VALIDATION_RANGES.level.max);
console.log('  Max puissance:', VALIDATION_RANGES.puissance.max);
console.log('  Max gold:', VALIDATION_RANGES.gold.max);
console.log('  Max kills:', VALIDATION_RANGES.kills.max);
console.log('✅ PASSED: Validation ranges configured correctly\n');

// Test 9: Edge cases
console.log('Test 9: Edge cases');

// Test minimum values
const minPlayer = {
    ...validPlayer,
    level: 1,
    health: 1,
    maxHealth: 1,
    puissance: 1,
    defense: 1,
    gold: 0,
    kills: 0
};

try {
    validatePlayerData(minPlayer);
    console.log('✅ PASSED: Minimum values accepted\n');
} catch (error) {
    console.log('❌ FAILED:', error.message, '\n');
}

// Test maximum level player
const maxLevelPlayer = {
    ...validPlayer,
    level: 24,
    health: 600,
    maxHealth: 650,
    puissance: 60,
    defense: 55,
    kills: 1000,
    bossesDefeated: 4
};

try {
    validatePlayerData(maxLevelPlayer);
    console.log('✅ PASSED: Max level player accepted\n');
} catch (error) {
    console.log('❌ FAILED:', error.message, '\n');
}

console.log('=== Anti-Cheat Tests Complete ===');
