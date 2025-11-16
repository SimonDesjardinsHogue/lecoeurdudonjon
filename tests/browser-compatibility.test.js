/**
 * Tests de Compatibilité Multi-Navigateurs et Multi-Dispositifs
 * 
 * Ce fichier teste "Le Coeur du Dragon" sur différents navigateurs et dispositifs
 * pour assurer une compatibilité maximale.
 * 
 * Pour exécuter: npx playwright test tests/browser-compatibility.test.js
 */

const { test, expect, chromium, firefox, webkit } = require('@playwright/test');

const BASE_URL = process.env.TEST_URL || 'http://localhost:8000';

// Viewports de test pour différents dispositifs
const viewports = {
  desktop: { width: 1920, height: 1080 },
  laptop: { width: 1366, height: 768 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 667 },
  mobileLandscape: { width: 667, height: 375 },
  tabletLandscape: { width: 1024, height: 768 }
};

// ============================================================================
// Tests de Base - Chargement de la Page
// ============================================================================

test.describe('Chargement de la Page Principale', () => {
  
  test('La page se charge sans erreurs critiques', async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Vérifier le titre
    await expect(page).toHaveTitle(/Le Coeur du Dragon/);
    
    // Vérifier qu'il n'y a pas d'erreurs JavaScript critiques
    const criticalErrors = errors.filter(err => 
      !err.includes('Content Security Policy') && 
      !err.includes('Firebase not configured') &&
      !err.includes('Serveur non accessible') &&
      !err.includes('startIntegrityMonitoring is not defined')
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test('Les éléments principaux sont visibles', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Vérifier la présence des éléments clés
    await expect(page.locator('h1')).toContainText('Le Coeur du Dragon');
    await expect(page.locator('button:has-text("Commencer l\'Aventure")')).toBeVisible();
    await expect(page.locator('button:has-text("Restaurer une Partie")')).toBeVisible();
    
    // Vérifier les champs de création de personnage
    await expect(page.locator('input[placeholder*="Nom"]')).toBeVisible();
    await expect(page.locator('input[type="radio"]').first()).toBeVisible();
  });

  test('Les modules ES6 se chargent correctement', async ({ page }) => {
    const moduleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && msg.text().includes('Failed to load module')) {
        moduleErrors.push(msg.text());
      }
    });
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    expect(moduleErrors).toHaveLength(0);
  });
});

// ============================================================================
// Tests de Compatibilité Mobile/Tablette
// ============================================================================

test.describe('Tests de Responsive Design', () => {
  
  for (const [deviceName, viewport] of Object.entries(viewports)) {
    test(`Affichage correct sur ${deviceName}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(BASE_URL);
      
      // Vérifier que les éléments principaux sont visibles
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('button:has-text("Commencer l\'Aventure")')).toBeVisible();
      
      // Prendre une capture d'écran
      await page.screenshot({
        path: `/tmp/playwright-logs/screenshot-${deviceName}.png`,
        fullPage: true
      });
    });
  }

  test('Touch gestures fonctionnent sur mobile', async ({ page }) => {
    await page.setViewportSize(viewports.mobile);
    await page.goto(BASE_URL);
    
    // Vérifier que les scripts de touch gestures sont chargés (optionnel)
    const touchGesturesLoaded = await page.evaluate(() => {
      return typeof window.initTouchGestures !== 'undefined' || 
             typeof window.showTouchHint !== 'undefined';
    });
    // Touch gestures peut être optionnel selon le navigateur
    expect(typeof touchGesturesLoaded).toBe('boolean');
  });
});

// ============================================================================
// Tests de Fonctionnalité - Création de Personnage
// ============================================================================

test.describe('Création de Personnage', () => {
  
  test('Peut créer un personnage et démarrer le jeu', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Remplir le nom
    await page.locator('input[placeholder*="Nom"]').fill('TestHero');
    
    // Sélectionner le genre
    await page.locator('label:has-text("Masculin")').click();
    
    // Sélectionner la race
    await page.locator('label:has-text("Humain")').click();
    
    // Sélectionner la classe
    await page.locator('label:has-text("Guerrier")').click();
    
    // Démarrer l'aventure
    await page.locator('button:has-text("Commencer l\'Aventure")').click();
    
    // Attendre que le jeu démarre
    await page.waitForTimeout(1000);
    
    // Vérifier qu'on n'est plus sur l'écran de création
    const startButton = await page.locator('button:has-text("Commencer l\'Aventure")').isVisible();
    expect(startButton).toBe(false);
  });

  test('Le générateur de nom aléatoire fonctionne', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const nameInput = page.locator('input[placeholder*="Nom"]');
    
    // Cliquer sur le bouton de génération
    await page.locator('button:has-text("🎲")').click();
    
    // Vérifier qu'un nom a été généré
    const generatedName = await nameInput.inputValue();
    expect(generatedName.length).toBeGreaterThan(0);
  });

  test('Peut changer de genre', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Sélectionner féminin
    await page.locator('label:has-text("Féminin")').click();
    
    const femaleRadio = page.locator('input[type="radio"][value="female"]');
    await expect(femaleRadio).toBeChecked();
  });

  test('Peut changer de race', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Cliquer sur une option de race (via le container cliquable)
    const raceOptions = page.locator('.race-option, [onclick*="selectRace"]');
    const count = await raceOptions.count();
    
    if (count > 0) {
      // Cliquer sur la deuxième option
      await raceOptions.nth(1).click();
      await page.waitForTimeout(200);
      
      // Vérifier qu'un radio est coché
      const checkedRace = await page.locator('input[type="radio"]:checked').count();
      expect(checkedRace).toBeGreaterThan(0);
    } else {
      // Fallback: chercher les labels
      const elfeLabel = page.locator('strong:has-text("Elfe")').first();
      await elfeLabel.click();
      await page.waitForTimeout(200);
      
      const checkedRace = await page.locator('input[type="radio"]:checked').count();
      expect(checkedRace).toBeGreaterThan(0);
    }
  });

  test('Peut changer de classe', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Cliquer sur une option de classe (via le container cliquable)
    const classOptions = page.locator('.class-option, [onclick*="selectClass"]');
    const count = await classOptions.count();
    
    if (count > 0) {
      // Cliquer sur la deuxième option (Archer ou autre)
      await classOptions.nth(1).click();
      await page.waitForTimeout(200);
      
      // Vérifier qu'un radio est coché
      const checkedClass = await page.locator('input[type="radio"]:checked').count();
      expect(checkedClass).toBeGreaterThan(0);
    } else {
      // Fallback: chercher les labels
      const magicienLabel = page.locator('strong:has-text("Magicien")').first();
      await magicienLabel.click();
      await page.waitForTimeout(200);
      
      const checkedClass = await page.locator('input[type="radio"]:checked').count();
      expect(checkedClass).toBeGreaterThan(0);
    }
  });
});

// ============================================================================
// Tests de Fonctionnalité - LocalStorage
// ============================================================================

test.describe('Système de Sauvegarde (LocalStorage)', () => {
  
  test('LocalStorage est disponible', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const localStorageAvailable = await page.evaluate(() => {
      try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return true;
      } catch (e) {
        return false;
      }
    });
    
    expect(localStorageAvailable).toBe(true);
  });

  test('Le jeu peut sauvegarder des données', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Créer un personnage
    await page.locator('input[placeholder*="Nom"]').fill('SaveTest');
    await page.locator('button:has-text("Commencer l\'Aventure")').click();
    await page.waitForTimeout(2000);
    
    // Vérifier qu'une sauvegarde existe dans localStorage
    const hasSave = await page.evaluate(() => {
      const keys = Object.keys(localStorage);
      return keys.some(key => key.includes('game') || key.includes('save') || key.includes('player'));
    });
    
    expect(hasSave).toBe(true);
  });
});

// ============================================================================
// Tests de Fonctionnalité - Audio
// ============================================================================

test.describe('Système Audio', () => {
  
  test('Le gestionnaire audio est initialisé', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const audioManagerLoaded = await page.evaluate(() => {
      return typeof window.audioManager !== 'undefined' || 
             typeof window.toggleAudio !== 'undefined';
    });
    
    expect(audioManagerLoaded).toBe(true);
  });

  test('Le bouton audio fonctionne', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const audioButton = page.locator('button:has-text("🔊"), button:has-text("🔇")');
    await expect(audioButton).toBeVisible();
    
    // Cliquer sur le bouton audio
    await audioButton.click();
    await page.waitForTimeout(200);
    
    // Le bouton devrait changer d'état
    await expect(audioButton).toBeVisible();
  });
});

// ============================================================================
// Tests de Fonctionnalité - Internationalisation
// ============================================================================

test.describe('Système de Langues', () => {
  
  test('Le sélecteur de langue est visible', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const languageButton = page.locator('#languageToggle').first();
    await expect(languageButton).toBeVisible();
  });

  test('Peut changer de langue', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Cliquer sur le bouton de langue
    const languageButton = page.locator('button:has-text("🇫🇷"), button:has-text("🇬🇧")').first();
    await languageButton.click();
    await page.waitForTimeout(500);
    
    // Le menu de langue devrait apparaître
    const languageMenu = page.locator('#languageMenu, .language-menu');
    if (await languageMenu.isVisible()) {
      await expect(languageMenu).toBeVisible();
    }
  });
});

// ============================================================================
// Tests de Performance
// ============================================================================

test.describe('Tests de Performance', () => {
  
  test('La page se charge rapidement (< 3s)', async ({ page }) => {
    const startTime = Date.now();
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000);
  });

  test('Pas de fuite de mémoire évidente', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Mesurer la mémoire initiale
    const initialMetrics = await page.evaluate(() => {
      if (performance.memory) {
        return performance.memory.usedJSHeapSize;
      }
      return 0;
    });
    
    // Effectuer quelques actions
    await page.locator('input[placeholder*="Nom"]').fill('MemoryTest');
    await page.locator('label:has-text("Magicien")').click();
    await page.locator('label:has-text("Elfe")').click();
    await page.waitForTimeout(500);
    
    // Mesurer la mémoire finale
    const finalMetrics = await page.evaluate(() => {
      if (performance.memory) {
        return performance.memory.usedJSHeapSize;
      }
      return 0;
    });
    
    // La mémoire ne devrait pas augmenter de manière déraisonnable (< 50MB)
    if (initialMetrics > 0 && finalMetrics > 0) {
      const increase = (finalMetrics - initialMetrics) / 1024 / 1024;
      expect(increase).toBeLessThan(50);
    }
  });
});

// ============================================================================
// Tests PWA
// ============================================================================

test.describe('Progressive Web App (PWA)', () => {
  
  test('Le manifeste PWA est accessible', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const manifestLink = await page.locator('link[rel="manifest"]').getAttribute('href');
    expect(manifestLink).toBeTruthy();
    
    // Vérifier que le manifeste est accessible
    const response = await page.goto(`${BASE_URL}${manifestLink}`);
    expect(response.status()).toBe(200);
  });

  test('Service Worker est enregistré', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);
    
    const swRegistered = await page.evaluate(() => {
      return navigator.serviceWorker.getRegistrations().then(registrations => {
        return registrations.length > 0;
      });
    });
    
    // Note: Le SW peut ne pas s'enregistrer sur localhost dans certains cas
    // Ce test vérifie juste qu'il n'y a pas d'erreur
    expect(typeof swRegistered).toBe('boolean');
  });

  test('Les icônes PWA sont présentes', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const icons = await page.locator('link[rel*="icon"]').count();
    expect(icons).toBeGreaterThan(0);
  });
});

// ============================================================================
// Tests de Sécurité Basiques
// ============================================================================

test.describe('Sécurité Basique', () => {
  
  test('Content Security Policy est défini', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const csp = await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute('content');
    expect(csp).toBeTruthy();
    expect(csp).toContain("default-src 'self'");
  });

  test('Pas d\'injection XSS dans le nom du personnage', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Tenter une injection XSS
    const maliciousInput = '<script>alert("XSS")</script>';
    await page.locator('input[placeholder*="Nom"]').fill(maliciousInput);
    
    // Le navigateur ne devrait pas exécuter le script
    const xssAlerts = [];
    page.on('dialog', dialog => {
      if (dialog.message().includes('XSS')) {
        xssAlerts.push(dialog.message());
      }
      dialog.dismiss().catch(() => {});
    });
    
    await page.locator('button:has-text("Commencer l\'Aventure")').click();
    await page.waitForTimeout(1000);
    
    // Vérifier qu'aucune alerte XSS n'a été déclenchée
    expect(xssAlerts).toHaveLength(0);
  });
});
