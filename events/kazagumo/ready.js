module.exports = {
	name: 'ready',
	type: 'kazagumo',
	inherited: true,
	execute(name) {
		console.log(`Lavalink ${name}: Ready!`);
	},
};