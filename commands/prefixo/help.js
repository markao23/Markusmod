// /home/markus/WebstormProjects/untitled6/commands/prefixo/help.js

const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Mostra uma lista de todos os comandos disponíveis.',
    aliases: ['ajuda', 'comandos'], // Opcional: aliases para o comando
    async execute(message, args, client) { // Certifique-se de que 'client' é passado aqui
        const prefix = 'm!'; // Certifique-se que o prefixo aqui é o mesmo do seu index.js

        const embed = new EmbedBuilder()
            .setColor(0x0099FF) // Um azul bonito
            .setTitle('Guia de Comandos do Bot')
            .setDescription(`Olá! Aqui estão todos os comandos que você pode usar.\nMeu prefixo é: \`${prefix}\``)
            .setThumbnail(client.user.displayAvatarURL()); // Ícone do seu bot

        // --- Comandos de Prefixo ---
        let prefixCommandsString = '';
        if (client.commands.size > 0) {
            const filteredPrefixCommands = client.commands.filter(cmd => !cmd.aliases || !cmd.aliases.includes('help'));
            prefixCommandsString = filteredPrefixCommands.map(cmd => {
                if (cmd.name === 'help') return ''; // Evita listar 'help' duas vezes se tiver alias

                let cmdName = `\`${prefix}${cmd.name}\``;
                if (cmd.aliases && cmd.aliases.length > 0) {
                    cmdName += ` (Aliases: ${cmd.aliases.map(a => `\`${prefix}${a}\``).join(', ')})`;
                }
                return `${cmdName}: ${cmd.description || 'Sem descrição.'}`;
            }).filter(Boolean).join('\n'); // .filter(Boolean) remove entradas vazias

            if (prefixCommandsString === '') { // Se não sobrou nenhum comando depois de filtrar o help
                prefixCommandsString = 'Nenhum comando de prefixo disponível (além deste).';
            }
        } else {
            prefixCommandsString = 'Nenhum comando de prefixo carregado.';
        }

        embed.addFields({
            name: 'Comandos de Prefixo',
            value: prefixCommandsString || 'Nenhum comando de prefixo carregado.',
        });


        let slashCommandsString = '';
        if (client.slashCommands.size > 0) {
            slashCommandsString = client.slashCommands.map(cmd => {
                const cmdDescription = cmd.data.description || 'Sem descrição.';
                return `\`/${cmd.data.name}\`: ${cmdDescription}`;
            }).join('\n');
        } else {
            slashCommandsString = 'Nenhum comando de barra (slash command) carregado.';
        }

        embed.addFields({
            name: 'Comandos de Barra',
            value: slashCommandsString || 'Nenhum comando de barra (slash command) carregado.',
        });

        embed.setFooter({ text: `Solicitado por ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });
        embed.setTimestamp();

        await message.reply({ embeds: [embed] });
    },
};