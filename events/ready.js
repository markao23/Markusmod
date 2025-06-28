// events/ready.js
module.exports = {
    name: 'ready',
    once: true, // Indica que este evento só deve ser executado uma vez

    /**
     * A função que será executada quando o evento 'ready' acontecer.
     * @param {import('../core/Bot')} bot A instância do nosso bot.
     */
    async execute(bot) {
        console.log(`Bot ${bot.user.tag} está online!`);
        console.log(`Prefixo: ${bot.prefix}`);
        console.log(`Servidores: ${bot.guilds.cache.size}`);
        console.log('------------------------------------');
    }
};