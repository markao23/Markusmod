const { SlashCommandBuilder } = require('discord.js');
/**
 * Reprsenta a estrutura base pra todos os comandos de barra
 */

module.exports = class BaseSlashCommand {
    /**
     * @param {string} name nome do comando
     * @param {string} description descrição do comando
     */
    constructor(name, description) {
        this.data = new SlashCommandBuilder()
            .setName(name)
            .setDescription(description)
    }
    /**
     * O método que será executado quando o comando for chamado.
     * Este método DEVE ser implementado pela classe filha.
     * @param {import('../bot/Bot')} bot A instância do nosso cliente.
     * @param {import('discord.js').Interaction} interaction A interação recebida.
     */
    execute(bot, interaction) {
        throw new Error(`O Slash Command ${this.data.name} não implementou o método execute()!`);
    }
}