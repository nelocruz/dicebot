const fs = require('fs');

var chars = [];

function roll(input, userId) {
    const parts = input.toLowerCase().split(' ');
    const command = parts.shift();
    const argsStr = parts.join(' ');

    switch (command) {
        case 's':
        case 'save':
            result = saveCharData(argsStr, userId); break;
        case 'v':
        case 'view':
            result = readCharData(userId); break;
        case 'str':
        case 'dex':
        case 'con':
        case 'int':
        case 'wis':
        case 'cha':
            result = rollAttribute(command, argsStr, userId); break;
        case 'h':
        case 'help':
            result = getHelpText();
        default: result = 'No valid command found.';
    }

    return result;
};

function saveCharData(argsStr, userId) {
    var result = '';
    const args = argsStr.replace(/[^0-9,]/g, '').split(',');
    if (args.length < 7) {
        result = 'invalid syntax. Expected [lvl], [str], [dex], [con], [int], [wis], [cha]';
    } else {
        const char = chars.find(c => { return c.userId === userId });
        if (char) {
            char.lvl = parseInt(args[0]);
            char.str = parseInt(args[1]);
            char.dex = parseInt(args[2]);
            char.con = parseInt(args[3]);
            char.int = parseInt(args[4]);
            char.wis = parseInt(args[5]);
            char.cha = parseInt(args[6]);
        } else {
            chars.push({
                userId: userId,
                lvl: parseInt(args[0]),
                str: parseInt(args[1]),
                dex: parseInt(args[2]),
                con: parseInt(args[3]),
                int: parseInt(args[4]),
                wis: parseInt(args[5]),
                cha: parseInt(args[6])
            });
        }
        result = 'saved';
    }
    return result;
}
function readCharData(userId) {
    var result = '';
    const char = chars.find(c => { return c.userId === userId });
    if (char) {
        result = ':crossed_swords:Lvl: `' + char.lvl + '` STR: `' + char.str + '` DEX: `' + char.dex + '` CON: `' + char.con + '` INT: `' + char.int + '` WIS: `' + char.wis + '` CHA: `' + char.cha + '`';
    } else {
        result = 'No data saved.';
    }
    return result;
}

function rollAttribute(command, argsStr, userId) {
    var result = '';
    const char = chars.find(c => { return c.userId === userId });
    if (char) {
        var attr = 0;
        switch (command) {
            case 'str': attr = char.str; break;
            case 'dex': attr = char.dex; break;
            case 'con': attr = char.con; break;
            case 'int': attr = char.int; break;
            case 'wis': attr = char.wis; break;
            case 'cha': attr = char.cha; break;
        }
        const attrMod = Math.floor((attr - 10) / 2);
        const prof = Math.floor((char.lvl - 1) / 4) + 2;

        const hasProf = argsStr.indexOf('p') > -1;
        const hasAdv = argsStr.indexOf('a') > -1;
        const hasDis = !hasAdv && argsStr.indexOf('d') > -1;
        const hasExp = argsStr.indexOf('e') > -1;
        const hasJat = argsStr.indexOf('j') > -1;

        const rolls = [
            d20(),
            d20()
        ];
        const sorted = rolls.slice().sort(function (a, b) { return a - b });

        const value = (hasAdv ? sorted[1] : hasDis ? sorted[0] : rolls[0]) + (hasExp ? prof * 2 : hasProf ? prof : hasJat ? Math.ceil(prof / 2) : 0) + (attrMod);
        result = ':game_die:';
        result += (hasAdv ? 'd20(adv) **[' + rolls[0] + ', ' + rolls[1] + ']**' : hasDis ? 'd20(dis) **[' + rolls[0] + ', ' + rolls[1] + ']**' : 'd20 **[' + rolls[0] + ']**');
        result += ' **+' + (hasExp ? (prof * 2) + '**(exp.)' : hasProf ? prof + '**(prof.)' : hasJat ? Math.ceil(prof / 2) + '**(jack.)' : 0 + '**');
        result += (attrMod >= 0 ? ' **+' + attrMod : ' **-' + (attrMod * -1)) + '**(mod.) = `' + value + '`';
    }
    return result;
}
function d20() {
    return Math.floor(Math.random() * 20) + 1;
}

function getHelpText() {
    return '.help.';
}

module.exports.roll = roll;