const BaseEvent = require('../../strutures/BaseEvent');

class ReadyEvent extends BaseEvent {
    constructor() {
        super('ready');
        this.once = true;
    }
    async execute(bot, client) {
        console.log('--------------------------------');
        console.log(`Bot ${client.user.tag} está online!`);
        console.log(`Prefixo: ${bot.prefix}`);
        console.log(`Servidores: ${bot.guilds.cache.size}`);
        console.log('--------------------------------');
    }
}

module.exports = ReadyEvent;