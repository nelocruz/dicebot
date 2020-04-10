function roll(input) {
    var result = "";
    //control properties
    var helpRequested = getHelpInfo(input);
    var rollInfo = getRollInfo(input);
    var explodeValue = getExplodeValue(input);
    var hasEmphasis = getEmphasisInfo(input);

    // internal properties
    var rolledDice = 0;
    var keptDice = 0;
    var fixedBonus = 0;
    var rolls = [];
    var totalRolled = 0;

    //commands
    if (helpRequested) {
        result = getHelpText();
    } else if (!rollInfo) {
        result = "Rolamento inválido.";
    } else {
        var parts = rollInfo.split('k');
        var rolledDice = parseInt(parts[0]);
        var keptDice = parseInt(parts[1]);
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
            var fixedInfo = input.toLowerCase().match(/(\+|\-)[\d]*/g);
            var fixedStr = '';
            if (fixedInfo && fixedInfo.length > 0) {
                fixedStr = fixedInfo[0];
                var fixedValue = parseInt(fixedStr.substr(1));
                if (fixedValue !== NaN) {
                    fixedBonus += fixedValue * (fixedStr[0] === '+' ? 1 : -1);
                }
            }
            totalRolled += fixedBonus;
            result = print(rolls, pickedRolls, fixedBonus, totalRolled);
        }
    }
    return result;
};

function getHelpInfo(input) {
    var result = false;
    var helpInfo = input.toLowerCase().match(/help/g);
    if (helpInfo && helpInfo.length > 0) {
        result = true;
    }
    return result;
}

function getRollInfo(input) {
    var result = '';
    var rollInfo = input.toLowerCase().match(/[\d]+k[\d]+/g);
    if (rollInfo && rollInfo.length > 0) {
        result = rollInfo[0];
    }
    return result;
}

function getExplodeValue(input) {
    var result = 10;
    var explodeInfo = input.toLowerCase().match(/x[\d]+/g);
    if (explodeInfo && explodeInfo.length > 0) {
        var value = parseInt(explodeInfo[0].substr(1));
        if (value > 0 && value < 10) {
            result = value;
        }
    }
    return result;
}

function getEmphasisInfo(input) {
    var result = false;
    var emphasisInfo = input.toLowerCase().match(/e/g);
    if (emphasisInfo && emphasisInfo.length > 0) {
        result = true;
    }
    return result;
}

function rollDie(explode) {
    if (typeof explode === 'undefined') {
        explode = 10;
    }
    var result = 0;
    var rollValue = 0;
    do {
        rollValue = Math.floor(Math.random() * 10) + 1;
        result += rollValue;
        explode = 10;
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

function getHelpText() {
    return "command-line: `.l[5r]` **00**`k`**00**[`+`**00**][**`x`0**][`e`]"
        + "\r\n\t`k`: [rolled dice] **k**eep [kept dice]"
        + "\r\n\t`+`: fixed bonuses (**+** or **-**)"
        + "\r\n\t`x`: e**x**plode on [minimum value]"
        + "\r\n\t`e`: roll with **e**mphasis";
}

module.exports.roll = roll;