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
     * @param client
     */
    async execute(message, client) {
        if (message.author.bot || !message.guild) {
            return;
        }

        // Etapa 1 do Pipeline: Chama o processador do AutoMod
        const autoModResult = await autoModProcessor.handle(message, bot);
        // Se o AutoMod agiu (ex: deletou a mensagem), o pipeline para aqui.
        if (autoModResult.actionTaken) {
            return;
        }

        const prefix = 'm!'
        const args = message.content.slice(prefix.length).trim().split(/ +/)
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName)
             || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))

        if (!message.content.startsWith(prefix)) {
            return;
        }
        if (!command) {
            return message.reply({ content: 'Esse comando não existe!', ephemeral: true });
        }

        try {
            await execute(client, message, args);
        } catch (error) {
            console.error(`❌ Erro ao executar o comando '${command.name}':`, error);
            await message.reply('😥 Desculpe, ocorreu um erro ao tentar executar este comando.').catch(console.error);
        }
    }
};