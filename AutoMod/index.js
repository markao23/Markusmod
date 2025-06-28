// automod/index.js
const AutoModService = require('./AutoModService');
const config = require('../config');

// Cria uma única instância do serviço para ser usada por todo o bot.
// Isso evita criar um novo serviço para cada mensagem.
let serviceInstance = null;

/**
 * A função pública que o resto do bot usará para checar uma mensagem.
 * @param {import('discord.js').Message} message
 * @param {import('../src/Bot')} bot
 * @returns {Promise<boolean>} Retorna true se uma ação foi tomada.
 */
async function handleMessage(message, bot) {
    // Inicializa o serviço na primeira vez que for chamado
    if (!serviceInstance) {
        // Passa o 'bot' (Client) para o serviço poder usá-lo
        serviceInstance = new AutoModService(bot, config);
    }

    return serviceInstance.processMessage(message);
}

// Exporta apenas a função que queremos que seja pública
module.exports = {
    handleMessage
};