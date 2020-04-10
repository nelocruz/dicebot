const fs = require('fs');

function roll(input) {
    var result = "";
    //control properties
    var isHelp = parseHelp(input);
    var targetNumber = parseTargetNumber(input);
    var rollCommand = parseDiceRoll(input);

    if (parseLang(input)) {
        if (changeLang(input)) {
            result = getTerm('LANG_CHANGED');
        } else {
            result = 'No language file found for the argument.';
        }
    } else if (isHelp) {
        result = getHelpText();
    } else if (targetNumber) {
        result = getTargetNumber(targetNumber);
    } else if (rollCommand) {
        result = getDiceRoll(rollCommand);
    } else {
        result = getTerm('NO_COMMAND');
    }
    return result;
};

function parseDiceRoll(input) {
    var result = null;
    var matches = [];
    matches = matches.concat(input.trim().toLowerCase().match(/^[\d]+d(\+|\-)?[\d]*\*?[\d]*$/g));
    matches = matches.concat(input.trim().toLowerCase().match(/^[\d]+(\+|\-)?[\d]*\*?[\d]*$/g));
    matches = matches.filter(function (val) { return val !== null });
    if (matches.length > 0) {
        result = matches[0];
    }
    return result;
}
function getDiceRoll(input) {
    var result = null;
    var parsedDice = input.match(/^[\d]+/g);
    var rolledDice = parseInt(parsedDice != null && parsedDice.length > 0 ? parsedDice[0] : 0);
    var parsedFixed = input.match(/(\+|\-)[\d]+/g);
    var bonusFixed = parseInt(parsedFixed != null && parsedFixed.length > 0 ? parsedFixed[0] : 0);
    var parsedMultiplier = input.match(/\*[\d]+/g);
    var bonusMultiplier = parseInt(parsedMultiplier != null && parsedMultiplier.length > 0 ? parsedMultiplier[0].replace('*', '') : 1);
    var lines = [];
    var grandTotal = 0;
    for (var x = 0; x < (bonusMultiplier < 1 ? 1 : bonusMultiplier); x++) {
        var rolls = [];
        var lineTotal = 0;
        for (var y = 0; y < rolledDice; y++) {
            rolls.push(Math.floor(Math.random() * 6) + 1);
            lineTotal += rolls[y];
        }
        lineTotal += bonusFixed;
        grandTotal += lineTotal;
        lines.push('[' + rolls.join(', ') + ']' + (bonusFixed >= 0 ? '+' : '') + bonusFixed + ' = `' + lineTotal + '`');
    }
    result = lines.join('\r\n');
    if (lines.length > 1) {
        result += '\r\n' + getTerm('GRAND_TOTAL') + ': `' + grandTotal + '`';
    }
    return result;
}

function parseTargetNumber(input) {
    var result = null;
    var matches = [];
    matches = matches.concat(input.trim().toLowerCase().match(/^(\+|\-)?[\d]{1,2}$/g));
    matches = matches.concat(input.trim().toLowerCase().match(/^tn(\+|\-)?[\d]{1,2}$/g));
    matches = matches.concat(input.trim().toLowerCase().match(/^targetnumber(\+|\-)?[\d]{1,2}$/g));
    matches = matches.filter(function (val) { return val !== null });
    if (matches.length > 0) {
        result = matches[0];
    }
    return result;
}
function getTargetNumber(input) {
    var result = null;
    var tn = parseInt(input.replace(/[^(\+|\-)?0-9]/gi, ''));
    if (tn !== NaN) {
        var d1 = Math.floor(Math.random() * 6) + 1;
        var d2 = Math.floor(Math.random() * 6) + 1;
        var d3 = Math.floor(Math.random() * 6) + 1;
        var dt = d1 + d2 + d3;
        var signal = dt > tn ? '>' : dt === tn ? '=' : '<';
        var margin = tn - dt;
        var outcome = '';
        switch (dt) {
            case 3:
            case 4:
                outcome = getTerm('CRITICAL_SUCCESS');
                break;
            case 5:
            case 6:
                if (margin >= 10) {
                    outcome = getTerm('CRITICAL_SUCCESS');
                } else if (margin >= 0) {
                    outcome = getTerm('NORMAL_SUCCESS');
                } else if (margin <= -10) {
                    outcome = getTerm('CRITICAL_ERROR');
                } else if (margin < 0) {
                    outcome = getTerm('NORMAL_ERROR');
                }
                break;
            case 18:
                outcome = getTerm('CRITICAL_ERROR');
                break;
            case 17:
                if (tn <= 15) {
                    outcome = getTerm('CRITICAL_ERROR');
                } else {
                    outcome = getTerm('NORMAL_ERROR');
                }
                break;
            default:
                if (margin <= -10) {
                    outcome = getTerm('CRITICAL_ERROR');
                } else if (margin < 0) {
                    outcome = getTerm('NORMAL_ERROR');
                }
                else {
                    outcome = getTerm('NORMAL_SUCCESS');
                }
                break;
        }

        var result = '`[{d1}, {d2}, {d3}]` = `{dt} {sig} {nt}`: **{result}** {margin}'
            .replace('{d1}', d1)
            .replace('{d2}', d2)
            .replace('{d3}', d3)
            .replace('{dt}', dt)
            .replace('{nt}', tn)
            .replace('{sig}', signal)
            .replace('{result}', outcome)
            .replace('{margin}', getTerm('WITH_MARGIN').replace('{d}', Math.abs(margin)));
    } else {
        result = getTerm('NOT_A_NUMBER');
    }
    return result;
}

function parseHelp(input) {
    var result = false;
    var helpInfo = input.trim().toLowerCase().match(/^help$/g);
    if (helpInfo && helpInfo.length > 0) {
        result = true;
    }
    return result;
}
function getHelpText() {
    return getTerm('HELP');
}

function parseLang(input) {
    var langInfo = input.trim().toLowerCase().match(/^lang [a-z]{2,3}(\-[a-z0-9]{2,4})?$/g);
    return (langInfo && langInfo.length > 0);
}
function changeLang(input) {
    var tempLang = input.trim().toLowerCase().match(/[a-z]{2,3}(\-[a-z0-9]{2,4})?$/g);
    if (fs.existsSync('gurps/' + lang + '.lang')) {
        lang = tempLang;
        return true;
    } else {
        lang = 'en-us';
        return false;
    }
}

var lang = 'pt-br';
var termsRepo = [];
function getTerm(term) {
    if (!termsRepo || termsRepo.length === 0) {
        try {
            termsRepo = [];
            var data = fs.readFileSync('gurps/' + lang + '.lang', 'utf8');
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
// const CRITICAL_SUCCESS = "SUCESSO CRÍTICO :star_struck:";
// const NORMAL_SUCCESS = "sucesso :grin:";
// const NORMAL_ERROR = "falha :tired_face:";
// const CRITICAL_ERROR = "FALHA CRÍTICA :hot_face:";
// const WITH_MARGIN = "";
// const HELP = "command-line: `.g[urps] 00`\r\nOR: `.g[urps] tn00`\r\nOR: `.g[urps] targetNumber00`\r\n\t`00`: target number of the roll\r\n\r\ncommand-line: `.g[urps] 00d[+00][\\*00]`\r\nOR: `.g[urps] 00[+00][\\*00]`\r\n\t`00d`: number of dices to roll\r\n\t`+00`: fixed bonus added to roll\r\n\t`\\*00d`: number of times the roll is made";

module.exports.roll = roll;