// Em /commands/prefixo/clear.js

const { PermissionsBitField } = require('discord.js');
const Command = require('../../strutures/Command'); // Ajuste o caminho se necessário

module.exports = class ClearCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'clear',
            description: 'Apaga uma quantidade de mensagens no canal.',
            usage: 'clear <quantidade>',
            category: 'Moderação',
            aliases: ['limpar', 'purge'],
        });
    }

    /**
     * @param {import('discord.js').Message} message
     * @param {string[]} args
     */
    async execute(message, args) {
        
        // --- VERIFICAÇÃO DE PERMISSÃO DO USUÁRIO ---
        // Aqui usamos 'message.member' para pegar as permissões de quem digitou o comando.
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return message.reply({ content: '❌ Você não tem a permissão de "Gerenciar Mensagens" para usar este comando.' });
        }

        // --- VERIFICAÇÃO DE PERMISSÃO DO BOT ---
        // O bot também precisa de permissão para apagar mensagens.
        // Usamos 'message.guild.members.me' para pegar as permissões do próprio bot no servidor.
        if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return message.reply({ content: '❌ Eu não tenho a permissão de "Gerenciar Mensagens" para executar este comando.' });
        }

        // --- VALIDAÇÃO DOS ARGUMENTOS ---
        const amountToDelete = parseInt(args[0]);

        if (isNaN(amountToDelete)) {
            return message.reply({ content: `❓ Por favor, forneça um número de mensagens para apagar. Uso correto: \`${this.client.prefix}${this.usage}\`` });
        }

        if (amountToDelete < 1 || amountToDelete > 100) {
            return message.reply({ content: '❌ Você só pode apagar de 1 a 100 mensagens por vez.' });
        }

        // --- EXECUÇÃO E TRATAMENTO DE ERROS ---
        try {
            // Deleta a mensagem do comando do usuário primeiro.
            await message.delete();

            // Apaga a quantidade de mensagens especificada.
            const fetchedMessages = await message.channel.messages.fetch({ limit: amountToDelete });
            const deletedMessages = await message.channel.bulkDelete(fetchedMessages, true); // O 'true' filtra mensagens com mais de 14 dias.

            const replyMsg = await message.channel.send({ content: `✅ Foram apagadas **${deletedMessages.size}** mensagens com sucesso!` });
            
            // Apaga a mensagem de confirmação depois de 5 segundos.
            setTimeout(() => replyMsg.delete().catch(err => console.log('Não foi possível deletar a mensagem de confirmação do clear.')), 5000);

        } catch (error) {
            console.error('Erro no comando clear:', error);
            // Se o erro for por tentar apagar mensagens muito antigas
            if (error.code === 50034) {
                 const errorMsg = await message.channel.send({ content: '⚠️ Não posso apagar mensagens com mais de 14 dias de idade.' });
                 setTimeout(() => errorMsg.delete().catch(err => {}), 5000);
            } else {
                 const errorMsg = await message.channel.send({ content: 'Houve um erro inesperado ao tentar apagar as mensagens.' });
                 setTimeout(() => errorMsg.delete().catch(err => {}), 5000);
            }
        }
    }
};