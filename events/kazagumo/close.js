module.exports = {
	name: 'close',
	type: 'kazagumo',
	inherited: true,
	execute(name, code, reason) {
		console.warn(`Lavalink ${name}: Closed, Code ${code}, Reason ${reason || 'No reason'}`);
	},
};