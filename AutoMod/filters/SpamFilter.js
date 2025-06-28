// AutoMod/filters/SpamFilter.js
const BaseFilter = require('./BaseFilter');

class SpamFilter extends BaseFilter {
    /**
     * @param {object} config A configuração para o filtro de spam.
     * @param {UserActionTracker} tracker A instância do rastreador de ações do usuário.
     */
    constructor(config, tracker) {
        super(config);

        if (!tracker) {
            throw new Error("SpamFilter: Instância do UserActionTracker não foi fornecida.");
        }
        this.tracker = tracker;

        // =======================================================================
        // AQUI ESTÁ A MELHORIA: VERIFICAÇÃO DE CONFIGURAÇÃO
        // =======================================================================
        if (!config || !config.velocity || !config.repetition) {
            throw new Error("SpamFilter: A configuração está incompleta. É necessário ter os objetos 'velocity' e 'repetition'.");
        }
    }

    /**
     * Verifica a mensagem em busca de comportamento de spam.
     * @param {import('discord.js').Message} message A mensagem a ser verificada.
     * @returns {{isViolated: boolean, reason: string|null}}
     */
    check(message) {
        const userId = message.author.id;
        const messageContent = message.content;

        this.tracker.recordMessage(userId, messageContent);

        // 1. Verifica o spam por velocidade (flood)
        const isVelocitySpam = this.tracker.checkVelocity(
            userId,
            this.config.velocity.maxMessages,
            this.config.velocity.timeframe
        );

        if (isVelocitySpam) {
            return {
                isViolated: true,
                reason: `Spam por Velocidade (mais de ${this.config.velocity.maxMessages} mensagens em ${this.config.velocity.timeframe / 1000}s).`
            };
        }

        // 2. Verifica o spam por repetição
        const isRepetitionSpam = this.tracker.checkRepetition(
            userId,
            this.config.repetition.maxDuplicates,
            this.config.repetition.timeframe
        );

        if (isRepetitionSpam) {
            return {
                isViolated: true,
                reason: `Spam por Repetição (enviou a mesma mensagem ${this.config.repetition.maxDuplicates} vezes).`
            };
        }

        return { isViolated: false, reason: null };
    }
}

module.exports = SpamFilter;