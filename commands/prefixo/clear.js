// Importa o que for necessário da discord.js, como a classe de permissões
const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'clear',
    description: 'Apaga uma quantidade específica de mensagens recentes de um canal.',
    aliases: ['purge', 'limpar'],

    async execute(message, args) {

        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return message.reply('Você não tem permissão para usar este comando!');
        }

        if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return message.reply('Eu não tenho permissão para apagar mensagens neste canal!');
        }

        const amount = parseInt(args[0]);

        if (isNaN(amount)) {
            return message.reply('Isso não parece ser um número válido. Por favor, forneça um número de mensagens para apagar. \nExemplo: `!clear 5`');
        }

        if (amount < 1 || amount > 100) {
            return message.reply('Você só pode apagar de 1 a 100 mensagens por vez.');
        }

        try {
            await message.delete();
            const fetchedMessages = await message.channel.bulkDelete(amount, true);
            const successMessage = await message.channel.send(`✅ **${fetchedMessages.size}** mensagens foram apagadas com sucesso!`);
            setTimeout(() => {
                successMessage.delete().catch(err => console.log("Não foi possível apagar a mensagem de sucesso do clear:", err));
            }, 5000); // 5000 ms = 5 segundos
        } catch (error) {
            console.error('Ocorreu um erro ao tentar apagar as mensagens:', error);
            if (error.code === 50034) { // Código de erro específico para mensagens com mais de 14 dias
                message.channel.send('Não posso apagar mensagens com mais de 14 dias.').then(msg => setTimeout(() => msg.delete().catch(console.error), 5000));
            } else {
                message.channel.send('Ocorreu um erro ao tentar apagar as mensagens neste canal.').then(msg => setTimeout(() => msg.delete().catch(console.error), 5000));
            }
        }
    },
};