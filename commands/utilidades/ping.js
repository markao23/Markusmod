// commands/utilidade/ping.js

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Responde com a latência do bot!'),

    async execute(interaction) {
        // =======================================================
        // ==== CORREÇÃO APLICADA AQUI ====
        // =======================================================

        // 1. Respondemos à interação. A opção 'fetchReply' foi removida.
        await interaction.reply('Pingando...');

        // 2. Usamos o novo método 'interaction.fetchReply()' para buscar a mensagem que acabamos de enviar.
        const sent = await interaction.fetchReply();

        // =======================================================

        // O resto do código continua igual, pois agora 'sent' contém a mensagem de resposta.
        const botLatency = sent.createdTimestamp - interaction.createdTimestamp;
        const apiLatency = Math.round(interaction.client.ws.ping);

        await interaction.editReply(`🏓 Pong!\nLatência do Bot: **${botLatency}ms**\nLatência da API: **${apiLatency}ms**`);
    },
};