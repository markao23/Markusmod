// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

const Bot = require('./Bot');

// Instancia e inicia o bot
const bot = new Bot();
bot.start();

// Tratamento de erros não capturados para evitar que o bot crashe
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err, origin) => {
    console.error('Uncaught Exception:', err, 'origin:', origin);
});