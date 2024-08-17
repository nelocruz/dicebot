const fs = require('fs');
const { isNumber } = require('util');

var chars = [];

function roll(input, userId) {
    const parts = input.toLowerCase().split(' ');
    const command = parts.shift();
    const argsStr = parts.join(' ');

    switch (command) {
        case 'r':
        case 'roll':
            result = rollDice(argsStr); break;
        case 'h':
        case 'help':
            result = getHelpText();
        default: result = 'No valid command found.';
    }

    return result;
};

function rollDice(input) {
    var result = '';
    const diceQtd = parseInt(input.replace(/[^0-9]/g, ''));
    const ruleOfSix = input.indexOf('e') > -1;
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
            for (var x = 0; x < sixes; x++) {
                const roll = d6();
                if (roll === 6) sixes++;
                extraRolls[x] = roll;
                switch (roll) {
                    case 1: botches++; break;
                    case 5: successes++; break;
                    case 6: successes++; break;
                }
            }
        }

        result = ':game_die:';
        result += '[' + printRolls(rolls) + ']';
        if (ruleOfSix && sixes > 0) {
            result += '+ [' + printRolls(extraRolls) + ']';
        }
        result += ' = `' + successes + ' hits`';
        if (botches > diceQtd / 2) {
            if (successes == 0) {
                result+=' `CRITICAL GLITCH!`';
            } else {
                result = ' + `GLITCH`';
            }
        }
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

function getHelpText() {

};

module.exports.roll = roll;