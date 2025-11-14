// Security Module Tests
// Tests for XSS prevention and input sanitization

import { escapeHtml, sanitizePlayerName, validateInput, sanitizeUrl } from '../js/security.js';

// Test escapeHtml
console.log('Testing escapeHtml...');
const xssAttempt = '<script>alert("XSS")</script>';
const escaped = escapeHtml(xssAttempt);
console.assert(!escaped.includes('<script>'), 'escapeHtml should remove script tags');
console.assert(escaped.includes('&lt;script&gt;'), 'escapeHtml should escape HTML entities');
console.log('✓ escapeHtml test passed');

// Test sanitizePlayerName
console.log('\nTesting sanitizePlayerName...');
const dirtyName = '<img src=x onerror=alert(1)>Héros</img>';
const cleanName = sanitizePlayerName(dirtyName);
console.assert(!cleanName.includes('<'), 'sanitizePlayerName should remove HTML tags');
console.assert(!cleanName.includes('>'), 'sanitizePlayerName should remove HTML tags');
console.assert(cleanName === 'Héros', `sanitizePlayerName should return "Héros", got "${cleanName}"`);
console.log('✓ sanitizePlayerName test passed');

// Test long name
const longName = 'a'.repeat(30);
const truncatedName = sanitizePlayerName(longName, 20);
console.assert(truncatedName.length === 20, `sanitizePlayerName should truncate to 20 chars, got ${truncatedName.length}`);
console.log('✓ sanitizePlayerName truncation test passed');

// Test empty name
const emptyName = sanitizePlayerName('   ');
console.assert(emptyName === 'Héros', `sanitizePlayerName should return default for empty input, got "${emptyName}"`);
console.log('✓ sanitizePlayerName empty input test passed');

// Test validateInput
console.log('\nTesting validateInput...');
const validInput = validateInput('Test Name', { maxLength: 20 });
console.assert(validInput.valid === true, 'validateInput should accept valid input');
console.assert(validInput.sanitized === 'Test Name', 'validateInput should return sanitized input');
console.log('✓ validateInput test passed');

// Test validateInput with HTML
const htmlInput = validateInput('<b>Test</b>', { maxLength: 20 });
console.assert(htmlInput.sanitized === 'Test', 'validateInput should strip HTML tags');
console.log('✓ validateInput HTML stripping test passed');

// Test sanitizeUrl
console.log('\nTesting sanitizeUrl...');
const safeUrl = sanitizeUrl('https://example.com');
console.assert(safeUrl === 'https://example.com', 'sanitizeUrl should accept safe URLs');
console.log('✓ sanitizeUrl safe URL test passed');

const dangerousUrl = sanitizeUrl('javascript:alert(1)');
console.assert(dangerousUrl === '', 'sanitizeUrl should block javascript: URLs');
console.log('✓ sanitizeUrl dangerous URL test passed');

const dataUrl = sanitizeUrl('data:text/html,<script>alert(1)</script>');
console.assert(dataUrl === '', 'sanitizeUrl should block data: URLs');
console.log('✓ sanitizeUrl data URL test passed');

console.log('\n✅ All security tests passed!');
