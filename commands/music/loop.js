const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('loop')
		.setDescription('Loop song or queue | Defaults to track')
		.addStringOption(option =>
			option
				.setName('param')
				.setDescription('q - queue | t - track')),
	async execute(interaction, kazagumo) {
		const loopOption = interaction.options.getString('param');

		const player = await kazagumo.getPlayer(interaction.guildId);
		if (!player) return await interaction.reply('No active player');

		if (player.loop === 'track' || player.loop === 'queue') {
			await player.setLoop('none');
			return await interaction.reply('Loop disabled');
		}
		if (loopOption === 'q' || loopOption === 'queue') {
			await player.setLoop('queue');
			return await interaction.reply(`Queue on loop`);
		}
		if (loopOption === 't' || loopOption === 'track' || !loopOption) {
			await player.setLoop('track');
			return await interaction.reply('Song on loop');
		}
		if (loopOption !== 'q' || loopOption !== 'queue' || loopOption !== 't' || loopOption !== 'track') {
			return await interaction.reply('Invalid parameter. Valid options: q, queue, t, track');
		}
	},
};