const BaseFilter = require('./BaseFilter');

class MassMentionFilter extends BaseFilter {
    constructor(config) {
        super(config);
    }

    check(message) {
        const mentionCount = message.mentions.users.size + message.mentions.roles.size;
        const hasMassMention = mentionCount >= this.config.maxMentions;

        return {
            isViolated: hasMassMention,
            reason: hasMassMention ? 'Excesso de menções em uma única mensagem.' : null
        };
    }
}

module.exports = MassMentionFilter; // <-- Verifique esta linha!