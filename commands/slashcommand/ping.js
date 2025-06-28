const { SlashCommandBuilder } = require('discord.js');
const { MessageFlags } = require('discord.js');
const  SlashCommand = require('../../strutures/BaseSlashCommand')

class PingCommand extends SlashCommand {
    constructor() {
        super('ping', 'verifica a latencia do bot e da api');
    }
    async execute(bot, interaction) {
        await interaction.reply({
            content: 'Cauculando latencia',
            flags: [MessageFlags.Ephemeral]
        })
        const botPing = Math.round(bot.ws.ping)
        const reply = await interaction.fetchReply()
        const roundtripLatency = reply.createdTimestamp - interaction.createdTimestamp;
        await interaction.editReply(
            `> :ping_pong: **Pong!**\n` +
            `> **Latência da API:** \`${botPing}ms\`\n` +
            `> **Latência do Bot (Ida e Volta):** \`${roundtripLatency}ms\``
        );
    }
}