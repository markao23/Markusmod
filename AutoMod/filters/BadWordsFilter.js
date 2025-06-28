const BaseFilter = require('./BaseFilter')

class BadWordsFilter extends BaseFilter {
    constructor(config) {
        super(config);
    }
    check(message) {
        const content = message.content.toLowerCase().replace(/[^a-z0-9]/g, '')
        const hasBadWord = this.config.list.some(word => content.includes(word))
        return {
            isBadWord: hasBadWord,
            reason: hasBadWord ? 'Uso de palavra proibida' : null
        }
    }
}
module.exports = BadWordsFilter;