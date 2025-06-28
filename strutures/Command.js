module.exports = class Command {
    /**
     * @param {import('./Bot')} client o cliente do bot
     * @param {object} opitions as opções do comando
     */
    constructor(client, opitions) {
        this.client = client;
        this.name = opitions.name;
        this.description = opitions.description;
        this.usage = opitions.usage || opitions.name;
        this.category = opitions.category || 'Outros';
        this.aliases = opitions.aliases || [];
    }

    /**
     * @param {import('discord.js').Message} message A mensagem que acionou o comando
     * @param {string[]} args Os argumentos do comando
     */
    async execute(message, args) {
        throw new Error(`O método execute() não foi implementado em ${this.name}`);
    }

}