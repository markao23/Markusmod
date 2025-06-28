const BaseCommand = require('../../strutures/BaseCommand');

class PingCommand extends BaseCommand {
    constructor() {
        super('ping', {
            category: 'Utilidades',
            aliases: ['latencia', 'ms'],
            description: 'Mostra a latência do bot e da API do Discord.'
        });
    }

    async execute(bot, message, args) {
        // Envia uma mensagem inicial para calcular a latência de ida e volta
        const msg = await message.reply('Calculando...');

        // Edita a mensagem com os resultados
        const botLatency = msg.createdTimestamp - message.createdTimestamp;
        const apiLatency = Math.round(bot.ws.ping);

        await msg.edit(`🏓 **Pong!**\nLatência da Mensagem: \`${botLatency}ms\`\nLatência da API: \`${apiLatency}ms\``);
    }
}

module.exports = PingCommand;