# Anti-Cheat System Documentation

## Overview

Le Coeur du Dragon implements a comprehensive anti-cheat system to ensure fair gameplay and protect game integrity. The system operates on three levels: client-side validation, runtime integrity monitoring, and server-side validation for multiplayer.

## System Architecture

### 1. Client-Side Validation (`js/anti-cheat.js`)

The client-side module provides validation for all player data and save files.

#### Features:
- **Range Validation**: Ensures all player properties stay within acceptable ranges
- **Checksum Verification**: Detects tampering with save data
- **Stat Distribution Validation**: Checks that stats are reasonable for the player's level
- **Level Progression Validation**: Validates XP, kills, and boss defeats correlate properly
- **Inventory Validation**: Prevents impossible item quantities
- **Cheat Pattern Detection**: Identifies common cheating patterns

#### Validation Ranges:
```javascript
{
    level: { min: 1, max: 24 },
    health: { min: 1, max: 3000 },
    puissance: { min: 1, max: 150 },
    defense: { min: 1, max: 150 },
    gold: { min: 0, max: 999999 },
    // ... and more
}
```

#### Detected Cheat Patterns:
1. Excessive gold without kills
2. High level with suspiciously low kills
3. All bosses defeated at low level
4. Excessive stats for current level

### 2. Runtime Integrity Monitoring (`js/integrity-checker.js`)

The runtime module continuously monitors game state during gameplay.

#### Features:
- **Periodic Checks**: Validates game state every 30 seconds
- **Snapshot Comparison**: Detects suspicious changes between checks
- **Action Validation**: Validates critical operations before execution
- **Anomaly Tracking**: Counts anomalies and warns when threshold exceeded
- **Non-Intrusive**: Logs warnings without blocking gameplay

#### Monitored Actions:
- Level increases
- Stat changes
- Gold changes
- Health changes

#### Detection Criteria:
- Rapid level gains (>3 levels in <5 minutes)
- Rapid gold gains (>50,000 gold in <5 minutes)
- Health exceeding max health
- Stats decreasing (except through death)
- Impossible stat increases (>50 points)

### 3. Server-Side Validation (`server/anti-cheat.js`)

The server module protects the multiplayer leaderboard from cheating.

#### Features:
- **Score Validation**: Comprehensive validation of submitted scores
- **Rate Limiting**: Maximum 10 submissions per minute per player
- **Anomaly Detection**: Detects impossible progression rates
- **Checksum Calculation**: Verifies score integrity
- **History Tracking**: Compares new scores with previous submissions

#### Protected Against:
- Rapid level gains
- Impossible gold accumulation
- Score spam/flooding
- Stat manipulation
- Level regression

## Usage

### For Players

The anti-cheat system runs automatically in the background. You don't need to do anything special. If you see warnings in the browser console, it may indicate:

1. A bug in the game (please report it!)
2. An unusual but legitimate gameplay pattern
3. Potential save file corruption

**Important**: The system is designed to be permissive - it will log warnings but won't block your gameplay unless the data is completely invalid.

### For Developers

#### Validating Player Data

```javascript
import { validatePlayerData } from './js/anti-cheat.js';

try {
    validatePlayerData(player);
    console.log('Player data is valid');
} catch (error) {
    console.error('Invalid player data:', error.message);
}
```

#### Adding Integrity Metadata to Saves

```javascript
import { addIntegrityMetadata } from './js/anti-cheat.js';

const saveData = { player: gameState.player };
const protectedSave = addIntegrityMetadata(saveData);
localStorage.setItem('save', JSON.stringify(protectedSave));
```

#### Verifying Save Integrity

```javascript
import { verifyIntegrityMetadata } from './js/anti-cheat.js';

const loadedSave = JSON.parse(localStorage.getItem('save'));
if (verifyIntegrityMetadata(loadedSave)) {
    console.log('Save data is intact');
} else {
    console.warn('Save data may be corrupted');
}
```

#### Starting Runtime Monitoring

```javascript
import { startIntegrityMonitoring } from './js/integrity-checker.js';

// Call once during game initialization
startIntegrityMonitoring();
```

## Testing

Run the comprehensive test suite:

```bash
node tests/anti-cheat.test.js
```

The test suite covers:
- Valid player data acceptance
- Invalid player data rejection
- Cheat pattern detection
- Inventory validation
- Checksum calculation and verification
- Tampered data detection
- Save data validation
- Edge cases (min/max values)

## Configuration

### Adjusting Validation Ranges

Edit `VALIDATION_RANGES` in `js/anti-cheat.js`:

```javascript
export const VALIDATION_RANGES = {
    level: { min: 1, max: 24 }, // Adjust max level here
    gold: { min: 0, max: 999999 }, // Adjust max gold here
    // ...
};
```

### Adjusting Monitoring Intervals

Edit `CHECK_INTERVAL` in `js/integrity-checker.js`:

```javascript
const CHECK_INTERVAL = 30000; // 30 seconds (in milliseconds)
```

### Adjusting Rate Limits

Edit rate limit constants in `server/anti-cheat.js`:

```javascript
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_SUBMISSIONS_PER_WINDOW = 10; // Max submissions
```

## Security Considerations

### What the System Protects Against:
✅ Save file manipulation (stat boosting, gold editing)  
✅ Rapid progression exploits  
✅ Multiplayer leaderboard manipulation  
✅ Inventory item duplication  
✅ Impossible stat combinations  

### What the System Does NOT Protect Against:
❌ Memory editing while game is running (would require native code)  
❌ Network traffic manipulation (HTTPS/WSS recommended for production)  
❌ Sophisticated timing attacks  
❌ Browser extension interference  

### Recommendations for Production:

1. **Use HTTPS**: Encrypt all traffic
2. **Server-Side Game Logic**: Move critical calculations to server
3. **Session Tokens**: Implement proper authentication
4. **Logging**: Monitor anti-cheat warnings for patterns
5. **Regular Updates**: Update validation ranges as game evolves

## Backwards Compatibility

The anti-cheat system maintains backwards compatibility with existing saves:

- Old saves without integrity metadata are accepted (with warnings)
- Missing properties are filled with defaults
- Warnings are logged but don't block loading
- Migration code handles old stat systems

## Performance Impact

The anti-cheat system is designed to be lightweight:

- **Client-side validation**: Runs only on save/load (< 1ms)
- **Runtime monitoring**: Checks every 30 seconds (< 5ms per check)
- **Server validation**: Adds < 10ms to score submission
- **Total overhead**: Negligible for gameplay

## Troubleshooting

### Common Warnings and What They Mean

**"Suspicious stats total"**
- Your stats are unusually high or low for your level
- Usually caused by items with large bonuses
- Safe to ignore if you have legendary items

**"Suspicious XP"**
- Your XP doesn't match expected value for level
- Can happen with certain quest rewards
- Safe to ignore if progression feels normal

**"Checksum verification failed"**
- Save data may be corrupted or manually edited
- Try exporting and re-importing your save
- May indicate browser storage issues

**"Rate limit exceeded"**
- Too many score submissions to multiplayer server
- Wait 1 minute before submitting again
- Contact admin if you see this frequently

### Getting Help

If you encounter issues with the anti-cheat system:

1. Check browser console for detailed error messages
2. Try exporting and re-importing your save
3. Report bugs with console output included
4. Include your save code if requesting help

## Future Enhancements

Potential improvements for future versions:

- [ ] Machine learning-based anomaly detection
- [ ] Cloud save verification
- [ ] Real-time multiplayer synchronization
- [ ] Advanced pattern recognition
- [ ] Automated ban system for repeat offenders
- [ ] Admin dashboard for monitoring

## Contributing

When adding new game features, ensure you:

1. Update `VALIDATION_RANGES` if adding new properties
2. Add validation for new actions in `validateAction()`
3. Update tests to cover new functionality
4. Document any new cheat patterns to detect

## License

This anti-cheat system is part of Le Coeur du Dragon and is licensed under AGPL-3.0.
