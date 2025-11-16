// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Configuration Playwright pour tests de compatibilité navigateurs
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  
  // Timeout pour chaque test
  timeout: 30 * 1000,
  
  // Attentes (expect) timeout
  expect: {
    timeout: 5000
  },
  
  // Reporter les échecs uniquement
  fullyParallel: true,
  
  // Réessayer les tests échoués
  retries: process.env.CI ? 2 : 0,
  
  // Nombre de workers en parallèle
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list']
  ],
  
  // Configuration commune à tous les tests
  use: {
    // URL de base
    baseURL: process.env.TEST_URL || 'http://localhost:8000',
    
    // Prendre une capture d'écran uniquement en cas d'échec
    screenshot: 'only-on-failure',
    
    // Enregistrer la trace uniquement en cas d'échec
    trace: 'retain-on-failure',
    
    // Timeout pour les actions
    actionTimeout: 10000,
    
    // Timeout pour la navigation
    navigationTimeout: 30000,
  },

  // Configuration des différents navigateurs/dispositifs à tester
  projects: [
    // Desktop Browsers
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 }
      },
    },
    
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 }
      },
    },
    
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 }
      },
    },

    // Mobile Browsers
    {
      name: 'mobile-chrome',
      use: { 
        ...devices['Pixel 5']
      },
    },
    
    {
      name: 'mobile-safari',
      use: { 
        ...devices['iPhone 12']
      },
    },

    // Tablets
    {
      name: 'tablet-ipad',
      use: { 
        ...devices['iPad Pro']
      },
    },
    
    {
      name: 'tablet-landscape',
      use: {
        ...devices['iPad Pro landscape']
      },
    },
  ],

  // Serveur web pour les tests (optionnel)
  webServer: process.env.CI ? {
    command: 'npm start',
    url: 'http://localhost:8000',
    timeout: 120 * 1000,
    reuseExistingServer: true,
  } : undefined,
});
