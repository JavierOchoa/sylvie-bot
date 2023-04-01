module.exports = {
	name: 'debug',
	type: 'kazagumo',
	inherited: true,
	execute(name, info) {
		console.debug(`Lavalink ${name}: Debug,`, info);
	},
};