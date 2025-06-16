// index.js

const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js'); // Importa os módulos
require('dotenv').config();

// --- CONFIGURAÇÕES ---
const token = process.env.DISCORD_TOKEN;
const prefix = 'm!'; // Define o prefixo do seu bot

// --- CRIAÇÃO DO CLIENTE ---
// Adicionamos os INTENTS para ler mensagens
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages, // Necessário para receber mensagens em servidores
        GatewayIntentBits.MessageContent, // Necessário para LER o conteúdo das mensagens
    ],
});

// --- COLEÇÕES PARA COMANDOS ---
client.commands = new Collection(); // Para Slash Commands
client.prefixCommands = new Collection(); // NOVA: Para Comandos de Prefixo

// --- CARREGADOR DE SLASH COMMANDS (sem alterações) ---
const slashCommandsPath = path.join(__dirname, 'commands/utilidade');
// ... (mantenha seu carregador de slash commands aqui como estava) ...

// --- NOVO: CARREGADOR DE COMANDOS DE PREFIXO ---
const prefixCommandsPath = path.join(__dirname, 'commands/prefixo');
const prefixCommandFiles = fs.readdirSync(prefixCommandsPath).filter(file => file.endsWith('.js'));

for (const file of prefixCommandFiles) {
    const filePath = path.join(prefixCommandsPath, file);
    const command = require(filePath);

    if ('name' in command && 'execute' in command) {
        client.prefixCommands.set(command.name, command);
        console.log(`✅ Comando de Prefixo !${command.name} carregado.`);
    } else {
        console.log(`❌ Falha ao carregar o comando de prefixo em ${filePath}.`);
    }
}


// --- EVENTOS DO BOT ---
client.once(Events.ClientReady, c => {
    console.log(`✨ Pronto! O bot está online como ${c.user.tag}`);
});

// Listener para Slash Commands (sem alterações)
client.on(Events.InteractionCreate, async interaction => {
    // ... (mantenha seu listener de slash commands aqui como estava) ...
});

// --- NOVO: LISTENER PARA COMANDOS DE PREFIXO ---
client.on(Events.MessageCreate, async message => {
    if (message.author.bot || !message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.prefixCommands.get(commandName)
        || client.prefixCommands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return; // Se o comando não existe, não faz nada
    try {
        await command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('Ocorreu um erro ao tentar executar esse comando!');
    }
});


// --- LOGIN DO BOT ---
client.login(token);