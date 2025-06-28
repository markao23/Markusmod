const BaseCommand = require('../../strutures/BaseCommand');

class PingCommand extends BaseCommand {
    constructor() {
        super('ping', {
            category: 'Utilidades',
            aliases: ['latencia', 'ms'],
            description: 'Mostra a latência do bot e da API do Discord.'
        });
    }

    async execute(message, args, client) {
        // Envia uma mensagem inicial para calcular a latência de ida e volta
        const msg = await message.reply('Calculando...');
        const websocketLatency = client.ws.ping;
        // Edita a mensagem com os resultados
        const apiLatency = msg.createdTimestamp - message.createdTimestamp;
        await msg.edit({
            content: `🏓 **Pong!**\n` +
                     `> Latência da API: \`${apiLatency}ms\`\n` +
                     `> Latência do WebSocket: \`${websocketLatency}ms\``
        });

    }
}

module.exports = PingCommand;