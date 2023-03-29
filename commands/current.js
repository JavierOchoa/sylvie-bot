const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('current')
		.setDescription('Show current song'),
	async execute(interaction, kazagumo) {
		const player = await kazagumo.getPlayer(interaction.guildId);
		const current = player.queue.current;
		await interaction.reply(`Current song is **${current.title}** by **${current.author}**`);
	},
};