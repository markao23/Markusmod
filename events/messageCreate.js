// events/messageCreate.js
const autoModProcessor = require('../processor/autoModProcessor');
const commandProcessor = require('../processor/commandProcessor');

// Variável para guardar a instância do AutoMod depois de criada.
// Isso garante que ele seja criado apenas uma vez (padrão Singleton).
let autoModInstance = null;

module.exports = {
    name: 'messageCreate',

    /**
     * @param {import('discord.js').Message} message
     * @param {import('../core/Bot')} bot
     */
    async execute(message, bot) {
        if (message.author.bot || !message.guild) {
            return;
        }

        // Etapa 1 do Pipeline: Chama o processador do AutoMod
        const autoModResult = await autoModProcessor.handle(message, bot);
        // Se o AutoMod agiu (ex: deletou a mensagem), o pipeline para aqui.
        if (autoModResult.actionTaken) {
            return;
        }

        // Etapa 2 do Pipeline: Chama o processador de Comandos
        const commandResult = await commandProcessor.handle(message, bot);
        // Se a mensagem foi um comando, o pipeline para aqui.
        if (commandResult.wasCommand) {
            return;
        }
        try {
            await execute(bot, message, args);
        } catch (error) {
            console.error(`❌ Erro ao executar o comando '${command.name}':`, error);
            await message.reply('😥 Desculpe, ocorreu um erro ao tentar executar este comando.').catch(console.error);
        }
    }
};