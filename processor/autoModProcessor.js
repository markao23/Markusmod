// processors/autoModProcessor.js

// Importa o módulo AutoMod inteiro através da sua "porta de entrada" (index.js)
const AutoMod = require('../AutoMod');

/**
 * Processa a mensagem através do sistema de AutoMod.
 * @param {import('discord.js').Message} message
 * @param {import('../src/Bot')} bot
 * @returns {Promise<{actionTaken: boolean}>} Retorna se o AutoMod tomou alguma ação.
 */
async function handle(message, bot) {
    // Chama a única função pública do módulo
    const wasActionTaken = await AutoMod.handleMessage(message, bot);

    return { actionTaken: wasActionTaken };
}

module.exports = { handle };