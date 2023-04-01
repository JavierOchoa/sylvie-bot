const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('current')
		.setDescription('Show current song'),
	async execute(interaction, kazagumo) {
		const player = await kazagumo.getPlayer(interaction.guildId);
		if (!player) return await interaction.reply('No active player');
		const current = player.queue.current;
		await interaction.reply(`Current song is **${current.title}** by **${current.author}**`);
	},
};