const translations = require('../translations/l5r.json');

function rollDice(userNick, rolledDice, keptDice, fixedValue = 0, explodesAt = 10, hasEmphasis = false, lang = 'en-US') {
    var result = '';
    var t = translations.utils;

    var explodeValue = getExplodeValue(explodesAt);
    var fixedBonus = 0;
    var rolls = [];
    var totalRolled = 0;

    if (rolledDice < 1 || keptDice < 1) {
        result = "Rolamento inválido.";
    } else {
        while (rolledDice > 10) {
            keptDice += (rolledDice >= 12 ? 1 : 0);
            rolledDice -= 2;
            rolledDice = rolledDice > 9 ? rolledDice : 10;
        }
        while (keptDice > 10) {
            fixedBonus += 5;
            keptDice--;
        }
        for (var x = 0; x < rolledDice; x++) {
            rolls[x] = parseInt(rollDie(explodeValue));
            if (hasEmphasis && rolls[x] === 1) {
                rolls[x] = parseInt(rollDie(explodeValue));
            }
        }
        var sortedRolls = rolls.slice(0, rolls.length);
        sortedRolls.sort(sortNumber);
        var pickedRolls = [];
        for (var x = 0; x < keptDice; x++) {
            var value = sortedRolls.pop();
            totalRolled += value;
            pickedRolls.push(value);
        }
        fixedBonus += fixedValue;
        totalRolled += fixedBonus;
        result = print(rolls, pickedRolls, fixedBonus, totalRolled);
    }
    return `${userNick}: ${result}`;
};

function getExplodeValue(value) {
    var result = 10;
    if (value > 0 && value < 10) {
        result = value;
    }
    return result;
}

function rollDie(explode) {
    if (typeof explode === 'undefined') {
        explode = 10;
    }
    var firstRun = true;
    var result = 0;
    var rollValue = 0;
    do {
        rollValue = Math.floor(Math.random() * 10) + 1;
        result += rollValue;
        if (!firstRun) {
            explode = 10;
        }
        firstRun = false;
    } while (rollValue >= explode);
    return result;
}

function sortNumber(a, b) {
    return a - b;
}

function print(rolls, pickedRolls, fixedBonus, totalRolled) {
    var result = '[';
    var arrRolls = [];
    for (var x in rolls) {
        var index = pickedRolls.indexOf(rolls[x]);
        if (index > -1) {
            arrRolls.push('**' + rolls[x] + '**');
            pickedRolls.splice(index, 1);
        } else {
            arrRolls.push('' + rolls[x]);
        }
    }
    result += arrRolls.join(', ');
    result += ']**' + (fixedBonus >= 0 ? '+' : '') + fixedBonus + '** = `' + totalRolled + '`';
    return result;
}

module.exports = {
    rollDice: rollDice,
}