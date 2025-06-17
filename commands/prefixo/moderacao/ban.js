// Importamos as classes de permissões e de construção de Embeds para mensagens mais bonitas
const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ban',
    description: 'Bane um usuário do servidor.',
    aliases: ['banir'],

    async execute(message, args) {
        if (!message.guild) {
            return message.reply('Este comando só pode ser usado dentro de um servidor!');
        }

        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return message.reply('Você não tem permissão para banir membros!');
        }

        const targetIdentifier = args[0];
        if (!targetIdentifier) {
            return message.reply('Você precisa mencionar um usuário ou fornecer o ID dele para banir. \nExemplo: `!ban @usuario` ou `!ban 123456789012345678`');
        }

        let targetMember;
        try {
            const mentionedMember = message.mentions.members.first();
            if (mentionedMember) {
                targetMember = mentionedMember;
            } else {
                targetMember = await message.guild.members.fetch(targetIdentifier);
            }
        } catch (error) {
            return message.reply(`Não consegui encontrar o usuário com o identificador "${targetIdentifier}". Verifique se o ID está correto ou se o usuário está neste servidor.`);
        }

        if (!targetMember) {
            return message.reply('Usuário não encontrado!');
        }

        if (targetMember.id === message.author.id) {
            return message.reply('Você não pode se banir!');
        }

        if (targetMember.id === message.client.user.id) {
            return message.reply('Eu não posso me banir!');
        }

        // 1. PRIMEIRO, checamos se o AUTOR do comando tem um cargo superior ao do alvo.
        if (message.member.roles.highest.position <= targetMember.roles.highest.position) {
            return message.reply('Você não pode banir este usuário porque ele tem um cargo igual ou superior ao seu.');
        }

        // 2. DEPOIS, checamos se o BOT tem permissão e um cargo superior ao do alvo.
        if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return message.reply('Eu não tenho permissão para banir membros neste servidor!');
        }

        if (message.guild.members.me.roles.highest.position <= targetMember.roles.highest.position) {
            return message.reply('Não posso banir este usuário porque ele tem um cargo igual ou superior ao meu.');
        }

        const reason = args.slice(1).join(' ') || 'Nenhum motivo fornecido.';
        try {
            await targetMember.send(`Você foi banido do servidor **${message.guild.name}**. \nMotivo: ${reason}`);
        } catch (dmError) {
            console.log(`Não foi possível enviar a DM para ${targetMember.user.tag}. O usuário provavelmente tem DMs desativadas.`);
        }

        try {
            await targetMember.ban({ reason: reason });

            const banEmbed = new EmbedBuilder()
                .setColor('#FF0000') // Vermelho
                .setTitle('🚫 Usuário Banido')
                .addFields(
                    { name: 'Usuário', value: `${targetMember.user.tag} (${targetMember.id})`, inline: true },
                    { name: 'Banido por', value: `${message.author.tag}`, inline: true },
                    { name: 'Motivo', value: reason }
                )
                .setTimestamp()
                .setFooter({ text: `ID do Usuário: ${targetMember.id}` });

            await message.channel.send({ embeds: [banEmbed] });
        } catch (error) {
            console.error("Erro ao tentar banir o usuário:", error);
            await message.reply('Ocorreu um erro inesperado ao tentar banir este usuário.');
        }
    },
};