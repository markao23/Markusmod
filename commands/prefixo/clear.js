const { PermissionFlagsBits } = require('discord.js');
const BaseCommand = require('../../strutures/BaseCommand');

class ClearCommand extends BaseCommand {
    constructor() {
        super('clear', {
            aliases: ['limpar', 'purge'],
            description: 'Limpa uma quantidade de mensagens no canal.',
            usage: 'clear <quantidade>'
        });
    }

    async execute(bot, message, args) {
        // 1. VERIFICAÇÃO DE PERMISSÕES DO BOT
        if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return message.reply('Eu não tenho a permissão de `Gerenciar Mensagens` para fazer isso!');
        }

        // 2. VERIFICAÇÃO DE PERMISSÕES DO USUÁRIO
        if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return message.reply('Você não tem a permissão de `Gerenciar Mensagens` para usar este comando.');
        }

        // 3. VERIFICAÇÃO DOS ARGUMENTOS
        const amountToDelete = parseInt(args[0]);
        if (isNaN(amountToDelete)) {
            return message.reply(`Uso incorreto. Você precisa me dizer quantas mensagens quer limpar. Ex: \`${this.usage}\``);
        }
        if (amountToDelete < 1 || amountToDelete > 100) {
            return message.reply('A quantidade de mensagens para limpar deve ser entre 1 e 100.');
        }

        // 4. EXECUÇÃO E TRATAMENTO DE ERRO
        try {
            // Deleta a mensagem do comando e a quantidade especificada
            await message.channel.bulkDelete(amountToDelete + 1, true); // O 'true' filtra mensagens com mais de 14 dias

            const sentMessage = await message.channel.send(`✅ Foram limpas ${amountToDelete} mensagens por ${message.author}.`);

            // Deleta a mensagem de confirmação após 5 segundos
            setTimeout(() => sentMessage.delete().catch(console.error), 5000);

        } catch (error) {
            console.error("Erro no comando clear:", error);
            await message.reply('Não foi possível limpar as mensagens. Elas podem ser mais antigas que 14 dias.');
        }
    }
}

module.exports = ClearCommand;