const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
var token = '';
try {
    var data = fs.readFileSync('token.user', 'utf8');
    console.log(data);
    token = data;
} catch (e) {
    console.log('Error on opening token.user:', e.stack);
}

const Dnd = require('./dnd/main');
const Gurps = require('./gurps/main');
const L5R = require('./l5r/main');
const Shadowrun = require('./shadowrun/main');
const Voice = require('./voice');

client.on('ready', () => {
    console.log('Ready!');
});
client.on('message', msg => {
    var parts = msg.content.toLowerCase().split(' ');
    var baseCommand = parts.shift();
    var argsStr = parts.join(' ');
    switch (baseCommand) {
        case '.g':
        case '.gurps':
            try {
                msg.reply(Gurps.roll(argsStr));
            } catch (ex) {
                msg.reply('Erro: ' + ex.message);
            }
            break;
        case '.l':
        case '.l5r':
            try {
                msg.reply(L5R.roll(argsStr));
            } catch (ex) {
                msg.reply('Erro: ' + ex.message);
            }
            break;
        case '.d':
        case '.dnd':
            try {
                msg.reply(Dnd.roll(argsStr, msg.channel.id, msg.author.id, msg.member.displayName));
            } catch (ex) {
                msg.reply('Erro: ' + ex.message);
            }
            break;
        case '.s':
        case '.shadowrun':
            try {
                msg.reply(Shadowrun.roll(argsStr, msg.author.id));
            } catch (ex) {
                msg.reply('Erro: ' + ex.message);
            }
            break;
        case '.p':
        case '.play':
            try {
                Voice.runCommand(msg, argsStr);
            } catch (ex) {
                msg.reply('Erro: ' + ex.message);
            }
            break;
    }
});
client.login(token);