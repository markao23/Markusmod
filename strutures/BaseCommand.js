module.exports = class BaseCommand {
    constructor(name, category, aliases = []) {
        this.name = name;
        this.category = category;
        this.aliases = aliases;
    }
    execute(bot, message, args) {
        throw new Error(`O comando ${this.name} não possui um método execute()!`);
    }
}

