const translations = require('../translations/l5r.json');

function rollDice(userNick, diceQtd, ruleOfSix, lang = 'en-US') {
    var result = '';
    var t = translations.utils;
    if (typeof diceQtd === 'number') {
        var rolls = [];
        var extraRolls = [];
        var successes = 0;
        var botches = 0;
        var sixes = 0;
        for (var x = 0; x < diceQtd; x++) {
            const roll = d6();
            rolls[x] = roll;
            switch (roll) {
                case 1: botches++; break;
                case 5: successes++; break;
                case 6: successes++; sixes++; break;
            }
        }
        if (ruleOfSix) {
            for (var y = 0; y < sixes; y++) {
                const roll = d6();
                if (roll === 6) sixes++;
                extraRolls[y] = roll;
                switch (roll) {
                    case 1: botches++; break;
                    case 5: successes++; break;
                    case 6: successes++; break;
                }
            }
        }

        var suffixIcon = `:game_die:`;
        var rollsArray = `[${printRolls(rolls)}]`;
        var sixesArray = '';
        if (ruleOfSix && sixes > 0) {
            sixesArray += ` + [${printRolls(extraRolls)}]`;
        }
        var hits = `= **${userNick}** \`${successes} ${t.hits[lang]}\``;
        var extras = '';
        if (botches > diceQtd / 2) {
            if (successes == 0) {
                extras += ` \`${t.criticalGlitch[lang]}\``;
            } else {
                extras += ` + \`${t.glitch[lang]}\``;
            }
        }
        result = `${suffixIcon} ${rollsArray}${sixesArray} ${hits}${extras}`;
    } else {
        result = 'No value.';
    }
    return result;
};

function d6() {
    return Math.floor(Math.random() * 6) + 1;
}

function printRolls(rolls) {
    var result = [];
    for (var x = 0; x < rolls.length; x++) {
        var partial = '';
        switch (rolls[x]) {
            case 1:
            case 5:
            case 6:
                partial = '**' + rolls[x] + '**';
                break;
            default:
                partial = '' + rolls[x];
        }
        result[x] = partial;
    }
    return result.join(', ');
};

module.exports = {
    rollDice: rollDice,
}