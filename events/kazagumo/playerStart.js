module.exports = {
	name: 'playerStart',
	type: 'kazagumo',
	execute(player, track) {
		player.data.get("message")?.edit({ content: `Now playing **${track.title}** by **${track.author}**` });
	},
};