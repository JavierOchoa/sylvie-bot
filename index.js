require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { Connectors } = require('shoukaku');
const { Kazagumo } = require('kazagumo');
const { NODE_NAME, NODE_URL, NODE_PORT, NODE_AUTH } = process.env;

const Nodes = [{
	name: NODE_NAME,
	url: `${NODE_URL}:${NODE_PORT}`,
	auth: NODE_AUTH,
}];

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.MessageContent] });

const kazagumo = new Kazagumo({
	defaultSearchEngine: "youtube",
	send: (guildId, payload) => {
		const guild = client.guilds.cache.get(guildId);
		if (guild) guild.shard.send(payload);
	},
}, new Connectors.DiscordJS(client), Nodes);

// kazagumo events


kazagumo.shoukaku.on('ready', (name) => console.log(`Lavalink ${name}: Ready!`));
kazagumo.shoukaku.on('error', (name, error) => console.error(`Lavalink ${name}: Error Caught,`, error));
kazagumo.shoukaku.on('close', (name, code, reason) => console.warn(`Lavalink ${name}: Closed, Code ${code}, Reason ${reason || 'No reason'}`));
kazagumo.shoukaku.on('debug', (name, info) => console.debug(`Lavalink ${name}: Debug,`, info));
kazagumo.shoukaku.on('disconnect', (name, players, moved) => {
	if (moved) return;
	players.map(player => player.connection.disconnect());
	console.warn(`Lavalink ${name}: Disconnected`);
});

kazagumo.on("playerStart", (player, track) => {
	client.channels.cache.get(player.textId)?.send({ content: `Now playing **${track.title}** by **${track.author}**` })
		.then(x => player.data.set("message", x));
});

kazagumo.on("playerEnd", (player) => {
	player.data.get("message")?.edit({ content: `Finished playing` });
});

kazagumo.on("playerEmpty", player => {
	client.channels.cache.get(player.textId)?.send({ content: `Destroyed player due to inactivity.` })
		.then(x => player.data.set("message", x));
	player.destroy();
});


const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(kazagumo, ...args));
	}
}


client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	}
	else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

client.login(process.env.TOKEN);