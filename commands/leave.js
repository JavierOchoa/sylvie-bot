const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leave')
		.setDescription('Disconnect player from channel'),
	async execute(interaction, kazagumo) {
		const player = await kazagumo.getPlayer(interaction.guildId);
		if (!player) return await interaction.reply('No active player');
		player.destroy();
		await interaction.reply(`Player disconnected`);
	},
};