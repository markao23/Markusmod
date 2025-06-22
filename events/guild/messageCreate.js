const BaseEvent = require('../../strutures/BaseEvent');

class MessageCreateEvent extends BaseEvent {
    constructor() {
        super('messageCreate');
    }

    async execute(bot, message) {
        if (message.author.bot) return; // Ignora mensagens de outros bots
        if (!message.content.startsWith(bot.prefix)) return; // Ignora mensagens sem o prefixo

        // Separa o comando dos argumentos
        const args = message.content.slice(bot.prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        // Procura o comando pelo nome ou por um de seus aliases
        const command = bot.commands.get(commandName) || bot.commands.get(bot.aliases.get(commandName));

        if (!command) return;

        try {
            // Executa o comando
            await command.execute(bot, message, args);
        } catch (error) {
            console.error(`Erro ao executar o comando ${command.name}:`, error);
            message.reply('Ocorreu um erro ao tentar executar esse comando!');
        }
    }
}

module.exports = MessageCreateEvent;