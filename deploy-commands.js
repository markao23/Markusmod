// deploy-commands.js

const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');


const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.DISCORD_TOKEN;
// ✅ Envolvemos toda a lógica em uma função async
async function deployCommands() {
    const commands = [];
    const commandsPath = path.join(__dirname, 'commands');

    if (!fs.existsSync(commandsPath)) {
        console.error("Diretório de comandos não encontrado em:", commandsPath);
        // ✅ Agora o 'return' está dentro de uma função e é válido
        return;
    }

    const commandFolders = fs.readdirSync(commandsPath).filter(folder =>
        fs.statSync(path.join(commandsPath, folder)).isDirectory()
    );

    for (const folder of commandFolders) {
        const folderPath = path.join(commandsPath, folder);
        const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const filePath = path.join(folderPath, file);
            const command = require(filePath);
            if ('data' in command && 'execute' in command) {
                commands.push(command.data.toJSON());
            } else {
                console.log(`[AVISO] O comando em ${filePath} está faltando uma propriedade "data" ou "execute".`);
            }
        }
    }

    const rest = new REST({ version: '10' }).setToken(token);

    try {
        console.log(`Iniciado o recarregamento de ${commands.length} comandos de aplicação (/).`);

        const data = await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log(`Recarregado com sucesso ${data.length} comandos de aplicação (/).`);
        return data; // Retornar os dados pode ser útil para o teste
    } catch (error) {
        console.error(error);
    }
}

// ✅ Exporta a função para que possa ser usada em outros arquivos (como o teste)
module.exports = { deployCommands };

// Este bloco permite que o script ainda seja executável diretamente com "node deploy-commands.js"
if (require.main === module) {
    deployCommands();
}