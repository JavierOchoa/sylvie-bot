const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	type: 'client',
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};