const { SlashCommandBuilder } = require('discord.js');
const translations = require('../../translations/dnd.json');
const { rollD20 } = require('../../utils/dnd');

const defLang = 'en-US';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dnd')
        .setDescription('List of Dungeon and Dragons commands!')
        .addSubcommand(subcommand => subcommand
            .setName('roll')
            .setNameLocalizations(translations.roll.name)
            .setDescription(translations.roll.description[defLang])
            .setDescriptionLocalizations(translations.roll.description)
            .addIntegerOption(option => option
                .setName('bonus')
                .setNameLocalizations(translations.bonus.name)
                .setDescription(translations.bonus.description[defLang])
                .setDescriptionLocalizations(translations.bonus.description)
            )
            .addStringOption(option => option
                .setName('options')
                .setNameLocalizations(translations.options.name)
                .setDescription(translations.options.description[defLang])
                .setDescriptionLocalizations(translations.options.description)
                .addChoices(
                    { name: 'advantage', value: 'adv' },
                    { name: 'disadvantage', value: 'dis' }
                )
            )
        ),
    async execute(interaction) {
        switch (interaction.options.getSubcommand()) {
            case 'roll': {
                const userNick = interaction.member?.nickname || interaction.member?.displayName || interaction.user.displayName;
                const bonus = interaction.options.getInteger('bonus') || 0;
                const options = interaction.options.getString('options') || '';
                await interaction.reply(rollD20(userNick, bonus, options));
                break;
            }
        }
    },
};