// Em /events/messageCreate.js

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        // Ignora mensagens de outros bots ou mensagens diretas (DMs)
        if (message.author.bot || !message.guild) {
            return;
        }

        // --- Lógica de AutoMod ou outras verificações viriam aqui ---

        // Define o prefixo do seu bot
        const prefix = 'm!';

        // ---- LÓGICA DE DETECÇÃO DE COMANDO (A Prova de Erros) ----

        // Se a mensagem não contiver o prefixo, ignore completamente.
        if (!message.content.includes(prefix)) {
            return;
        }

        // Encontra a parte da mensagem que realmente importa (começando do prefixo)
        const contentStartIndex = message.content.indexOf(prefix);
        const contentFromPrefix = message.content.slice(contentStartIndex);

        // Separa o comando dos argumentos
        const args = contentFromPrefix.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift()?.toLowerCase(); // Usa '?' para evitar erro se não houver comando

        // Se não houver nome de comando (ex: usuário digitou só "m!"), ignore.
        if (!commandName) {
            return;
        }

        // ---- LÓGICA DE BUSCA E EXECUÇÃO ----

        // Procura o comando na coleção (memória) do bot
        const command = client.commands.get(commandName)
            || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        // Se a busca falhar, envia a mensagem de erro.
        // É AQUI QUE SEU ERRO ATUAL ESTÁ ACONTECENDO!
        if (!command) {
            return message.reply({ content: 'Esse comando não existe!', ephemeral: true });
        }

        // Tenta executar o comando e captura qualquer erro para o bot não travar
        try {
            await command.execute(message, args, client);
        } catch (error) {
            console.error(`❌ Erro ao executar o comando '${commandName}':`, error);
            await message.reply({ content: 'Houve um erro interno ao tentar executar esse comando.', ephemeral: true });
        }
    }
};