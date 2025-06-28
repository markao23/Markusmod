const { EmbedBuilder } = require('discord.js');
const BaseCommand = require('../../strutures/BaseCommand');

class HelpCommand extends BaseCommand {
    constructor() {
        super('help', {
            category: 'Utilidades',
            aliases: ['ajuda', 'comandos'],
            description: 'Mostra a lista de comandos ou informações sobre um comando específico.',
            usage: 'help [nome do comando]'
        });
    }

    async execute(bot, message, args) {
        const prefix = bot.prefix;

        // Se não houver argumentos, mostra a lista geral de comandos
        if (!args.length) {
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('📜 Meus Comandos')
                .setDescription(`Use \`${prefix}help [nome do comando]\` para ver detalhes de um comando específico.`);

            const categories = {};
            // Agrupa os comandos por categoria
            bot.commands.forEach(command => {
                if (!categories[command.category]) {
                    categories[command.category] = [];
                }
                categories[command.category].push(`\`${command.name}\``);
            });

            // Adiciona um campo para cada categoria no embed
            for (const categoryName in categories) {
                embed.addFields({
                    name: `**${categoryName}**`,
                    value: categories[categoryName].join(', '),
                    inline: false
                });
            }

            return message.reply({ embeds: [embed] });
        }

        // Se houver um argumento, mostra os detalhes do comando específico
        const commandName = args[0].toLowerCase();
        const command = bot.commands.get(commandName) || bot.commands.get(bot.aliases.get(commandName));

        if (!command) {
            return message.reply('Esse comando não existe!');
        }

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`🔍 Detalhes do Comando: \`${command.name}\``)
            .addFields(
                { name: 'Descrição', value: command.description || 'Nenhuma descrição.' },
                { name: 'Categoria', value: command.category },
                { name: 'Como usar', value: `\`${prefix}${command.usage || command.name}\`` },
                { name: 'Apelidos (Aliases)', value: command.aliases.length ? command.aliases.join(', ') : 'Nenhum.' }
            );

        return message.reply({ embeds: [embed] });
    }
}

module.exports = HelpCommand;