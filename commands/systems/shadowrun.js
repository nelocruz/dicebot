const { SlashCommandBuilder } = require('discord.js');
const translations = require('../../translations/shadowrun.json');
const { rollDice } = require('../../utils/shadowrun');

const defLang = 'en-US';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shadowrun')
        .setDescription('List of Shadowrun commands!')
        .addSubcommand(subcommand => subcommand
            .setName('roll')
            .setNameLocalizations(translations.roll.name)
            .setDescription(translations.roll.description[defLang])
            .setDescriptionLocalizations(translations.roll.description)
            .addIntegerOption(option => option
                .setRequired(true)
                .setName('dice')
                .setNameLocalizations(translations.dice.name)
                .setDescription(translations.dice.description[defLang])
                .setDescriptionLocalizations(translations.dice.description)
            )
            .addBooleanOption(option => option
                .setName('edge')
                .setNameLocalizations(translations.edge.name)
                .setDescription(translations.edge.description[defLang])
                .setDescriptionLocalizations(translations.edge.description)
            )
        ),
    async execute(interaction) {
        switch(interaction.options.getSubcommand()) {
            case 'roll': { 
                const userNick = interaction.member?.nickname || interaction.member?.displayName || interaction.user.displayName;
                const dice = interaction.options.getInteger('dice') || 0;
                const edge = interaction.options.getBoolean('edge') || false;
                const lang = interaction.locale;
                await interaction.reply(rollDice(userNick, dice, edge, lang));
                break; 
            }
            case 'test': {
                await interaction.reply('test');
                break;
            }
        }
    },
};