const translations = require('../translations/gurps.json');

function getTargetNumber(nickname, tn, lang = 'en-US') {
    var result = null;
    var t = translations.utils;
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
                outcome = t.criticalSuccess[lang];
                break;
            case 5:
            case 6:
                if (margin >= 10) {
                    outcome = t.criticalSuccess[lang];
                } else if (margin >= 0) {
                    outcome = t.success[lang];
                } else if (margin <= -10) {
                    outcome = t.criticalFail[lang];
                } else if (margin < 0) {
                    outcome = t.fail[lang];
                }
                break;
            case 18:
                outcome = t.criticalFail[lang];
                break;
            case 17:
                if (tn <= 15) {
                    outcome = t.criticalFail[lang];
                } else {
                    outcome = t.fail[lang];
                }
                break;
            default:
                if (margin <= -10) {
                    outcome = t.criticalFail[lang];
                } else if (margin < 0) {
                    outcome = t.fail[lang];
                }
                else {
                    outcome = t.success[lang];
                }
                break;
        }

        var result = `:game_die: [${d1}, ${d2}, ${d3}] = \`${dt}\` ${signal} ${tn}: **${nickname}** \`${outcome}\` ${t.margin[lang].replace('{d}', Math.abs(margin))}`;
    } else {
        result = t.NaN[lang];
    }
    return result;
}

function getDamageTotal(nickname, rolledDice, bonusFixed, bonusMultiplier = 1, lang = 'en-US') {
    var result = null;
    var t = translations.utils;
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
        lines.push(`${bonusMultiplier === 1 ? `**${nickname}**: ` : ''}[${rolls.join(', ')}]${(bonusFixed >= 0 ? '+' : '') + bonusFixed} = \`${lineTotal}\``);
    }
    result = lines.join('\r\n');
    if (lines.length > 1) {
        result += `\r\n**${nickname}** ${t.grandTotal[lang]}: \`${grandTotal}\``;
    }
    return result;
}

function getRangefinder(nickname, range, lang = 'en-US') {
    var result = null;
    var t = translations.utils;
    if (range !== NaN) {
        if (range <= 2) result = t.rangeModifierIs[lang].replace("{target}", range).replace("{modifier}", "0");
        else if (range <= 3) result = t.rangeModifierIs[lang].replace("{target}", range).replace("{modifier}", "-1");
        else if (range <= 5) result = t.rangeModifierIs[lang].replace("{target}", range).replace("{modifier}", "-2");
        else if (range <= 7) result = t.rangeModifierIs[lang].replace("{target}", range).replace("{modifier}", "-3");
        else if (range <= 10) result = t.rangeModifierIs[lang].replace("{target}", range).replace("{modifier}", "-4");
        else if (range <= 15) result = t.rangeModifierIs[lang].replace("{target}", range).replace("{modifier}", "-5");
        else if (range <= 20) result = t.rangeModifierIs[lang].replace("{target}", range).replace("{modifier}", "-6");
        else if (range <= 30) result = t.rangeModifierIs[lang].replace("{target}", range).replace("{modifier}", "-7");
        else if (range <= 50) result = t.rangeModifierIs[lang].replace("{target}", range).replace("{modifier}", "-8");
        else if (range <= 70) result = t.rangeModifierIs[lang].replace("{target}", range).replace("{modifier}", "-9");
        else if (range <= 100) result = t.rangeModifierIs[lang].replace("{target}", range).replace("{modifier}", "-10");
        else if (range <= 150) result = t.rangeModifierIs[lang].replace("{target}", range).replace("{modifier}", "-11");
        else if (range <= 200) result = t.rangeModifierIs[lang].replace("{target}", range).replace("{modifier}", "-12");
        else if (range <= 300) result = t.rangeModifierIs[lang].replace("{target}", range).replace("{modifier}", "-13");
        else if (range <= 500) result = t.rangeModifierIs[lang].replace("{target}", range).replace("{modifier}", "-14");
        else if (range <= 700) result = t.rangeModifierIs[lang].replace("{target}", range).replace("{modifier}", "-15");
        else if (range <= 1000) result = t.rangeModifierIs[lang].replace("{target}", range).replace("{modifier}", "-16");
        else if (range <= 1500) result = t.rangeModifierIs[lang].replace("{target}", range).replace("{modifier}", "-17");
        else if (range <= 2000) result = t.rangeModifierIs[lang].replace("{target}", range).replace("{modifier}", "-18");
        else if (range <= 3000) result = t.rangeModifierIs[lang].replace("{target}", range).replace("{modifier}", "-19");
        else if (range <= 5000) result = t.rangeModifierIs[lang].replace("{target}", range).replace("{modifier}", "-20");
        else if (range <= 7000) result = t.rangeModifierIs[lang].replace("{target}", range).replace("{modifier}", "-21");
        else if (range <= 10000) result = t.rangeModifierIs[lang].replace("{target}", range).replace("{modifier}", "-22");
        else if (range <= 15000) result = t.rangeModifierIs[lang].replace("{target}", range).replace("{modifier}", "-23");
        else if (range <= 20000) result = t.rangeModifierIs[lang].replace("{target}", range).replace("{modifier}", "-24");
        else if (range <= 30000) result = t.rangeModifierIs[lang].replace("{target}", range).replace("{modifier}", "-25");
        else if (range <= 50000) result = t.rangeModifierIs[lang].replace("{target}", range).replace("{modifier}", "-26");
        else if (range <= 70000) result = t.rangeModifierIs[lang].replace("{target}", range).replace("{modifier}", "-27");
        else if (range <= 100000) result = t.rangeModifierIs[lang].replace("{target}", range).replace("{modifier}", "-28");
        else if (range <= 150000) result = t.rangeModifierIs[lang].replace("{target}", range).replace("{modifier}", "-29");
        else if (range <= 200000) result = t.rangeModifierIs[lang].replace("{target}", range).replace("{modifier}", "-30");
        else result = t.rangeTooLarge[lang];
    }
    return result;
}

function getCriticalHitNormal(nickname, lang = 'en-US') {
    var result = null;
    var t = translations.utils;
    var d1 = Math.floor(Math.random() * 6) + 1;
    var d2 = Math.floor(Math.random() * 6) + 1;
    var d3 = Math.floor(Math.random() * 6) + 1;
    var dt = d1 + d2 + d3;
    var outcome = '';
    switch (dt) {
        case 3:
        case 18:
            outcome = t.CritNormal3[lang];
            break;
        case 4:
        case 17:
            outcome = t.CritNormal4[lang];
            break;
        case 5:
        case 16:
            outcome = t.CritNormal5[lang];
            break;
        case 6:
        case 15:
            outcome = t.CritNormal6[lang];
            break;
        case 7:
        case 13:
        case 14:
            outcome = t.CritNormal7[lang];
            break;
        case 8:
            outcome = t.CritNormal8[lang];
            break;
        case 9:
        case 10:
        case 11:
            outcome = t.CritNormal9[lang];
            break;
        case 12:
            outcome = t.CritNormal12[lang];
            break;
    }

    var result = '`[{d1}, {d2}, {d3}]` = `{dt}`: **{result}**'
        .replace('{d1}', d1)
        .replace('{d2}', d2)
        .replace('{d3}', d3)
        .replace('{dt}', dt)
        .replace('{result}', outcome);
    return result;
}

module.exports = {
    getTargetNumber: getTargetNumber,
    getDamageTotal: getDamageTotal,
    getRangefinder: getRangefinder,
    getCriticalHitNormal: getCriticalHitNormal,
};