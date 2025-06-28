require('dotenv').config();
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { readdirSync } = require('fs');
const path = require('path');
const BaseSlashCommand = require('./strutures/BaseSlashCommand');

const commands = [];
const slashCommandsPath = path.join(__dirname, 'src', 'slashCommands');

// Função recursiva para carregar comandos
const loadCommands = (dir) => {
    const files = readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
        const fullPath = path.join(dir, file.name);
        if (file.isDirectory()) {
            loadCommands(fullPath);
        } else if (file.name.endsWith('.js')) {
            const CommandClass = require(fullPath);
            if (Object.prototype.isPrototypeOf.call(BaseSlashCommand, CommandClass) || CommandClass.prototype instanceof BaseSlashCommand) {
                const command = new CommandClass();
                commands.push(command.data.toJSON());
                console.log(`Comando /${command.data.name} preparado para deploy.`);
            }
        }
    }
};

loadCommands(slashCommandsPath);

// Pega as credenciais do seu arquivo .env
const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } = process.env;

if (!DISCORD_TOKEN || !CLIENT_ID || !GUILD_ID) {
    console.error("Por favor, defina DISCORD_TOKEN, CLIENT_ID e GUILD_ID no seu arquivo .env");
    process.exit(1);
}

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

(async () => {
    try {
        console.log(`\nIniciando o registro de ${commands.length} comandos de barra (/).`);

        // O método 'put' sobreescreve todos os comandos da guilda com o conjunto atual
        const data = await rest.put(
            // Para registrar comandos apenas em um servidor de teste (instantâneo)
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            // Para registrar comandos globalmente (pode levar até 1 hora para propagar)
            // Routes.applicationCommands(CLIENT_ID),
            { body: commands },
        );

        console.log(`\n✅ Sucesso! ${data.length} comandos de barra (/) foram registrados.`);
    } catch (error) {
        console.error("\n❌ Falha ao registrar os comandos:", error);
    }
})();