module.exports = {
	name: 'disconnect',
	type: 'kazagumo',
	inherited: true,
	execute(name, players, moved) {
		if (moved) return;
		players.map(player => player.connection.disconnect());
		console.warn(`Lavalink ${name}: Disconnected`);
	},
};