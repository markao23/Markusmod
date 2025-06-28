// automod/PunishmentHandler.js
const { EmbedBuilder } = require('discord.js');

class PunishmentHandler {
    constructor(client, logChannelId) {
        this.client = client;
        this.logChannelId = logChannelId;
    }

    /**
     * Aplica a punição padrão: deleta a mensagem, avisa o usuário e registra em log.
     * @param {import('discord.js').Message} message A mensagem infratora.
     * @param {string} reason O motivo da punição.
     */
    async apply(message, reason) {
        // Deleta a mensagem
        if (message.deletable) {
            await message.delete().catch(err => console.error("AutoMod: Falha ao deletar mensagem.", err));
        }

        // Avisa o usuário (opcional e com tratamento de erro)
        await message.author.send(`Sua mensagem no servidor **${message.guild.name}** foi removida.\n**Motivo:** ${reason}`)
            .catch(() => console.warn(`AutoMod: Não foi possível enviar DM para o usuário ${message.author.tag}.`));

        // Envia o log
        await this.logInfraction(message, reason);
    }

    async logInfraction(message, reason) {
        // ... (lógica do log com EmbedBuilder) ...
    }
}

module.exports = PunishmentHandler;