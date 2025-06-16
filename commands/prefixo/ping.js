module.exports = {
    name: "ping",
    description: "um comando simples de ping",
    aliases: ['p'],
    async execute(message, args) {
        message.reply('Pong! 🏓');
    }
}