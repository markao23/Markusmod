// automod/filters/InviteLinkFilter.js
const BaseFilter = require('./BaseFilter');

class InviteLinkFilter extends BaseFilter {
    constructor(config) {
        super(config);
        this.regex = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/[^\s/]+?(?=\b)/g;
    }

    check(message) {
        // Permite que admins enviem convites
        if (message.member && message.member.permissions.has('Administrator')) {
            return { isViolated: false, reason: null };
        }

        const hasInviteLink = this.regex.test(message.content);
        return {
            isViolated: hasInviteLink,
            reason: hasInviteLink ? 'Envio de link de convite não autorizado.' : null
        };
    }
}

module.exports = InviteLinkFilter;