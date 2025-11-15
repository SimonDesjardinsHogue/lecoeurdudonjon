// Report Formatter Module
// Responsibility: Format balance test reports as HTML

import { characterClasses } from '../character-classes.js';
import { characterRaces } from '../character-races.js';
import { characterSexes } from '../character-sexes.js';

// Format report as HTML table
export function formatReportAsHTML(report) {
    let html = '<div class="balance-report">';
    
    // Balance Status Overview
    html += '<div class="report-section">';
    html += '<h3>🎯 État de l\'Équilibre</h3>';
    html += '<div class="shop-item" style="display: block;">';
    
    // Determine overall balance status
    const avgWinRate = parseFloat(report.summary.avgWinRate);
    const avgLevel = parseFloat(report.summary.avgLevel);
    const percentLevel20 = parseFloat(report.summary.percentReachedLevel20);
    
    let balanceStatus = '';
    let statusColor = '';
    
    if (avgWinRate >= 70 && avgWinRate <= 80 && percentLevel20 >= 60) {
        balanceStatus = '✓ Excellent - Le jeu est bien équilibré';
        statusColor = '#51cf66';
    } else if (avgWinRate >= 60 && avgWinRate <= 85) {
        balanceStatus = '⚠️ Acceptable - Quelques ajustements mineurs recommandés';
        statusColor = '#DAA520';
    } else if (avgWinRate < 50) {
        balanceStatus = '❌ Trop Difficile - Ajustements majeurs requis';
        statusColor = '#ff6b6b';
    } else {
        balanceStatus = '⚠️ Trop Facile - Réduction de difficulté recommandée';
        statusColor = '#ffd93d';
    }
    
    html += `<p style="font-size: 1.2em; color: ${statusColor}; font-weight: bold;">${balanceStatus}</p>`;
    html += `<p><strong>Nombre de problèmes détectés:</strong> ${report.suggestions.length}</p>`;
    
    if (report.suggestions.length > 0) {
        const criticalIssues = report.suggestions.filter(s => s.severity === 3).length;
        const majorIssues = report.suggestions.filter(s => s.severity === 2).length;
        const minorIssues = report.suggestions.filter(s => s.severity === 1 || !s.severity).length;
        
        html += `<div style="margin-top: 10px;">`;
        if (criticalIssues > 0) html += `<span style="color: #ff6b6b;">⚠️ Critiques: ${criticalIssues}</span> `;
        if (majorIssues > 0) html += `<span style="color: #ffd93d;">⚠️ Majeurs: ${majorIssues}</span> `;
        if (minorIssues > 0) html += `<span style="color: #DAA520;">⚠️ Mineurs: ${minorIssues}</span>`;
        html += `</div>`;
    }
    
    html += '</div></div>';
    
    // Summary
    html += '<div class="report-section">';
    html += '<h3>📊 Résumé Global</h3>';
    html += '<div class="shop-item" style="display: block;">';
    html += `<p><strong>Total de simulations:</strong> ${report.summary.totalSimulations.toLocaleString()}</p>`;
    html += `<p><strong>Niveau moyen atteint:</strong> ${report.summary.avgLevel}</p>`;
    html += `<p><strong>Taux de victoire moyen:</strong> ${report.summary.avgWinRate}</p>`;
    html += `<p><strong>Ennemis vaincus (moyenne):</strong> ${report.summary.avgKills}</p>`;
    html += `<p><strong>Boss vaincus (moyenne):</strong> ${report.summary.avgBossesDefeated}</p>`;
    html += `<p><strong>% atteignant niveau 20:</strong> ${report.summary.percentReachedLevel20}</p>`;
    html += '</div></div>';
    
    // Class comparison table
    html += '<div class="report-section">';
    html += '<h3>⚔️ Comparaison des Classes</h3>';
    html += '<table class="balance-table" style="width: 100%; border-collapse: collapse; margin-top: 10px;">';
    html += '<thead><tr style="background: rgba(218, 165, 32, 0.3);">';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Classe</th>';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Parties</th>';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Niveau Moy.</th>';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Taux Victoire</th>';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Kills Moy.</th>';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Morts Moy.</th>';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Or Récolté</th>';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Or Final</th>';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Équilibre</th>';
    html += '</tr></thead><tbody>';
    
    for (const [classKey, stats] of Object.entries(report.classStats)) {
        const balanceScore = parseFloat(report.balanceScore.byClass[classKey]);
        const scoreColor = balanceScore >= 90 ? '#51cf66' : balanceScore >= 80 ? '#DAA520' : '#ff6b6b';
        
        html += '<tr>';
        html += `<td style="padding: 8px; border: 1px solid #8B4513;"><strong>${stats.className}</strong></td>`;
        html += `<td style="padding: 8px; border: 1px solid #8B4513;">${stats.gamesPlayed.toLocaleString()}</td>`;
        html += `<td style="padding: 8px; border: 1px solid #8B4513;">${stats.avgLevel.toFixed(2)}</td>`;
        html += `<td style="padding: 8px; border: 1px solid #8B4513;">${(stats.avgWinRate * 100).toFixed(1)}%</td>`;
        html += `<td style="padding: 8px; border: 1px solid #8B4513;">${stats.avgKills.toFixed(1)}</td>`;
        html += `<td style="padding: 8px; border: 1px solid #8B4513;">${stats.avgDeaths.toFixed(1)}</td>`;
        html += `<td style="padding: 8px; border: 1px solid #8B4513;">${stats.avgGoldEarned.toFixed(0)} 💰</td>`;
        html += `<td style="padding: 8px; border: 1px solid #8B4513;">${stats.avgFinalGold.toFixed(0)} 💰</td>`;
        html += `<td style="padding: 8px; border: 1px solid #8B4513; color: ${scoreColor}; font-weight: bold;">${balanceScore.toFixed(0)}/100</td>`;
        html += '</tr>';
    }
    
    html += '</tbody></table></div>';
    
    // Race comparison table
    html += '<div class="report-section">';
    html += '<h3>🧝 Comparaison des Races</h3>';
    html += '<table class="balance-table" style="width: 100%; border-collapse: collapse; margin-top: 10px;">';
    html += '<thead><tr style="background: rgba(218, 165, 32, 0.3);">';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Race</th>';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Parties</th>';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Niveau Moy.</th>';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Taux Victoire</th>';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Kills Moy.</th>';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Morts Moy.</th>';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Or Récolté</th>';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Or Final</th>';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Équilibre</th>';
    html += '</tr></thead><tbody>';
    
    for (const [raceKey, stats] of Object.entries(report.raceStats)) {
        const balanceScore = parseFloat(report.balanceScore.byRace[raceKey]);
        const scoreColor = balanceScore >= 90 ? '#51cf66' : balanceScore >= 80 ? '#DAA520' : '#ff6b6b';
        
        html += '<tr>';
        html += `<td style="padding: 8px; border: 1px solid #8B4513;"><strong>${stats.raceName}</strong></td>`;
        html += `<td style="padding: 8px; border: 1px solid #8B4513;">${stats.gamesPlayed.toLocaleString()}</td>`;
        html += `<td style="padding: 8px; border: 1px solid #8B4513;">${stats.avgLevel.toFixed(2)}</td>`;
        html += `<td style="padding: 8px; border: 1px solid #8B4513;">${(stats.avgWinRate * 100).toFixed(1)}%</td>`;
        html += `<td style="padding: 8px; border: 1px solid #8B4513;">${stats.avgKills.toFixed(1)}</td>`;
        html += `<td style="padding: 8px; border: 1px solid #8B4513;">${stats.avgDeaths.toFixed(1)}</td>`;
        html += `<td style="padding: 8px; border: 1px solid #8B4513;">${stats.avgGoldEarned.toFixed(0)} 💰</td>`;
        html += `<td style="padding: 8px; border: 1px solid #8B4513;">${stats.avgFinalGold.toFixed(0)} 💰</td>`;
        html += `<td style="padding: 8px; border: 1px solid #8B4513; color: ${scoreColor}; font-weight: bold;">${balanceScore.toFixed(0)}/100</td>`;
        html += '</tr>';
    }
    
    html += '</tbody></table></div>';
    
    // Sex comparison table
    html += '<div class="report-section">';
    html += '<h3>⚧️ Comparaison des Sexes</h3>';
    html += '<table class="balance-table" style="width: 100%; border-collapse: collapse; margin-top: 10px;">';
    html += '<thead><tr style="background: rgba(218, 165, 32, 0.3);">';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Sexe</th>';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Parties</th>';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Niveau Moy.</th>';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Taux Victoire</th>';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Kills Moy.</th>';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Morts Moy.</th>';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Or Récolté</th>';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Or Final</th>';
    html += '<th style="padding: 10px; border: 1px solid #8B4513;">Équilibre</th>';
    html += '</tr></thead><tbody>';
    
    for (const [sexKey, stats] of Object.entries(report.sexStats)) {
        const balanceScore = parseFloat(report.balanceScore.bySex[sexKey]);
        const scoreColor = balanceScore >= 90 ? '#51cf66' : balanceScore >= 80 ? '#DAA520' : '#ff6b6b';
        
        html += '<tr>';
        html += `<td style="padding: 8px; border: 1px solid #8B4513;"><strong>${stats.sexName}</strong></td>`;
        html += `<td style="padding: 8px; border: 1px solid #8B4513;">${stats.gamesPlayed.toLocaleString()}</td>`;
        html += `<td style="padding: 8px; border: 1px solid #8B4513;">${stats.avgLevel.toFixed(2)}</td>`;
        html += `<td style="padding: 8px; border: 1px solid #8B4513;">${(stats.avgWinRate * 100).toFixed(1)}%</td>`;
        html += `<td style="padding: 8px; border: 1px solid #8B4513;">${stats.avgKills.toFixed(1)}</td>`;
        html += `<td style="padding: 8px; border: 1px solid #8B4513;">${stats.avgDeaths.toFixed(1)}</td>`;
        html += `<td style="padding: 8px; border: 1px solid #8B4513;">${stats.avgGoldEarned.toFixed(0)} 💰</td>`;
        html += `<td style="padding: 8px; border: 1px solid #8B4513;">${stats.avgFinalGold.toFixed(0)} 💰</td>`;
        html += `<td style="padding: 8px; border: 1px solid #8B4513; color: ${scoreColor}; font-weight: bold;">${balanceScore.toFixed(0)}/100</td>`;
        html += '</tr>';
    }
    
    html += '</tbody></table></div>';
    
    // Detailed class stats
    html += '<div class="report-section">';
    html += '<h3>📈 Statistiques Détaillées des Classes</h3>';
    for (const [classKey, stats] of Object.entries(report.classStats)) {
        html += `<div class="shop-item" style="display: block; margin-bottom: 15px;">`;
        html += `<h4 style="color: #DAA520;">${characterClasses[classKey].icon} ${stats.className}</h4>`;
        html += `<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; font-size: 0.9em;">`;
        html += `<div>Niveau max atteint: ${stats.maxLevel}</div>`;
        html += `<div>Niveau min atteint: ${stats.minLevel}</div>`;
        html += `<div>Kills max: ${stats.maxKills}</div>`;
        html += `<div>Kills min: ${stats.minKills}</div>`;
        html += `<div>Puissance moyenne: ${stats.avgPuissance.toFixed(1)}</div>`;
        html += `<div>Défense moyenne: ${stats.avgDefense.toFixed(1)}</div>`;
        html += `<div>Dextérité moyenne: ${stats.avgDexterity.toFixed(1)}</div>`;
        html += `<div>Constitution moyenne: ${stats.avgConstitution.toFixed(1)}</div>`;
        html += `<div>PV moyens: ${stats.avgHealth.toFixed(0)}</div>`;
        html += `<div>Boss vaincus: ${stats.avgBossesDefeated.toFixed(1)}</div>`;
        html += `<div>Or gagné: ${stats.avgGoldEarned.toFixed(0)} 💰</div>`;
        html += `<div>Or dépensé: ${stats.avgGoldSpent.toFixed(0)} 💰</div>`;
        html += `<div>Objets achetés: ${stats.avgItemsPurchased.toFixed(1)}</div>`;
        html += `<div>% Niveau 20: ${stats.percentReachedLevel20.toFixed(1)}%</div>`;
        html += `<div>Potions soin: ${stats.avgItemsByCategory.heal.toFixed(1)}</div>`;
        html += `<div>Potions force: ${stats.avgItemsByCategory.damage.toFixed(1)}</div>`;
        html += `<div>Équipement: ${stats.avgItemsByCategory.equipment.toFixed(1)}</div>`;
        html += `<div>Potions énergie: ${stats.avgItemsByCategory.energy.toFixed(1)}</div>`;
        html += `<div>Potions XP: ${stats.avgItemsByCategory.exp.toFixed(1)}</div>`;
        html += `</div>`;
        
        // Add milestone progression table
        html += `<div style="margin-top: 15px;">`;
        html += `<h5 style="color: #DAA520; margin-bottom: 10px;">📊 Progression par Paliers</h5>`;
        html += `<table style="width: 100%; border-collapse: collapse; font-size: 0.85em;">`;
        html += `<thead><tr style="background: rgba(218, 165, 32, 0.2);">`;
        html += `<th style="padding: 5px; border: 1px solid #8B4513;">Niveau</th>`;
        html += `<th style="padding: 5px; border: 1px solid #8B4513;">% Atteint</th>`;
        html += `<th style="padding: 5px; border: 1px solid #8B4513;">Kills Moy.</th>`;
        html += `<th style="padding: 5px; border: 1px solid #8B4513;">Morts Moy.</th>`;
        html += `<th style="padding: 5px; border: 1px solid #8B4513;">Or Moy.</th>`;
        html += `</tr></thead><tbody>`;
        
        [5, 10, 15, 20].forEach(level => {
            const milestone = stats.milestones[level];
            if (milestone && milestone.percentReached > 0) {
                const progressColor = milestone.percentReached >= 80 ? '#51cf66' : 
                                     milestone.percentReached >= 50 ? '#DAA520' : '#ff6b6b';
                html += `<tr>`;
                html += `<td style="padding: 5px; border: 1px solid #8B4513;">Niveau ${level}</td>`;
                html += `<td style="padding: 5px; border: 1px solid #8B4513; color: ${progressColor}; font-weight: bold;">${milestone.percentReached.toFixed(1)}%</td>`;
                html += `<td style="padding: 5px; border: 1px solid #8B4513;">${milestone.avgKills.toFixed(1)}</td>`;
                html += `<td style="padding: 5px; border: 1px solid #8B4513;">${milestone.avgDeaths.toFixed(1)}</td>`;
                html += `<td style="padding: 5px; border: 1px solid #8B4513;">${milestone.avgGold.toFixed(0)} 💰</td>`;
                html += `</tr>`;
            } else {
                html += `<tr>`;
                html += `<td style="padding: 5px; border: 1px solid #8B4513;">Niveau ${level}</td>`;
                html += `<td colspan="4" style="padding: 5px; border: 1px solid #8B4513; color: #888; text-align: center;">Non atteint</td>`;
                html += `</tr>`;
            }
        });
        
        html += `</tbody></table></div>`;
        html += `</div>`;
    }
    html += '</div>';
    
    // Detailed race stats
    html += '<div class="report-section">';
    html += '<h3>📈 Statistiques Détaillées des Races</h3>';
    for (const [raceKey, stats] of Object.entries(report.raceStats)) {
        html += `<div class="shop-item" style="display: block; margin-bottom: 15px;">`;
        html += `<h4 style="color: #DAA520;">${characterRaces[raceKey].icon} ${stats.raceName}</h4>`;
        html += `<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; font-size: 0.9em;">`;
        html += `<div>Niveau max atteint: ${stats.maxLevel}</div>`;
        html += `<div>Niveau min atteint: ${stats.minLevel}</div>`;
        html += `<div>Kills max: ${stats.maxKills}</div>`;
        html += `<div>Kills min: ${stats.minKills}</div>`;
        html += `<div>Puissance moyenne: ${stats.avgPuissance.toFixed(1)}</div>`;
        html += `<div>Défense moyenne: ${stats.avgDefense.toFixed(1)}</div>`;
        html += `<div>Dextérité moyenne: ${stats.avgDexterity.toFixed(1)}</div>`;
        html += `<div>Constitution moyenne: ${stats.avgConstitution.toFixed(1)}</div>`;
        html += `<div>PV moyens: ${stats.avgHealth.toFixed(0)}</div>`;
        html += `<div>Boss vaincus: ${stats.avgBossesDefeated.toFixed(1)}</div>`;
        html += `<div>Or gagné: ${stats.avgGoldEarned.toFixed(0)} 💰</div>`;
        html += `<div>Or dépensé: ${stats.avgGoldSpent.toFixed(0)} 💰</div>`;
        html += `<div>Objets achetés: ${stats.avgItemsPurchased.toFixed(1)}</div>`;
        html += `<div>% Niveau 20: ${stats.percentReachedLevel20.toFixed(1)}%</div>`;
        html += `<div>Potions soin: ${stats.avgItemsByCategory.heal.toFixed(1)}</div>`;
        html += `<div>Potions force: ${stats.avgItemsByCategory.damage.toFixed(1)}</div>`;
        html += `<div>Équipement: ${stats.avgItemsByCategory.equipment.toFixed(1)}</div>`;
        html += `<div>Potions énergie: ${stats.avgItemsByCategory.energy.toFixed(1)}</div>`;
        html += `<div>Potions XP: ${stats.avgItemsByCategory.exp.toFixed(1)}</div>`;
        html += `</div>`;
        
        // Add milestone progression table
        html += `<div style="margin-top: 15px;">`;
        html += `<h5 style="color: #DAA520; margin-bottom: 10px;">📊 Progression par Paliers</h5>`;
        html += `<table style="width: 100%; border-collapse: collapse; font-size: 0.85em;">`;
        html += `<thead><tr style="background: rgba(218, 165, 32, 0.2);">`;
        html += `<th style="padding: 5px; border: 1px solid #8B4513;">Niveau</th>`;
        html += `<th style="padding: 5px; border: 1px solid #8B4513;">% Atteint</th>`;
        html += `<th style="padding: 5px; border: 1px solid #8B4513;">Kills Moy.</th>`;
        html += `<th style="padding: 5px; border: 1px solid #8B4513;">Morts Moy.</th>`;
        html += `<th style="padding: 5px; border: 1px solid #8B4513;">Or Moy.</th>`;
        html += `</tr></thead><tbody>`;
        
        [5, 10, 15, 20].forEach(level => {
            const milestone = stats.milestones[level];
            if (milestone && milestone.percentReached > 0) {
                const progressColor = milestone.percentReached >= 80 ? '#51cf66' : 
                                     milestone.percentReached >= 50 ? '#DAA520' : '#ff6b6b';
                html += `<tr>`;
                html += `<td style="padding: 5px; border: 1px solid #8B4513;">Niveau ${level}</td>`;
                html += `<td style="padding: 5px; border: 1px solid #8B4513; color: ${progressColor}; font-weight: bold;">${milestone.percentReached.toFixed(1)}%</td>`;
                html += `<td style="padding: 5px; border: 1px solid #8B4513;">${milestone.avgKills.toFixed(1)}</td>`;
                html += `<td style="padding: 5px; border: 1px solid #8B4513;">${milestone.avgDeaths.toFixed(1)}</td>`;
                html += `<td style="padding: 5px; border: 1px solid #8B4513;">${milestone.avgGold.toFixed(0)} 💰</td>`;
                html += `</tr>`;
            } else {
                html += `<tr>`;
                html += `<td style="padding: 5px; border: 1px solid #8B4513;">Niveau ${level}</td>`;
                html += `<td colspan="4" style="padding: 5px; border: 1px solid #8B4513; color: #888; text-align: center;">Non atteint</td>`;
                html += `</tr>`;
            }
        });
        
        html += `</tbody></table></div>`;
        html += `</div>`;
    }
    html += '</div>';
    
    // Suggestions
    html += '<div class="report-section">';
    html += '<h3>💡 Suggestions d\'Amélioration</h3>';
    
    if (report.suggestions.length === 0) {
        html += '<div class="shop-item" style="display: block;">';
        html += '<p style="color: #51cf66;">✓ Le jeu est bien équilibré ! Aucune amélioration majeure n\'est nécessaire.</p>';
        html += '</div>';
    } else {
        // Group suggestions by category
        const suggestionsByCategory = {
            game: [],
            economy: [],
            class: { guerrier: [], magicien: [], archer: [] },
            race: { humain: [], elfe: [], nain: [] },
            sex: { male: [], female: [] }
        };
        
        report.suggestions.forEach(s => {
            if (s.category === 'game') {
                suggestionsByCategory.game.push(s);
            } else if (s.category === 'economy') {
                suggestionsByCategory.economy.push(s);
            } else if (s.category === 'class') {
                suggestionsByCategory.class[s.class].push(s);
            } else if (s.category === 'race') {
                suggestionsByCategory.race[s.race].push(s);
            } else if (s.category === 'sex') {
                suggestionsByCategory.sex[s.sex].push(s);
            }
        });
        
        // Display game-wide suggestions
        if (suggestionsByCategory.game.length > 0) {
            html += `<div class="shop-item" style="display: block; margin-bottom: 15px;">`;
            html += `<h4 style="color: #DAA520;">🎮 Suggestions Générales</h4>`;
            html += '<ul style="margin: 10px 0; padding-left: 20px;">';
            suggestionsByCategory.game.forEach(s => {
                const color = s.type === 'difficulty' ? '#ffd93d' : s.type === 'progression' ? '#51cf66' : '#ffd93d';
                html += `<li style="margin-bottom: 8px; color: ${color};">${s.suggestion}</li>`;
            });
            html += '</ul></div>';
        }
        
        // Display economy suggestions
        if (suggestionsByCategory.economy.length > 0) {
            html += `<div class="shop-item" style="display: block; margin-bottom: 15px;">`;
            html += `<h4 style="color: #DAA520;">💰 Suggestions Économie</h4>`;
            html += '<ul style="margin: 10px 0; padding-left: 20px;">';
            suggestionsByCategory.economy.forEach(s => {
                html += `<li style="margin-bottom: 8px; color: #ffd93d;">${s.suggestion}</li>`;
            });
            html += '</ul></div>';
        }
        
        // Display class suggestions
        for (const [classKey, suggestions] of Object.entries(suggestionsByCategory.class)) {
            if (suggestions.length === 0) continue;
            
            html += `<div class="shop-item" style="display: block; margin-bottom: 15px;">`;
            html += `<h4 style="color: #DAA520;">${characterClasses[classKey].icon} ${characterClasses[classKey].name}</h4>`;
            html += '<ul style="margin: 10px 0; padding-left: 20px;">';
            
            suggestions.forEach(s => {
                const color = s.type === 'overpowered' ? '#ff6b6b' : s.type === 'underpowered' ? '#ffd93d' : '#51cf66';
                html += `<li style="margin-bottom: 8px; color: ${color};">${s.suggestion}</li>`;
            });
            
            html += '</ul></div>';
        }
        
        // Display race suggestions
        for (const [raceKey, suggestions] of Object.entries(suggestionsByCategory.race)) {
            if (suggestions.length === 0) continue;
            
            html += `<div class="shop-item" style="display: block; margin-bottom: 15px;">`;
            html += `<h4 style="color: #DAA520;">${characterRaces[raceKey].icon} ${characterRaces[raceKey].name}</h4>`;
            html += '<ul style="margin: 10px 0; padding-left: 20px;">';
            
            suggestions.forEach(s => {
                const color = s.type === 'overpowered' ? '#ff6b6b' : s.type === 'underpowered' ? '#ffd93d' : '#51cf66';
                html += `<li style="margin-bottom: 8px; color: ${color};">${s.suggestion}</li>`;
            });
            
            html += '</ul></div>';
        }
        
        // Display sex suggestions
        for (const [sexKey, suggestions] of Object.entries(suggestionsByCategory.sex)) {
            if (suggestions.length === 0) continue;
            
            html += `<div class="shop-item" style="display: block; margin-bottom: 15px;">`;
            html += `<h4 style="color: #DAA520;">${characterSexes[sexKey].icon} ${characterSexes[sexKey].name}</h4>`;
            html += '<ul style="margin: 10px 0; padding-left: 20px;">';
            
            suggestions.forEach(s => {
                const color = s.type === 'overpowered' ? '#ff6b6b' : s.type === 'underpowered' ? '#ffd93d' : '#51cf66';
                html += `<li style="margin-bottom: 8px; color: ${color};">${s.suggestion}</li>`;
            });
            
            html += '</ul></div>';
        }
    }
    
    html += '</div>';
    html += '</div>';
    
    return html;
}
