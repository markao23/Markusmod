const { Client, GatewayIntentBits, Collection } = require('discord.js');
const path = require('path');
const { readdirSync } = require('fs');

class Bot extends Client {
    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ]
        });
        this.commands = new Collection();
        this.aliases = new Collection();
        this.slashCommands = new Collection();
        this.prefix = process.env.PREFIX || 'm!'
    }
    _loadHandlers(){
        const handlersPath = path.join(__dirname, '..', 'handlers');
        const handlerFiles = readdirSync(handlersPath).filter(file => file.endsWith('.js'));

        console.log('Carregando Handlers...');
        for (const file of handlerFiles) {
            try {
                const handler = require(path.join(handlersPath, file));
                handler(this); // Passa a instância do bot para o handler
                console.log(`[HANDLER] Handler ${file} carregado.`);
            } catch (error) {
                console.error(`Erro ao carregar o handler ${file}:`, error);
            }
        }
    }
    start() {
        this._loadHandlers()
        this.login(process.env.DISCORD_TOKEN)
    }
}
module.exports = Bot;