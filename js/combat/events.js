// Events Module
// Responsibility: Handle random events, riddles, and moral choices

import { gameState, randomEvents, riddles, moralChoices } from '../game-state.js';
import { showScreen, updateUI } from '../ui.js';
import { saveGame } from '../save-load.js';
import { checkLevelUp } from '../game-logic.js';
import { rollChance, rollSelect } from '../dice.js';

// Trigger random event
export function triggerRandomEvent(location = null) {
    // 15% riddle, 15% moral choice, 70% random event
    if (rollChance(15)) {
        triggerRiddle();
    } else if (rollChance(15)) {
        triggerMoralChoice();
    } else {
        // Filter events by location if specified
        let availableEvents = randomEvents;
        if (location) {
            availableEvents = randomEvents.filter(event => event.location === location);
        }
        
        // If no events available for this location, use all events as fallback
        if (availableEvents.length === 0) {
            availableEvents = randomEvents;
        }
        
        const event = rollSelect(availableEvents);
        const result = event.effect(gameState.player);
        
        showScreen('npcScreen');
        
        // Show event info container and hide regular NPC content
        const eventInfo = document.getElementById('eventInfo');
        const npcContent = document.getElementById('npcContent');
        eventInfo.style.display = 'flex';
        npcContent.style.display = 'none';
        
        // Set the event icon
        const eventIcon = document.getElementById('eventIcon');
        eventIcon.textContent = event.icon;
        
        // Set the event name
        const eventName = document.getElementById('eventName');
        eventName.textContent = event.name;
        
        // Set the event description
        const eventDescription = document.getElementById('eventDescription');
        eventDescription.innerHTML = '';
        
        const desc = document.createElement('p');
        desc.textContent = event.description;
        desc.style.fontStyle = 'italic';
        desc.style.marginBottom = '15px';
        eventDescription.appendChild(desc);
        
        const resultPara = document.createElement('p');
        resultPara.textContent = `✨ ${result}`;
        resultPara.style.color = event.type === 'trap' || event.type === 'theft' ? '#ff6b6b' : '#51cf66';
        resultPara.style.fontWeight = 'bold';
        eventDescription.appendChild(resultPara);
        
        saveGame();
        updateUI();
    }
}

// Trigger riddle
function triggerRiddle() {
    const riddle = rollSelect(riddles);
    
    showScreen('npcScreen');
    
    // Show event info container and hide regular NPC content
    const eventInfo = document.getElementById('eventInfo');
    const npcContent = document.getElementById('npcContent');
    eventInfo.style.display = 'flex';
    npcContent.style.display = 'none';
    
    // Set the event icon
    const eventIcon = document.getElementById('eventIcon');
    eventIcon.textContent = '🧙‍♂️';
    
    // Set the event name
    const eventName = document.getElementById('eventName');
    eventName.textContent = 'Sphinx Énigmatique';
    
    // Set the event description
    const eventDescription = document.getElementById('eventDescription');
    eventDescription.innerHTML = '';
    
    const question = document.createElement('p');
    question.textContent = riddle.question;
    question.style.fontStyle = 'italic';
    question.style.marginBottom = '15px';
    eventDescription.appendChild(question);
    
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'riddleAnswer';
    input.placeholder = 'Votre réponse...';
    input.style.width = '100%';
    input.style.marginBottom = '10px';
    eventDescription.appendChild(input);
    
    const submitBtn = document.createElement('button');
    submitBtn.textContent = '✓ Répondre';
    submitBtn.onclick = () => checkRiddleAnswer(riddle);
    eventDescription.appendChild(submitBtn);
    
    const resultDiv = document.createElement('div');
    resultDiv.id = 'riddleResult';
    resultDiv.style.marginTop = '15px';
    eventDescription.appendChild(resultDiv);
}

// Check riddle answer
function checkRiddleAnswer(riddle) {
    const answer = document.getElementById('riddleAnswer').value.toLowerCase().trim();
    const resultDiv = document.getElementById('riddleResult');
    const inputEl = document.getElementById('riddleAnswer');
    const submitBtn = inputEl.nextElementSibling; // Get the submit button
    const p = gameState.player;
    
    if (riddle.answers.includes(answer)) {
        const reward = riddle.getReward();
        p.gold += reward.gold;
        p.xp += reward.xp;
        resultDiv.innerHTML = `<p style="color: #51cf66; font-weight: bold;">✓ Correct ! Vous gagnez ${reward.gold} or et ${reward.xp} XP !</p>`;
        checkLevelUp();
    } else {
        resultDiv.innerHTML = `<p style="color: #ff6b6b; font-weight: bold;">✗ Incorrect... La bonne réponse était : ${riddle.answers[0]}</p>`;
    }
    
    // Disable input and button to prevent re-submission
    inputEl.disabled = true;
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.5';
    submitBtn.style.cursor = 'not-allowed';
    
    saveGame();
    updateUI();
}

// Trigger moral choice
function triggerMoralChoice() {
    const choice = rollSelect(moralChoices);
    
    showScreen('npcScreen');
    
    // Show event info container and hide regular NPC content
    const eventInfo = document.getElementById('eventInfo');
    const npcContent = document.getElementById('npcContent');
    eventInfo.style.display = 'flex';
    npcContent.style.display = 'none';
    
    // Set the event icon
    const eventIcon = document.getElementById('eventIcon');
    eventIcon.textContent = '⚖️';
    
    // Set the event name
    const eventName = document.getElementById('eventName');
    eventName.textContent = 'Dilemme Moral';
    
    // Set the event description
    const eventDescription = document.getElementById('eventDescription');
    eventDescription.innerHTML = '';
    
    const situation = document.createElement('p');
    situation.textContent = choice.situation;
    situation.style.fontStyle = 'italic';
    situation.style.marginBottom = '15px';
    eventDescription.appendChild(situation);
    
    choice.choices.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.textContent = option.text;
        btn.style.display = 'block';
        btn.style.marginBottom = '10px';
        btn.style.width = '100%';
        btn.onclick = () => makeMoralChoice(option, eventDescription);
        eventDescription.appendChild(btn);
    });
}

// Make moral choice
function makeMoralChoice(option, container) {
    const result = option.effect(gameState.player);
    
    const resultDiv = document.createElement('div');
    resultDiv.style.marginTop = '15px';
    resultDiv.innerHTML = `<p style="color: #DAA520; font-weight: bold;">${result}</p>`;
    
    // Remove buttons
    const buttons = container.querySelectorAll('button');
    buttons.forEach(btn => btn.remove());
    
    container.appendChild(resultDiv);
    
    checkLevelUp();
    saveGame();
    updateUI();
}
