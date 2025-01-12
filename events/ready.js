const { Events } = require('discord.js');
const { tbCharSheets } = require('../databases/dnd');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		tbCharSheets.sync();
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};