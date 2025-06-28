/**
 * Classe base abstrata para todos os filtros de moderação
 * garante que todos os filtros tenham uma estrutura consistente
 */

class BaseFilter {
    /**
     * @param {object} config a configuração especifica pra este filtro
     */
    constructor(config = {}) {
        this.config = config;
    }
    /**
     * Verifica se a mensagem viola a regra deste filtro.
     * Este método DEVE ser implementado pela classe filha.
     * @param {import('discord.js').Message} message A mensagem a ser verificada.
     * @returns {{isViolated: boolean, reason: string|null}} Retorna se a regra foi violada e o motivo.
     */
    check(message){
        throw new Error(`O filtro ${this.constructor.name} não implementou o método check().`);
    }
}

module.exports = BaseFilter;