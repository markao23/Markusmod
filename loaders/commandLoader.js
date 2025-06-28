const { readdirSync } = require('fs');
const path = require('path');

// esse nao vou colocar comentarios pois o principio é o mesmo
module.exports = (bot) => {
    const commandsPath = path.join(__dirname, '..', 'commands');
    const commandFolders = readdirSync(commandsPath);

    for (const folder of commandFolders) {
        const folderPath = path.join(commandsPath, folder);
        const commandFiles = readdirSync(folderPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const filePath = path.join(folderPath, file);
            const Command = require(filePath);

            // Validação para garantir que é uma classe de comando
            if (Command.prototype instanceof require('../strutures/BaseCommand')) {
                const command = new Command();
                bot.commands.set(command.name, command);
                console.log(`[COMANDO] Comando ${command.name} carregado.`);

                // Adiciona os aliases (apelidos) do comando
                if (command.aliases && command.aliases.length > 0) {
                    command.aliases.forEach(alias => bot.aliases.set(alias, command.name));
                }
            }
        }
    }
};