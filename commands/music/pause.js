const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Pause music'),
	async execute(interaction, kazagumo) {
		const player = await kazagumo.getPlayer(interaction.guildId);
		if (!player) return await interaction.reply('No active player');
		player.pause(!player.paused);
		await interaction.reply('Player paused');
	},
};