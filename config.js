module.exports = {
    logChannelId: process.env.ID_CHANNEL,
    enabled: {
        badWordsFilter: true,
        inviteLinkFilter: true,
        massMentionFilter: true,
        spamFilter: true,
    },
    filters: {
        badWordsFilter: {
            list: ['caralho', 'vai tomar no cu', 'porra'],
        },
        massMentionFilter: {
            maxMentions: 5,
        },
        spamFilter: {
            velocity: {
                maxMessages: 5,
                timeframe: 3000
            },
            repetition: {
                maxDuplicates: 3,
                timeframe: 5000
            }
        },
    }
}