const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping') // <<< O nome do comando de barra
        .setDescription('Verifica a latência do bot.'), // <<< A descrição que aparece no Discord
    async execute(interaction) {
        const sent = await interaction.reply({ content: 'Pinging...', ephemeral: true, fetchReply: true }); // ephemeral: true para não poluir o chat durante o "pinging"
        const botPing = Math.round(interaction.client.ws.ping);
        const roundtripLatency = sent.createdTimestamp - interaction.createdTimestamp;

        await interaction.editReply(`Pong! Latência da API: ${botPing}ms. Latência de ida e volta: ${roundtripLatency}ms`);
    },
};