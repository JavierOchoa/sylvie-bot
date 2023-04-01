module.exports = {
	name: 'playerEmpty',
	type: 'kazagumo',
	execute(player) {
		player.data.get("message")?.edit({ content: `Left the voice channel due to inactivity.` });
		player.destroy();
	},
};