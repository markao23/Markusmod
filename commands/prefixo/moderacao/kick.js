// Importa as classes de permissões e de construção de Embeds
const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'kick',
    description: 'Expulsa um usuário do servidor.',
    aliases: ['expulsar'],

    async execute(message, args) {
        // --- Verificações Iniciais ---
        if (!message.guild) {
            return message.reply('Este comando só pode ser usado dentro de um servidor!');
        }

        // Garante que o autor do comando tem permissão para expulsar
        if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return message.reply('Você não tem permissão para expulsar membros!');
        }

        // --- Identificação do Alvo ---
        const targetMember = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => null);

        if (!targetMember) {
            return message.reply('Você precisa mencionar um usuário ou fornecer o ID dele para expulsar. \nExemplo: `!kick @usuario`');
        }

        // --- Verificações de Segurança e Hierarquia ---
        if (targetMember.id === message.author.id) {
            return message.reply('Você não pode se expulsar!');
        }

        if (targetMember.id === message.client.user.id) {
            return message.reply('Eu não posso me expulsar!');
        }

        // Garante que o bot tem permissão para expulsar
        if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return message.reply('Eu não tenho permissão para expulsar membros neste servidor!');
        }

        // Garante que o autor e o bot têm um cargo mais alto que o do alvo
        if (message.member.roles.highest.position <= targetMember.roles.highest.position) {
            return message.reply('Você não pode expulsar este usuário porque ele tem um cargo igual ou superior ao seu.');
        }

        if (message.guild.members.me.roles.highest.position <= targetMember.roles.highest.position) {
            return message.reply('Não posso expulsar este usuário porque ele tem um cargo igual ou superior ao meu.');
        }

        // --- Execução da Expulsão ---
        const reason = args.slice(1).join(' ') || 'Nenhum motivo fornecido.';

        try {
            // Tenta avisar o usuário por DM antes de expulsá-lo
            await targetMember.send(`Você foi expulso do servidor **${message.guild.name}**. \nMotivo: ${reason}`);
        } catch (dmError) {
            console.log(`Não foi possível enviar a DM de expulsão para ${targetMember.user.tag}.`);
        }

        try {
            // Expulsa o membro do servidor
            await targetMember.kick(reason);

            // Cria o Embed de confirmação
            const kickEmbed = new EmbedBuilder()
                .setColor('#FFA500') // Laranja
                .setTitle('👢 Usuário Expulso')
                .addFields(
                    { name: 'Usuário', value: `${targetMember.user.tag} (${targetMember.id})` },
                    { name: 'Expulso por', value: `${message.author.tag}` },
                    { name: 'Motivo', value: reason }
                )
                .setTimestamp();

            // Envia a confirmação no canal
            await message.channel.send({ embeds: [kickEmbed] });

        } catch (error) {
            console.error("Erro ao tentar expulsar o usuário:", error);
            await message.reply('Ocorreu um erro inesperado ao tentar expulsar este usuário.');
        }
    },
};