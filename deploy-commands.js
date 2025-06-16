// deploy-commands.js

// Importa os módulos necessários
const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config(); // Carrega as variáveis de ambiente

// Pega as credenciais do arquivo .env
const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;

// Array para guardar os dados dos comandos
const commands = [];

// Encontra todos os arquivos de comando na pasta 'commands'
const commandsPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandsPath);

// Loop pelas pastas de categorias de comandos
for (const folder of commandFolders) {
    const folderPath = path.join(commandsPath, folder);
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

    // Loop pelos arquivos de comando
    for (const file of commandFiles) {
        const filePath = path.join(folderPath, file);
        const command = require(filePath);

        // Verifica se o comando é um Slash Command (tem a propriedade 'data')
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        }
    }
}

// Cria uma instância do REST para fazer a requisição à API do Discord
const rest = new REST().setToken(token);

// Função assíncrona auto-executável para implantar os comandos
(async () => {
    try {
        console.log(`Iniciando a atualização de ${commands.length} comandos de barra (/).`);

        // O método 'put' atualiza TODOS os comandos globais com a lista atual
        // Isso remove comandos antigos e adiciona os novos de uma só vez
        const data = await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
        );

        console.log(`✅ Sucesso! ${data.length} comandos de barra (/) foram recarregados.`);
    } catch (error) {
        // Pega e exibe qualquer erro que ocorra no processo
        console.error(error);
    }
})();