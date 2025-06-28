// /utils/UserActionTracker.js

/**
 * Rastreia as ações recentes dos usuários para fornecer dados para os filtros.
 * Atua como a "memória de curto prazo" do sistema de moderação.
 */
class UserActionTracker {
    constructor() {
        /**
         * Armazena o histórico de timestamps das mensagens de cada usuário.
         * Estrutura: Map<userId, timestamp[]>
         * @type {Map<string, number[]>}
         */
        this.userMessageTimestamps = new Map();

        /**
         * Armazena o histórico de conteúdo das mensagens de cada usuário.
         * Estrutura: Map<userId, {content: string, timestamp: number}[]>
         * @type {Map<string, Array<{content: string, timestamp: number}>>}
         */
        this.userMessageContent = new Map();
    }

    /**
     * Registra uma nova mensagem enviada por um usuário.
     * @param {string} userId O ID do usuário.
     * @param {string} messageContent O conteúdo da mensagem.
     */
    recordMessage(userId, messageContent) {
        const now = Date.now();

        // Grava o timestamp para análise de velocidade
        if (!this.userMessageTimestamps.has(userId)) {
            this.userMessageTimestamps.set(userId, []);
        }
        const timestamps = this.userMessageTimestamps.get(userId);
        timestamps.push(now);
        // Mantém apenas os últimos 10 timestamps para não consumir memória
        if (timestamps.length > 10) {
            timestamps.shift();
        }

        // Grava o conteúdo para análise de repetição
        if (!this.userMessageContent.has(userId)) {
            this.userMessageContent.set(userId, []);
        }
        const contents = this.userMessageContent.get(userId);
        contents.push({ content: messageContent, timestamp: now });
        // Mantém apenas os últimos 5 conteúdos
        if (contents.length > 5) {
            contents.shift();
        }
    }

    /**
     * Verifica se o usuário está enviando mensagens rápido demais.
     * @param {string} userId O ID do usuário.
     * @param {number} maxMessages O número máximo de mensagens permitidas.
     * @param {number} timeframe O intervalo de tempo em milissegundos.
     * @returns {boolean} `true` se for spam por velocidade, `false` caso contrário.
     */
    checkVelocity(userId, maxMessages, timeframe) {
        if (!this.userMessageTimestamps.has(userId)) {
            return false;
        }

        const timestamps = this.userMessageTimestamps.get(userId);
        const now = Date.now();

        // Conta quantas mensagens recentes estão dentro do intervalo de tempo
        const recentMessages = timestamps.filter(ts => (now - ts) < timeframe);

        return recentMessages.length >= maxMessages;
    }

    /**
     * Verifica se o usuário está enviando mensagens repetidas.
     * @param {string} userId O ID do usuário.
     * @param {number} maxDuplicates O número máximo de mensagens idênticas.
     * @param {number} timeframe O intervalo de tempo em milissegundos.
     * @returns {boolean} `true` se for spam por repetição, `false` caso contrário.
     */
    checkRepetition(userId, maxDuplicates, timeframe) {
        if (!this.userMessageContent.has(userId)) {
            return false;
        }

        const contents = this.userMessageContent.get(userId);
        if (contents.length < maxDuplicates) {
            return false;
        }

        // Pega a mensagem mais recente
        const lastMessage = contents[contents.length - 1];

        // Conta quantas das mensagens recentes são idênticas à última e estão dentro do timeframe
        const now = Date.now();
        const duplicates = contents.filter(msg =>
            msg.content === lastMessage.content &&
            msg.content.length > 0 && // Ignora mensagens vazias
            (now - msg.timestamp) < timeframe
        );

        return duplicates.length >= maxDuplicates;
    }
}

module.exports = UserActionTracker;