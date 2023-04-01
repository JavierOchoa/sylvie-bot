module.exports = {
	name: 'error',
	type: 'kazagumo',
	inherited: true,
	execute(name, error) {
		console.error(`Lavalink ${name}: Error Caught,`, error);
	},
};