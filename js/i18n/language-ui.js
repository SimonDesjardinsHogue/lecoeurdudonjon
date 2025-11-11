// Language UI Update Module
import { t } from './i18n.js';

// Update all static text elements in the HTML
export function updateLanguageUI() {
    // Update game title and header
    const titleElement = document.querySelector('.game-header h1');
    if (titleElement) {
        titleElement.textContent = t('gameTitle');
    }
    
    const subtitleElement = document.querySelector('.subtitle');
    if (subtitleElement) {
        subtitleElement.textContent = t('subtitle');
    }
    
    // Update audio toggle title
    const audioToggle = document.getElementById('audioToggle');
    if (audioToggle) {
        audioToggle.title = t('audioToggle');
    }
    
    // Update info link title
    const marketingLink = document.querySelector('.marketing-link');
    if (marketingLink) {
        marketingLink.title = t('info');
    }
    
    // Update connection banner
    updateConnectionBanner();
    
    // Update start screen
    updateStartScreen();
    
    // Update main screen
    updateMainScreen();
    
    // Update stats labels
    updateStatsLabels();
    
    // Update equipment modal
    updateEquipmentModal();
    
    // Update combat screen
    updateCombatScreen();
    
    // Update menus
    updateMenuScreens();
}

function updateConnectionBanner() {
    const bannerText = document.getElementById('connectionBannerText');
    if (bannerText && bannerText.textContent.includes('Connexion') || bannerText.textContent.includes('Connecting')) {
        bannerText.textContent = t('connectionToServer');
    }
    
    const retryBtn = document.getElementById('retryConnectionBtn');
    if (retryBtn) {
        retryBtn.innerHTML = `🔄 ${t('retryConnection')}`;
    }
}

function updateStartScreen() {
    // Update welcome text
    const storyTexts = document.querySelectorAll('#startScreen .story-text p');
    if (storyTexts.length > 0 && storyTexts[0].textContent.includes('Bienvenue')) {
        storyTexts[0].textContent = t('welcomeBrave');
    }
    
    // Update name label
    const nameLabel = document.querySelector('#startScreen label[for="nameInput"]');
    if (nameLabel) {
        nameLabel.textContent = t('enterName');
    }
    
    const nameInput = document.getElementById('nameInput');
    if (nameInput) {
        nameInput.placeholder = t('heroName');
    }
    
    // Update gender section
    const genderLabel = document.querySelector('#startScreen label[style*="Genre"]');
    if (genderLabel) {
        genderLabel.textContent = t('gender') + ' :';
    }
    
    // Update gender options
    const maleLabel = document.querySelector('input[value="male"] + .class-label strong');
    if (maleLabel) {
        maleLabel.textContent = `♂️ ${t('male')}`;
    }
    
    const femaleLabel = document.querySelector('input[value="female"] + .class-label strong');
    if (femaleLabel) {
        femaleLabel.textContent = `♀️ ${t('female')}`;
    }
    
    // Update race section
    const raceLabel = document.querySelectorAll('#startScreen label[style*="Race"]')[0];
    if (raceLabel) {
        raceLabel.textContent = t('race') + ' :';
    }
    
    // Update race options
    updateRaceOption('humain', t('human'), t('balanced'));
    updateRaceOption('elfe', t('elf'));
    updateRaceOption('nain', t('dwarf'));
    
    // Update class section
    const classLabel = document.querySelector('#startScreen label[style*="Choisissez"]');
    if (classLabel) {
        classLabel.textContent = t('chooseClass');
    }
    
    // Update class options
    updateClassOption('guerrier', t('warrior'), t('warriorDesc'));
    updateClassOption('magicien', t('mage'), t('mageDesc'));
    updateClassOption('archer', t('archer'), t('archerDesc'));
    
    // Update buttons
    const startBtn = document.querySelector('#startScreen button[onclick="startGame()"]');
    if (startBtn) {
        startBtn.innerHTML = `🗡️ ${t('startAdventure')}`;
    }
    
    const restoreBtn = document.getElementById('restoreSaveBtn');
    if (restoreBtn) {
        restoreBtn.innerHTML = `📥 ${t('restoreSave')}`;
    }
}

function updateRaceOption(value, name, desc) {
    const raceInput = document.querySelector(`input[name="characterRace"][value="${value}"]`);
    if (raceInput) {
        const label = raceInput.nextElementSibling;
        if (label) {
            const strong = label.querySelector('strong');
            const small = label.querySelector('small');
            
            if (strong) {
                const icon = strong.textContent.split(' ')[0]; // Keep the icon
                strong.innerHTML = `${icon} ${name}`;
            }
            
            if (small && desc) {
                small.textContent = desc;
            }
        }
    }
}

function updateClassOption(value, name, desc) {
    const classInput = document.querySelector(`input[name="characterClass"][value="${value}"]`);
    if (classInput) {
        const label = classInput.nextElementSibling;
        if (label) {
            const strong = label.querySelector('strong');
            const smalls = label.querySelectorAll('small');
            
            if (strong) {
                const icon = strong.textContent.split(' ')[0]; // Keep the icon
                strong.innerHTML = `${icon} ${name}`;
            }
            
            if (smalls.length > 1 && desc) {
                smalls[1].textContent = desc;
            }
        }
    }
}

function updateMainScreen() {
    // Update action column titles
    const actionTitles = document.querySelectorAll('.actions-column-title');
    if (actionTitles.length >= 2) {
        actionTitles[0].textContent = `🎮 ${t('actions')}`;
        actionTitles[1].textContent = `📊 ${t('information')}`;
    }
    
    // Update buttons (note: keeping numbers for keyboard shortcuts)
    const exploreBtn = document.querySelector('button[onclick="explore()"]');
    if (exploreBtn) {
        exploreBtn.innerHTML = `🗺️ ${t('exploreForest')} (1)`;
    }
    
    const villageBtn = document.querySelector('button[onclick="visitVillage()"]');
    if (villageBtn) {
        villageBtn.innerHTML = `🏘️ ${t('visitVillage')} (2)`;
    }
    
    const restBtn = document.querySelector('button[onclick="rest()"]');
    if (restBtn) {
        restBtn.innerHTML = `🛌 ${t('sleepInn')} (3)`;
    }
    
    const statsBtn = document.querySelector('button[onclick="showStatsAndLeaderboard()"]');
    if (statsBtn) {
        statsBtn.innerHTML = `📊 ${t('statistics')} (4)`;
    }
    
    const progressionBtn = document.querySelector('button[onclick="showProgressionMenu()"]');
    if (progressionBtn) {
        progressionBtn.innerHTML = `🏆 ${t('progression')} (5)`;
    }
    
    const optionsBtn = document.querySelector('button[onclick="showOptionsMenu()"]');
    if (optionsBtn) {
        optionsBtn.innerHTML = `⚙️ ${t('options')} (6)`;
    }
}

function updateStatsLabels() {
    // Update stat group labels
    const statLabels = document.querySelectorAll('.stat-label');
    if (statLabels.length >= 3) {
        statLabels[0].textContent = t('character');
        statLabels[1].textContent = t('combat');
        statLabels[2].textContent = t('progressionStats');
    }
    
    // Update inventory bag label
    const bagLabel = document.querySelector('.char-label-small');
    // Note: Keeping 🎒 icon, text is in updateInventoryPanel function
}

function updateEquipmentModal() {
    const modalTitle = document.querySelector('#equipmentModal h2');
    if (modalTitle) {
        modalTitle.textContent = `⚔️ ${t('equipment')}`;
    }
    
    // Update equipment labels
    const weaponLabel = document.querySelector('#equipmentModal .equipment-details strong');
    if (weaponLabel && weaponLabel.textContent.includes('Arme')) {
        weaponLabel.textContent = t('weapon');
    }
    
    // Armor, shield, book, quiver labels are updated dynamically
}

function updateCombatScreen() {
    // Update combat buttons
    const attackBtn = document.querySelector('button[onclick="attack()"]');
    if (attackBtn) {
        attackBtn.innerHTML = `⚔️ ${t('attack')} (A)`;
    }
    
    const defendBtn = document.querySelector('button[onclick="defend()"]');
    if (defendBtn) {
        defendBtn.innerHTML = `🛡️ ${t('defend')} (D)`;
    }
    
    const fleeBtn = document.querySelector('button[onclick="flee()"]');
    if (fleeBtn) {
        fleeBtn.innerHTML = `🏃 ${t('flee')} (F)`;
    }
}

function updateMenuScreens() {
    // Stats and Leaderboard screen
    updateScreenTitle('statsAndLeaderboardScreen', t('statsLeaderboard'));
    updateScreenButtons('statsAndLeaderboardScreen', [
        { selector: 'button[onclick="showStats()"]', text: `📊 ${t('heroStats')}` },
        { selector: 'button[onclick="showLeaderboard()"]', text: `🏆 ${t('leaderboard')}` },
        { selector: 'button[onclick="showMain()"]', text: `🚪 ${t('backEsc')}` }
    ]);
    
    // Progression menu screen
    updateScreenTitle('progressionMenuScreen', t('progressionMenu'));
    updateScreenButtons('progressionMenuScreen', [
        { selector: 'button[onclick="showDailyQuests()"]', text: `📜 ${t('dailyChallenges')}` },
        { selector: 'button[onclick="showDailyRewards()"]', text: `🎁 ${t('rewards')}` },
        { selector: 'button[onclick="showAchievements()"]', text: `🏅 ${t('achievements')}` },
        { selector: 'button[onclick="showMain()"]', text: `🚪 ${t('backEsc')}` }
    ]);
    
    // Options menu screen
    updateScreenTitle('optionsMenuScreen', t('optionsMenu'));
    updateScreenButtons('optionsMenuScreen', [
        { selector: 'button[onclick="showSaveOptions()"]', text: `💾 ${t('saves')}` },
        { selector: 'button[onclick="resetGame()"]', text: `🔄 ${t('newGame')}` },
        { selector: 'button[onclick="showMultiplayerSettings()"]', text: `🌐 ${t('multiplayerSettings')}` },
        { selector: 'button[onclick="showMain()"]', text: `🚪 ${t('backEsc')}` }
    ]);
    
    // Save options screen
    updateScreenTitle('saveOptionsScreen', t('saveManagement'));
    
    // Multiplayer settings screen
    updateScreenTitle('multiplayerSettingsScreen', t('multiplayerLAN'));
    
    // Victory screen
    const victoryTitle = document.querySelector('#victoryScreen h2');
    if (victoryTitle) {
        victoryTitle.textContent = `🏆 ${t('victory')} 🏆`;
    }
    
    const newGameBtn = document.querySelector('#victoryScreen button[onclick="resetGame()"]');
    if (newGameBtn) {
        newGameBtn.innerHTML = `🔄 ${t('newAdventure')}`;
    }
    
    // Admin panel
    updateScreenTitle('adminPanelScreen', t('adminPanel'));
}

function updateScreenTitle(screenId, title) {
    const screen = document.getElementById(screenId);
    if (screen) {
        const h3 = screen.querySelector('.story-text h3');
        if (h3) {
            h3.textContent = title;
        }
    }
}

function updateScreenButtons(screenId, buttons) {
    const screen = document.getElementById(screenId);
    if (!screen) return;
    
    buttons.forEach(btnConfig => {
        const btn = screen.querySelector(btnConfig.selector);
        if (btn) {
            btn.innerHTML = btnConfig.text;
        }
    });
}
