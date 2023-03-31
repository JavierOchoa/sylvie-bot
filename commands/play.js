const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play music')
		.addStringOption(option =>
			option
				.setName('params')
				.setDescription('Song to play')),
	async execute(interaction, kazagumo) {
		const media = interaction.options.getString('params');
		const voiceChannelId = await interaction.member.voice.channelId;
		let player = await kazagumo.getPlayer(interaction.guildId);

		if (player && player.paused) {
			player.pause(false);
			return await interaction.reply('Playback resumed');
		}
		if (!player && media) {
			player = await kazagumo.createPlayer({
				guildId: interaction.guildId,
				textId: interaction.channelId,
				voiceId: voiceChannelId,
				volume: 100,
			});
		}

		if (!media) return await interaction.reply('No parameters given');
		const result = await kazagumo.search(media, { requester: `${interaction.user.username}#${interaction.user.discriminator}` });
		if (!result.tracks.length) return await interaction.reply("No results found!");

		if (result.type === "PLAYLIST") {
			for (const track of result.tracks) player.queue.add(track);
		}
		else {
			player.queue.add(result.tracks[0]);
		}

		if (!player.playing && !player.paused) player.play().catch(err => console.error(err));

		await interaction.reply({ content: result.type === "PLAYLIST" ? `Queued ${result.tracks.length} from ${result.playlistName}` : `Queued ${result.tracks[0].title}` });

	},
};