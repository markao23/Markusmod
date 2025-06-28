const BaseEvent = require('../strutures/BaseEvent');

class InteractionCreateEvent extends BaseEvent {
    constructor() {
        super('interactionCreate');
    }

    async execute(bot, interaction) {
        // Processa apenas comandos de barra (ignora botões, menus, etc.)
        if (!interaction.isChatInputCommand()) return;

        const command = bot.slashCommands.get(interaction.commandName);

        if (!command) {
            console.error(`Nenhum comando correspondente a /${interaction.commandName} foi encontrado.`);
            await interaction.reply({
                content: 'Houve um erro ao encontrar este comando!',
                ephemeral: true // Mensagem visível apenas para o usuário
            });
            return;
        }

        try {
            await command.execute(bot, interaction);
        } catch (error) {
            console.error(`Erro ao executar o comando /${interaction.commandName}:`, error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'Houve um erro ao executar este comando!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'Houve um erro ao executar este comando!', ephemeral: true });
            }
        }
    }
}

module.exports = InteractionCreateEvent;