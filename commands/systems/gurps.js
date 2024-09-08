const { SlashCommandBuilder } = require('discord.js');
const translations = require('../../translations/gurps.json');
const { getTargetNumber, getDamageTotal, getRangefinder, getCriticalHitNormal } = require('../../utils/gurps');

const defLang = 'en-US';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gurps')
    .setDescription('List of GURPS commands!')
    .addSubcommand(subcommand => subcommand
      .setName('roll')
      .setNameLocalizations(translations.roll.name)
      .setDescription(translations.roll.description[defLang])
      .setDescriptionLocalizations(translations.roll.description)
      .addIntegerOption(option => option
        .setRequired(true)
        .setName('target')
        .setNameLocalizations(translations.target.name)
        .setDescription(translations.target.description[defLang])
        .setDescriptionLocalizations(translations.target.description)
      )
    )
    .addSubcommand(subcommand => subcommand
      .setName('damage')
      .setNameLocalizations(translations.damage.name)
      .setDescription(translations.damage.description[defLang])
      .setDescriptionLocalizations(translations.damage.description)
      .addIntegerOption(option => option
        .setRequired(true)
        .setName('dice')
        .setNameLocalizations(translations.dice.name)
        .setDescription(translations.dice.description[defLang])
        .setDescriptionLocalizations(translations.dice.description)
        .setMinValue(1)
      )
      .addIntegerOption(option => option
        .setName('bonus')
        .setNameLocalizations(translations.bonus.name)
        .setDescription(translations.bonus.description[defLang])
        .setDescriptionLocalizations(translations.bonus.description)
      )
      .addIntegerOption(option => option
        .setName('multiplier')
        .setNameLocalizations(translations.multiplier.name)
        .setDescription(translations.multiplier.description[defLang])
        .setDescriptionLocalizations(translations.multiplier.description)
        .setMinValue(1)
      )
    )
    .addSubcommand(subcommand => subcommand
      .setName('rangefinder')
      .setNameLocalizations(translations.rangefinder.name)
      .setDescription(translations.rangefinder.description[defLang])
      .setDescriptionLocalizations(translations.rangefinder.description)
      .addIntegerOption(option => option
        .setRequired(true)
        .setName('range')
        .setNameLocalizations(translations.range.name)
        .setDescription(translations.range.description[defLang])
        .setDescriptionLocalizations(translations.range.description)
      )
    )
    .addSubcommand(subcommand => subcommand
      .setName('criticaltable')
      .setNameLocalizations(translations.criticaltable.name)
      .setDescription(translations.criticaltable.description[defLang])
      .setDescriptionLocalizations(translations.criticaltable.description)
    ),
  async execute(interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'roll': {
        const userNick = interaction.member?.nickname || interaction.member?.displayName || interaction.user.displayName;
        const target = interaction.options.getInteger('target') || 0;
        const lang = interaction.locale;
        await interaction.reply(getTargetNumber(userNick, target, lang));
        break;
      }
      case 'damage': {
        const userNick = interaction.member?.nickname || interaction.member?.displayName || interaction.user.displayName;
        const dice = interaction.options.getInteger('dice') || 0;
        const bonus = interaction.options.getInteger('bonus') || 0;
        const multiplier = interaction.options.getInteger('multiplier') || 1;
        const lang = interaction.locale;
        await interaction.reply(getDamageTotal(userNick, dice, bonus, multiplier, lang));
        break;
      }
      case 'rangefinder': {
        const userNick = interaction.member?.nickname || interaction.member?.displayName || interaction.user.displayName;
        const range = interaction.options.getInteger('range') || 0;
        const lang = interaction.locale;
        await interaction.reply(getRangefinder(userNick, range, lang));
        break;
      }
      case 'criticaltable': {
        const userNick = interaction.member?.nickname || interaction.member?.displayName || interaction.user.displayName;
        const lang = interaction.locale;
        await interaction.reply(getCriticalHitNormal(userNick, lang));
        break;
      }
    }
  },
};