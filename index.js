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

const Gurps = require('./gurps');
const L5R = require('./l5r');

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
    }
});
client.login(token);