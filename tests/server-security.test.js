// Server-side Security Tests
// Tests for input sanitization on the server

import { validateScoreData } from '../server/anti-cheat.js';

console.log('Testing server-side input sanitization...\n');

// Test 1: Valid score data
try {
    const validScore = {
        playerId: 'test-player-123',
        playerName: 'TestHero',
        level: 5,
        kills: 10,
        gold: 500,
        xp: 250,
        puissance: 15,
        defense: 12
    };
    validateScoreData(validScore);
    console.assert(validScore.playerName === 'TestHero', 'Valid name should remain unchanged');
    console.log('✓ Test 1: Valid score data passed');
} catch (e) {
    console.error('✗ Test 1 failed:', e.message);
}

// Test 2: Player name with HTML tags (XSS attempt)
try {
    const xssScore = {
        playerId: 'test-player-456',
        playerName: '<script>alert("XSS")</script>Hacker',
        level: 5,
        kills: 10,
        gold: 500,
        xp: 250,
        puissance: 15,
        defense: 12
    };
    validateScoreData(xssScore);
    console.assert(!xssScore.playerName.includes('<script>'), 'HTML tags should be removed');
    console.assert(xssScore.playerName === 'Hacker', `Expected "Hacker", got "${xssScore.playerName}"`);
    console.log('✓ Test 2: XSS prevention passed');
} catch (e) {
    console.error('✗ Test 2 failed:', e.message);
}

// Test 3: Player name that's too long
try {
    const longNameScore = {
        playerId: 'test-player-789',
        playerName: 'a'.repeat(30),
        level: 5,
        kills: 10,
        gold: 500,
        xp: 250,
        puissance: 15,
        defense: 12
    };
    validateScoreData(longNameScore);
    console.error('✗ Test 3 failed: Should have thrown error for long name');
} catch (e) {
    console.assert(e.message.includes('too long'), 'Should reject names over 20 characters');
    console.log('✓ Test 3: Name length validation passed');
}

// Test 4: Empty player name
try {
    const emptyNameScore = {
        playerId: 'test-player-000',
        playerName: '   ',
        level: 5,
        kills: 10,
        gold: 500,
        xp: 250,
        puissance: 15,
        defense: 12
    };
    validateScoreData(emptyNameScore);
    console.error('✗ Test 4 failed: Should have thrown error for empty name');
} catch (e) {
    console.assert(e.message.includes('cannot be empty'), 'Should reject empty names');
    console.log('✓ Test 4: Empty name validation passed');
}

// Test 5: Invalid level value
try {
    const invalidLevelScore = {
        playerId: 'test-player-999',
        playerName: 'Cheater',
        level: 999,
        kills: 10,
        gold: 500,
        xp: 250,
        puissance: 15,
        defense: 12
    };
    validateScoreData(invalidLevelScore);
    console.error('✗ Test 5 failed: Should have thrown error for invalid level');
} catch (e) {
    console.assert(e.message.includes('Invalid level'), 'Should reject invalid level values');
    console.log('✓ Test 5: Level validation passed');
}

// Test 6: Missing required fields
try {
    const missingFieldsScore = {
        playerId: 'test-player-111',
        // missing playerName
        level: 5,
        kills: 10
    };
    validateScoreData(missingFieldsScore);
    console.error('✗ Test 6 failed: Should have thrown error for missing fields');
} catch (e) {
    console.assert(e.message.includes('required'), 'Should reject missing required fields');
    console.log('✓ Test 6: Required fields validation passed');
}

console.log('\n✅ All server-side security tests passed!');
