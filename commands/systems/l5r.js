const { SlashCommandBuilder } = require('discord.js');
const translations = require('../../translations/l5r.json');
const { rollDice } = require('../../utils/l5r');

const defLang = 'en-US';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('l5r')
    .setDescription('List of Legend of The Five Rings commands!')
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
      .addIntegerOption(option => option
        .setName('keep')
        .setRequired(true)
        .setNameLocalizations(translations.keep.name)
        .setDescription(translations.keep.description[defLang])
        .setDescriptionLocalizations(translations.keep.description)
      )
      .addIntegerOption(option => option
        .setName('bonus')
        .setNameLocalizations(translations.bonus.name)
        .setDescription(translations.bonus.description[defLang])
        .setDescriptionLocalizations(translations.bonus.description)
      )
      .addIntegerOption(option => option
        .setName('explodes')
        .setNameLocalizations(translations.explodes.name)
        .setDescription(translations.explodes.description[defLang])
        .setDescriptionLocalizations(translations.explodes.description)
      )
      .addBooleanOption(option => option
        .setName('emphasis')
        .setNameLocalizations(translations.emphasis.name)
        .setDescription(translations.emphasis.description[defLang])
        .setDescriptionLocalizations(translations.emphasis.description)
      )
    ),
  async execute(interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'roll': {
        const userNick = interaction.member?.nickname || interaction.member?.displayName || interaction.user.displayName;
        const dice = interaction.options.getInteger('dice') || 0;
        const keep = interaction.options.getInteger('keep') || 0;
        const bonus = interaction.options.getInteger('bonus') || 0;
        const explodes = interaction.options.getInteger('explodes') || 0;
        const emphasis = interaction.options.getBoolean('emphasis') || false;
        const lang = interaction.locale;
        await interaction.reply(rollDice(userNick, dice, keep, bonus, explodes, emphasis, lang));
        break;
      }
      case 'test': {
        await interaction.reply('test');
        break;
      }
    }
  },
};