const fs = require('node:fs');
const path = require('node:path');

const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

// const Dnd = require('./dnd/main');
// const Gurps = require('./gurps/main');
// const L5R = require('./l5r/main');
// const Shadowrun = require('./shadowrun/main');
const Voice = require('./voice');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();
client.cooldowns = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// client.on('message', msg => {
//     var parts = msg.content.toLowerCase().split(' ');
//     var baseCommand = parts.shift();
//     var argsStr = parts.join(' ');
//     switch (baseCommand) {
//         case '.g':
//         case '.gurps':
//             try {
//                 msg.reply(Gurps.roll(argsStr));
//             } catch (ex) {
//                 msg.reply('Erro: ' + ex.message);
//             }
//             break;
//         case '.l':
//         case '.l5r':
//             try {
//                 msg.reply(L5R.roll(argsStr));
//             } catch (ex) {
//                 msg.reply('Erro: ' + ex.message);
//             }
//             break;
//         case '.d':
//         case '.dnd':
//             try {
//                 msg.reply(Dnd.roll(argsStr, msg.channel.id, msg.author.id, msg.member.displayName));
//             } catch (ex) {
//                 msg.reply('Erro: ' + ex.message);
//             }
//             break;
//         case '.s':
//         case '.shadowrun':
//             try {
//                 msg.reply(Shadowrun.roll(argsStr, msg.author.id));
//             } catch (ex) {
//                 msg.reply('Erro: ' + ex.message);
//             }
//             break;
//         case '.p':
//         case '.play':
//             try {
//                 Voice.runCommand(msg, argsStr);
//             } catch (ex) {
//                 msg.reply('Erro: ' + ex.message);
//             }
//             break;
//     }
// });
client.login(token);
