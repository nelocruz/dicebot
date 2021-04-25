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
            result = getHelpText(); break;
        default: result = rollCustomDice(input.toLowerCase()); break; //'No valid command found.';
    }

    return result;
};

function saveCharData(argsStr, userId) {
    var result = '';
    const args = argsStr.replace(/[^0-9,]/g, '').split(',');
    if (args.length < 7) {
        result = getTerm('INVALID_SYNTAX');
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
        result = getTerm('CHAR_SAVED');
    }
    return result;
}
function readCharData(userId) {
    var result = '';
    const char = chars.find(c => { return c.userId === userId });
    if (char) {
        result = ':crossed_swords:Lvl: `' + char.lvl + '` STR: `' + char.str + '` DEX: `' + char.dex + '` CON: `' + char.con + '` INT: `' + char.int + '` WIS: `' + char.wis + '` CHA: `' + char.cha + '`';
    } else {
        result = getTerm('NO_DATA_SAVED');
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
function dN(die) {
    return Math.floor(Math.random() * die) + 1;
}


function rollCustomDice(args) {
    var result = ':game_die:';
    var aggregated = 0;
    const expression = args.replace(/[^0-9d\+\-]/g, '').replace(/\+/g, '|+').replace(/\-/g, '|-');
    const strRolls = (expression.indexOf('|') === 0 ? expression.substr(1) : expression).split('|');
    var rolls = [];
    for (var x in strRolls) {
        var roll = {};
        roll.signal = strRolls[x].indexOf('-') > -1 ? -1 : 1;
        const parts = strRolls[x].split('d');
        switch (parts.length) {
            case 1:
                const flatVal = parseInt(parts[0]);
                roll.valid = typeof flatVal === 'number';
                roll.die = 0;
                roll.result = flatVal;
                break;
            case 2:
                const qtyDice = parts[0] === '' ? 1 : parseInt(parts[0]);
                const dieType = parseInt(parts[1]);
                roll.valid = typeof qtyDice === 'number' && typeof dieType === 'number' && dieType > 0 && dieType < 100;
                roll.qtyDice = roll.valid ? (qtyDice > 0 ? qtyDice : qtyDice * -1) : 0;
                roll.die = roll.valid ? dieType : 0;
                roll.result = 0;
                break;
            default:
                roll.valid = false;
                break;
        }
        rolls.push(roll);
    }
    if (rolls.length > 0 && rolls.filter(r => !r.valid).length === 0) {
        for (var x in rolls) {
            var dice = [];
            for (var y = 0; y < rolls[x].qtyDice; y++) {
                const rnd = dN(rolls[x].die);
                dice.push(rnd);
                rolls[x].result += rnd;
            }
            if (dice.length) {
                result += rolls[x].signal > 0 ? ' +' : ' -';
                result += rolls[x].qtyDice + 'd' + rolls[x].die;
                result += '**[' + dice.join(',') + ']**';
                aggregated += rolls[x].result * rolls[x].signal;
            } else {
                result += ' ' + (rolls[x].result > 0 ? '**+' : '**') + rolls[x].result + '**';
                aggregated += rolls[x].result;
            }
        }
        result += ' = `' + aggregated + '`';
    } else {
        result = getTerm('NO_COMMAND');
    }
    return result;
}

function getHelpText() {
    return getTerm('HELP');
}

var lang = 'pt-br';
var termsRepo = [];
function getTerm(term) {
    if (!termsRepo || termsRepo.length === 0) {
        try {
            termsRepo = [];
            var data = fs.readFileSync('dnd/' + lang + '.lang', 'utf8');
            var lines = data.split(';\r\n');
            for (var x = 0; x < lines.length; x++) {
                var line = lines[x].replace('\\=', '[equals]');
                var parts = line.split('=');
                if (parts.length > 1) {
                    termsRepo[parts[0]] = parts[1];
                }
            }
        } catch (e) {
            console.log('Error on opening language file ' + lang + ':', e.stack);
            if (lang !== 'en-us') {
                lang = 'en-us';
                return getTerm(term);
            }
        }
    }
    var result = '[placeholder]';
    if (typeof termsRepo[term] !== 'undefined') {
        result = termsRepo[term];
    }
    return result;
}

module.exports.roll = roll;