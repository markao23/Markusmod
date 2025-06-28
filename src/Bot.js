const { Client, GatewayIntentBits, Collection, Partials} = require('discord.js');
const path = require('path');
const { readdirSync } = require('fs');
const commandLoader = require('../loaders/commandLoader.js');
const eventLoader = require('../loaders/eventLoader.js');

class Bot extends Client {
    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers,
            ],
            partials: [Partials.Message, Partials.Channel, Partials.User]
        });
        this.commands = new Collection();
        this.aliases = new Collection();
        this.prefix = process.env.PREFIX || 'm!'
    }
    _loadHandlers(){
        console.log('Carregando Handlers...');
        commandLoader(this);
        eventLoader(this);
    }
    start() {
        this._loadHandlers()
        this.login(process.env.DISCORD_TOKEN)
    }
}
module.exports = Bot;