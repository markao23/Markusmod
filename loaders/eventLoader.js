// loaders/eventLoader.js
const fs = require('fs');
const path = require('path');

module.exports = (bot) => {
    const eventsPath = path.join(__dirname, '..', 'events');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);

        const eventName = path.parse(file).name;

        if (event.once) {
            bot.once(eventName, (...args) => event.execute(...args, bot));
        } else {
            bot.on(eventName, (...args) => event.execute(...args, bot));
        }
        console.log(`[EVENTO] Evento ${eventName} carregado.`);
    }
};