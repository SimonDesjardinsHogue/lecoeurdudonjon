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
    
    // Update HTML static texts
    updateStaticTexts();
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
    const genderLabels = document.querySelectorAll('#startScreen label');
    genderLabels.forEach(label => {
        if (label.textContent.includes('Genre') || label.textContent.includes('Gender') || label.textContent.includes('Género')) {
            label.textContent = t('gender') + ' :';
        }
    });
    
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
    genderLabels.forEach(label => {
        if (label.textContent.includes('Race') || label.textContent.includes('Raza')) {
            label.textContent = t('race') + ' :';
        }
    });
    
    // Update race options
    updateRaceOption('humain', t('human'), t('balanced'));
    updateRaceOption('elfe', t('elf'));
    updateRaceOption('nain', t('dwarf'));
    
    // Update class section
    genderLabels.forEach(label => {
        if (label.textContent.includes('Choisissez') || label.textContent.includes('Choose') || label.textContent.includes('Elige')) {
            label.textContent = t('chooseClass');
        }
    });
    
    // Update class options
    updateClassOption('guerrier', t('warrior'), t('warriorDesc'));
    updateClassOption('magicien', t('mage'), t('mageDesc'));
    updateClassOption('archer', t('archer'), t('archerDesc'));
    updateClassOption('enchanteur', t('enchanter'), t('enchanterDesc'));
    
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
                strong.textContent = `${icon} ${name}`;
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
                strong.textContent = `${icon} ${name}`;
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

// Update all static HTML texts that need translation
function updateStaticTexts() {
    // Update equipment tooltips in inline display
    const equippedWeaponTooltip = document.querySelector('[title="Arme équipée"]');
    if (equippedWeaponTooltip) {
        equippedWeaponTooltip.title = t('equippedWeapon');
    }
    
    const equippedArmorTooltip = document.querySelector('[title="Armure équipée"]');
    if (equippedArmorTooltip) {
        equippedArmorTooltip.title = t('equippedArmor');
    }
    
    const equippedShieldTooltip = document.getElementById('equippedShieldSlotInline');
    if (equippedShieldTooltip) {
        equippedShieldTooltip.title = t('equippedShield');
    }
    
    const equippedBookTooltip = document.getElementById('equippedBookSlotInline');
    if (equippedBookTooltip) {
        equippedBookTooltip.title = t('equippedBook');
    }
    
    const equippedQuiverTooltip = document.getElementById('equippedQuiverSlotInline');
    if (equippedQuiverTooltip) {
        equippedQuiverTooltip.title = t('equippedQuiver');
    }
    
    const equippedAmuletTooltip = document.getElementById('equippedAmuletSlotInline');
    if (equippedAmuletTooltip) {
        equippedAmuletTooltip.title = t('equippedAmulet');
    }
    
    // Update bag tooltip
    const bagTooltip = document.querySelector('[title="Ouvrir/Fermer le sac"]');
    if (bagTooltip) {
        bagTooltip.title = t('openCloseBag');
    }
    
    // Update inventory panel label
    const inventoryPanelLabel = document.querySelector('#inventoryPanel [style*="color: #DAA520"]');
    if (inventoryPanelLabel) {
        inventoryPanelLabel.innerHTML = `🎒 ${t('bag')}`;
    }
    
    // Update combat stat labels
    const weaponLabelEl = document.querySelector('.combat-stat-inline .stat-label-inline');
    if (weaponLabelEl && (weaponLabelEl.textContent === 'Arme:' || weaponLabelEl.textContent === 'Weapon:' || weaponLabelEl.textContent === 'Arma:')) {
        weaponLabelEl.textContent = t('weaponLabel');
    }
    
    const armorClassLabels = document.querySelectorAll('.combat-stat-inline .stat-label-inline');
    if (armorClassLabels.length > 1) {
        const acLabel = armorClassLabels[1];
        if (acLabel && (acLabel.textContent === 'CA:' || acLabel.textContent === 'AC:')) {
            acLabel.textContent = t('armorClass');
        }
    }
    
    // Update attribute labels
    const charLabels = document.querySelectorAll('.char-label-small');
    charLabels.forEach(label => {
        const text = label.textContent.trim();
        if (text === 'Puissance' || text === 'Power' || text === 'Poder') {
            label.textContent = t('power');
        } else if (text === 'Adresse' || text === 'Dexterity' || text === 'Destreza') {
            label.textContent = t('dexterity');
        } else if (text === 'Esprit' || text === 'Spirit' || text === 'Espíritu') {
            label.textContent = t('spirit');
        } else if (text === 'Présence' || text === 'Presence' || text === 'Presencia') {
            label.textContent = t('presence');
        }
    });
    
    // Update equipment modal labels
    updateEquipmentModalLabels();
    
    // Update default equipment texts in modal
    updateDefaultEquipmentTexts();
    
    // Update inline equipment default texts
    updateInlineEquipmentTexts();
}

// Update equipment modal labels
function updateEquipmentModalLabels() {
    const equipmentLabels = document.querySelectorAll('#equipmentModal .equipment-details > div[style*="font-weight: bold"]');
    if (equipmentLabels.length > 0) {
        equipmentLabels[0].textContent = t('weapon');
        if (equipmentLabels[1]) equipmentLabels[1].textContent = t('armor');
    }
    
    // Update shield label
    const shieldLabel = document.querySelector('#equippedShieldSlot .equipment-details > div[style*="font-weight: bold"]');
    if (shieldLabel) {
        shieldLabel.textContent = t('shield');
    }
    
    // Update book label
    const bookLabel = document.querySelector('#equippedBookSlot .equipment-details > div[style*="font-weight: bold"]');
    if (bookLabel) {
        bookLabel.textContent = t('book');
    }
    
    // Update quiver label
    const quiverLabel = document.querySelector('#equippedQuiverSlot .equipment-details > div[style*="font-weight: bold"]');
    if (quiverLabel) {
        quiverLabel.textContent = t('quiver');
    }
    
    // Update amulet label
    const amuletLabel = document.querySelector('#equippedAmuletSlot .equipment-details > div[style*="font-weight: bold"]');
    if (amuletLabel) {
        amuletLabel.textContent = t('amulet');
    }
}

// Update default equipment texts in equipment modal
function updateDefaultEquipmentTexts() {
    const weaponName = document.getElementById('equippedWeaponName');
    if (weaponName && (weaponName.textContent === 'Aucune arme' || weaponName.textContent === 'No weapon' || weaponName.textContent === 'Sin arma')) {
        weaponName.textContent = t('noWeapon');
    }
    
    const armorName = document.getElementById('equippedArmorName');
    if (armorName && (armorName.textContent === 'Aucune armure' || armorName.textContent === 'No armor' || armorName.textContent === 'Sin armadura')) {
        armorName.textContent = t('noArmor');
    }
    
    const shieldName = document.getElementById('equippedShieldName');
    if (shieldName && (shieldName.textContent === 'Aucun bouclier' || shieldName.textContent === 'No shield' || shieldName.textContent === 'Sin escudo')) {
        shieldName.textContent = t('noShield');
    }
    
    const bookName = document.getElementById('equippedBookName');
    if (bookName && (bookName.textContent === 'Aucun livre' || bookName.textContent === 'No book' || bookName.textContent === 'Sin libro')) {
        bookName.textContent = t('noBook');
    }
    
    const quiverName = document.getElementById('equippedQuiverName');
    if (quiverName && (quiverName.textContent === 'Aucun carquois' || quiverName.textContent === 'No quiver' || quiverName.textContent === 'Sin carcaj')) {
        quiverName.textContent = t('noQuiver');
    }
    
    const amuletName = document.getElementById('equippedAmuletName');
    if (amuletName && (amuletName.textContent === 'Aucune amulette' || amuletName.textContent === 'No amulet' || amuletName.textContent === 'Sin amuleto')) {
        amuletName.textContent = t('noAmulet');
    }
}

// Update inline equipment default texts
function updateInlineEquipmentTexts() {
    const weaponNameInline = document.getElementById('equippedWeaponNameInline');
    if (weaponNameInline && (weaponNameInline.textContent === 'Aucune' || weaponNameInline.textContent === 'None' || weaponNameInline.textContent === 'Ninguna')) {
        weaponNameInline.textContent = t('none');
    }
    
    const armorNameInline = document.getElementById('equippedArmorNameInline');
    if (armorNameInline && (armorNameInline.textContent === 'Aucune' || armorNameInline.textContent === 'None' || armorNameInline.textContent === 'Ninguna')) {
        armorNameInline.textContent = t('none');
    }
    
    const shieldNameInline = document.getElementById('equippedShieldNameInline');
    if (shieldNameInline && (shieldNameInline.textContent === 'Aucun' || shieldNameInline.textContent === 'None' || shieldNameInline.textContent === 'Ninguno')) {
        shieldNameInline.textContent = t('noneM');
    }
    
    const bookNameInline = document.getElementById('equippedBookNameInline');
    if (bookNameInline && (bookNameInline.textContent === 'Aucun' || bookNameInline.textContent === 'None' || bookNameInline.textContent === 'Ninguno')) {
        bookNameInline.textContent = t('noneM');
    }
    
    const quiverNameInline = document.getElementById('equippedQuiverNameInline');
    if (quiverNameInline && (quiverNameInline.textContent === 'Aucun' || quiverNameInline.textContent === 'None' || quiverNameInline.textContent === 'Ninguno')) {
        quiverNameInline.textContent = t('noneM');
    }
    
    const amuletNameInline = document.getElementById('equippedAmuletNameInline');
    if (amuletNameInline && (amuletNameInline.textContent === 'Aucun' || amuletNameInline.textContent === 'None' || amuletNameInline.textContent === 'Ninguno')) {
        amuletNameInline.textContent = t('noneM');
    }
}
