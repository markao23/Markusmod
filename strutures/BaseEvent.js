module.exports = class BaseEvent {
    constructor(name) {
        this.name = name; // nome do evento, ex: "ready", "messageCreate"
    }

    // Método que será executado quando o evento for emitido.
    execute(bot, ...args) {
        throw new Error(`O evento ${this.name} não possui um método execute()!`);
    }
}