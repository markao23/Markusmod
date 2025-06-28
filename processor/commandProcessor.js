// processors/commandProcessor.js

/**
 * Processa a mensagem para verificar se é um comando de prefixo e o executa.
 * Esta é a "sala" do seu bot responsável por Atendimento ao Cliente.
 * @param {import('discord.js').Message} message A mensagem recebida.
 * @param {import('../core/Bot')} bot A instância principal do bot.
 * @returns {Promise<{wasCommand: boolean}>} Retorna um objeto indicando se a mensagem foi tratada como um comando.
 */
async function handle(message, bot) {
    // ETAPA 1: O "Guarda de Entrada". A mensagem não começa com o prefixo?
    // Se não, o trabalho deste processador acabou. Ele não faz nada e avisa que não era um comando.
    if (!message.content.startsWith(bot.prefix)) {
        return { wasCommand: false };
    }

    // ETAPA 2: "Desmontando" a mensagem em comando e argumentos.
    const args = message.content.slice(bot.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // ETAPA 3: Procurando o comando na "memória" do bot (Collections).
    const command = bot.commands.get(commandName) || bot.commands.get(bot.aliases.get(commandName));

    // Se, após a busca, nenhum comando com esse nome for encontrado, não fazemos nada.
    // A mensagem tinha o prefixo, mas não era um comando válido.
    if (!command) {
        return { wasCommand: false };
    }

    // ETAPA 4: Execução Segura. Se o comando for encontrado, nós o executamos.
    // O bloco try...catch é a nossa rede de segurança para qualquer erro que aconteça DENTRO do comando.
    try {
        console.log(`[Comando] Executando: ${command.name} para ${message.author.tag}`);
        await command.execute(bot, message, args);
    } catch (error) {
        console.error(`❌ Erro ao executar o comando '${command.name}':`, error);
        await message.reply('😥 Desculpe, ocorreu um erro ao tentar executar este comando.').catch(console.error);
    }

    // ETAPA 5: Sinalizando Sucesso.
    // Se chegamos até aqui, a mensagem FOI um comando e foi tratada.
    // Avisamos ao pipeline que o processo deve parar aqui.
    return { wasCommand: true };
}

// Exportamos a função 'handle' para que o messageCreate.js possa usá-la.
module.exports = { handle };