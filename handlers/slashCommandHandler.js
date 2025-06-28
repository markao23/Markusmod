// /src/handlers/slashCommandHandler.js - VERSÃO CORRIGIDA E DEFINITIVA

const { readdirSync } = require('fs');
const path = require('path');
const fs = require('fs');
const BaseSlashCommand = require('../strutures/BaseSlashCommand');

module.exports = (bot) => {
    // ===================================================================
    // AQUI ESTÁ A CORREÇÃO. O CAMINHO APONTA PARA A PASTA 'commands'
    const commandsPath = path.join(__dirname, '.', 'commands');
    // ===================================================================

    if (!fs.existsSync(commandsPath)) return;

    const loadCommands = (dir) => {
        const files = readdirSync(dir, { withFileTypes: true });

        for (const file of files) {
            const fullPath = path.join(dir, file.name);
            if (file.isDirectory()) {
                loadCommands(fullPath);
            } else if (file.name.endsWith('.js')) {
                try {
                    const CommandClass = require(fullPath);
                    if (Object.prototype.isPrototypeOf.call(BaseSlashCommand, CommandClass) || CommandClass.prototype instanceof BaseSlashCommand) {
                        const command = new CommandClass();
                        bot.slashCommands.set(command.data.name, command);
                        console.log(`[SLASH CMD] /${command.data.name} carregado.`);
                    }
                } catch (error) {
                    // Ignora arquivos que não são slash commands
                }
            }
        }
    };

    loadCommands(commandsPath);
};