// commands/moderacao/warn.js

const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'warn',
    description: 'Avisa um membro com um embed personalizado.',
    execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.KickMembers)) {
            return message.reply('Você não tem permissão para usar este comando!');
        }

        const targetUser = message.mentions.users.first();
        if (!targetUser) {
            return message.reply('Você precisa mencionar um usuário para avisar!');
        }

        const reason = args.slice(1).join(' ');
        if (!reason) {
            return message.reply('Você precisa fornecer um motivo para o aviso!');
        }

        const warnEmbed = new EmbedBuilder()
            .setColor('#FFD700') // Cor amarela para aviso
            .setTitle(`Aviso para ${targetUser.username}`) // Título do embed
            .setAuthor({
                name: `Aviso por: ${message.author.username}`,
                iconURL: message.author.displayAvatarURL({ dynamic: true })
            })
            .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: 'Usuário Avisado', value: `${targetUser.tag} (${targetUser.id})` },
                { name: 'Motivo do Aviso', value: reason },
                { name: '⚠️ Consequência', value: 'A reincidência desta infração resultará em uma punição mais severa (expulsão/banimento).' }
            )
            .setTimestamp()
            .setFooter({ text: `ID do Usuário: ${targetUser.id}` });

        message.channel.send({ embeds: [warnEmbed] });
    },
};