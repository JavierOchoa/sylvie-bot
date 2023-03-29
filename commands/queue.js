const {
	SlashCommandBuilder, codeBlock, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType,
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('Show queue'),
	async execute(interaction, kazagumo) {
		const player = await kazagumo.getPlayer(interaction.guildId);
		let queueMessage = '';
		let startQueueLimit = 0;
		let currentQueueLimit = 10;
		const queue = player.queue;

		const slicedQueue = queue.slice(startQueueLimit, currentQueueLimit);
		slicedQueue.forEach((song, index) => queueMessage += `${index + 1}. ${song.title} by ${song.author}\n`);

		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('nextPage')
					.setLabel('Next')
					.setStyle(ButtonStyle.Primary),
			);

		let message = null;
		message = await interaction.reply({
			content: codeBlock(queueMessage),
			components: [row],
			fetchReply: true,
		});

		const filter = async i => {
			await i.deferUpdate();
			return i.user.id === interaction.user.id;
		};

		let interactionMessage = null;
		interactionMessage = await message.awaitMessageComponent({
			filter,
			componentType: ComponentType.Button,
			time: 60000,
		});
		if (interactionMessage.customId === 'nextPage') {
			startQueueLimit = currentQueueLimit;
			currentQueueLimit += 10;
			queueMessage = '';
			const newSlicedQueue = queue.slice(startQueueLimit, currentQueueLimit);
			newSlicedQueue.forEach((song, index) => queueMessage += `${index + 1}. ${song.title} by ${song.author}\n`);
			await interactionMessage.editReply({
				content: codeBlock(queueMessage),
				components: [],
			});
		}
	},
};