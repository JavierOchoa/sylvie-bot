const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Skip current song'),
	async execute(interaction, kazagumo) {
		const player = await kazagumo.getPlayer(interaction.guildId);
		if (!player) return await interaction.reply('No active player');
		player.skip();
		await interaction.reply('Song skipped');
	},
};