require('dotenv').config();
const path = require('node:path');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { Connectors } = require('shoukaku');
const { Kazagumo } = require('kazagumo');
const Spotify = require('kazagumo-spotify');
const { getAllJsFiles } = require("./helpers");
const { NODE_NAME, NODE_URL, NODE_PORT, NODE_AUTH, SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;

const Nodes = [{
	name: NODE_NAME,
	url: `${NODE_URL}:${NODE_PORT}`,
	auth: NODE_AUTH,
}];

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.MessageContent] });

const kazagumo = new Kazagumo({
	defaultSearchEngine: "youtube",
	plugins: [
		new Spotify({
			clientId: SPOTIFY_CLIENT_ID,
			clientSecret: SPOTIFY_CLIENT_SECRET,
			playlistPageLimit: 1,
			albumPageLimit: 1,
			searchLimit: 10,
			searchMarket: 'US',
		}),
	],
	send: (guildId, payload) => {
		const guild = client.guilds.cache.get(guildId);
		if (guild) guild.shard.send(payload);
	},
}, new Connectors.DiscordJS(client), Nodes);

const eventsPath = path.join(__dirname, 'events');
const eventFiles = getAllJsFiles(eventsPath);

for (const filePath of eventFiles) {
	const event = require(filePath);
	switch (event.type) {
	case 'kazagumo':
		if (event.inherited) {
			kazagumo.shoukaku.on(event.name, (...args) => event.execute(...args));
		}
		else {
			kazagumo.on(event.name, (...args) => event.execute(...args));
		}
		break;
	case 'client':
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args));
		}
		else {
			client.on(event.name, (...args) => event.execute(kazagumo, ...args));
		}
		break;
	default:
		console.log(`Unknown event type for ${filePath}`);
	}
}

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = getAllJsFiles(commandsPath);

for (const filePath of commandFiles) {
	const command = require(filePath);
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	}
	else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

client.login(process.env.TOKEN).catch((e) => console.error(e));