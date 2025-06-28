// Em /commands/prefixo/HelpCommand.js

const { EmbedBuilder } = require('discord.js');
const Command = require('../../strutures/Command.js'); // Importa a classe base

module.exports = class HelpCommand extends Command {
    constructor(client) {
        // Usa super() para passar as opções para a classe pai (Command)
        super(client, {
            name: 'help',
            description: 'Mostra a lista de comandos ou informações sobre um comando específico.',
            usage: 'help [nome do comando]',
            category: 'Utilidades',
            aliases: ['ajuda', 'comandos'],
        });
    }

    /**
     * @param {import('discord.js').Message} message
     * @param {string[]} args
     */
    async execute(message, args) {
        const prefix = 'm!'; // Você pode pegar isso do client futuramente

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTimestamp()
            .setFooter({ text: `Solicitado por ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });

        if (!args.length) {
            embed
                .setTitle('📜 Meus Comandos')
                .setDescription(`Use \`${prefix}${this.usage}\` para obter detalhes sobre um comando!`);

            const categories = [...new Set(this.client.commands.map(cmd => cmd.category))];

            for (const category of categories) {
                const commandsInCategory = this.client.commands
                    .filter(cmd => cmd.category === category)
                    .map(cmd => `\`${cmd.name}\``)
                    .join(', ');
                if (commandsInCategory) {
                    embed.addFields({ name: `📁 ${category}`, value: commandsInCategory });
                }
            }
        } else {
            const commandName = args[0].toLowerCase();
            const command = this.client.commands.get(commandName) || this.client.commands.find(cmd => cmd.aliases.includes(commandName));

            if (!command) {
                return message.reply({ content: '❌ Comando não encontrado!', ephemeral: true });
            }

            embed
                .setTitle(`🔍 Detalhes do Comando: \`${command.name}\``)
                .addFields(
                    { name: 'Descrição', value: command.description },
                    { name: 'Como usar', value: `\`${prefix}${command.usage}\`` },
                    { name: 'Apelidos (Aliases)', value: command.aliases.length ? command.aliases.join(', ') : 'Nenhum.' }
                );

            if (command.name === 'clear') {
                embed.addFields({
                    name: '⚠️ Limitação Importante',
                    value: 'Este comando não pode apagar mensagens com mais de **2 semanas (14 dias)** de idade.'
                });
            }
        }

        return message.reply({ embeds: [embed] });
    }
};