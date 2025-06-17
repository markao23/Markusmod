// index.js

const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const token = process.env.DISCORD_TOKEN;
const prefix = 'm!';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.commands = new Collection();
client.prefixCommands = new Collection();

// --- CARREGADOR DE SLASH COMMANDS ---
const slashCommandsPath = path.join(__dirname, 'commands');
const slashCommandFolders = fs.readdirSync(slashCommandsPath);

for (const folder of slashCommandFolders) {
    if (folder === 'prefixo') continue;
    const folderPath = path.join(slashCommandsPath, folder);
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(folderPath, file);
        const command = require(filePath);
        if ('name' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            console.log(`[INFO] Comando de prefixo carregado: !${command.name}`);
        } else {
            console.log(`[AVISO] O comando em ${filePath} está com 'name' ou 'execute' faltando.`);
        }
    }
}

// --- CARREGADOR DE COMANDOS DE PREFIXO ---
const prefixCommandsPath = path.join(__dirname, 'commands/prefixo');
if (fs.existsSync(prefixCommandsPath)) {
    const prefixCommandFiles = fs.readdirSync(prefixCommandsPath).filter(file => file.endsWith('.js'));
    for (const file of prefixCommandFiles) {
        const filePath = path.join(prefixCommandsPath, file);
        const command = require(filePath);
        if ('name' in command && 'execute' in command) {
            client.prefixCommands.set(command.name, command);
        }
    }
}

// --- EVENTOS DO BOT ---
client.once(Events.ClientReady, c => {
    console.log(`✨ Pronto! O bot está online como ${c.user.tag}`);
});

// Listener para Slash Commands (Lógica Corrigida e Completa)
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`Nenhum comando de barra correspondente a ${interaction.commandName} foi encontrado.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(`Erro ao executar o comando /${interaction.commandName}`);
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'Ocorreu um erro ao executar este comando!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'Ocorreu um erro ao executar este comando!', ephemeral: true });
        }
    }
});

// Listener para Comandos de Prefixo
client.on(Events.MessageCreate, async message => {
    if (message.author.bot || !message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.prefixCommands.get(commandName) || client.prefixCommands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;

    try {
        await command.execute(message, args);
    } catch (error) {
        console.error(`Erro ao executar o comando !${commandName}`);
        console.error(error);
        message.reply('Ocorreu um erro ao tentar executar esse comando!');
    }
});

// --- LOGIN DO BOT ---
client.login(token);