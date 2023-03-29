const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('volume')
		.setDescription('Set volume to desired level')
		.addStringOption(option =>
			option
				.setName('level')
				.setDescription('Desired volume level')
				.setRequired(true)),
	async execute(interaction, kazagumo) {
		const volumeLevel = interaction.options.getString('level');
		if (isNaN(volumeLevel) || volumeLevel < 0 || volumeLevel > 100) return await interaction.reply('Please provide a valid volume level [0-100]');
		const player = await kazagumo.getPlayer(interaction.guildId);
		player.setVolume(volumeLevel);
		await interaction.reply(`Volume changed to ${volumeLevel}`);
	},
};