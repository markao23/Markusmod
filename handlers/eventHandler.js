const { readdirSync } = require('fs');
const path = require('path');

module.exports = (bot) => {
    /**
     * __dirname -> pra mostrar pro path nome do arquivo
     * saida: ex: /home/markus/WebstormProjects/untitled6
     * .. -> esse mostra que vai pular uma pasta
     * saida: ex: /home/markus/WebstormProjects/untitled6
     * untitled6 esse é o diretorio pai .. pular pra entrar /events
     * ex: /home/markus/WebstormProjects/untitled6
     * ex: /home/markus/WebstormProjects/untitled6/events
     * events/ -> nome da pasta que path vai entrar ou ler
     */
    const eventPath = path.join(__dirname, '..', 'events');
    const eventsFolders = readdirSync(eventPath);
    /**
     * esse eventsPath ele vai ler os arquivos dentro do eventsPath
     * vao ler assincronamente
     */

    /**
     * agora esse daqui vai efetuar toda a percorração do projeto e lende os arquivos etc
     */
    for(const folder of eventsFolders){
        const folderPath = path.join(eventPath, folder) // isso quer dizer ele vai colocar agora o folder dentro do path eventPath
        // ex: /home/markus/WebstormProjects/untitled6/events/event
        const eventFiles = readdirSync(folderPath).filter(file => file.endsWith('.js'));
        // eventsFiles vao ler dentro folderPath com filtro de arquivos somente .js
        // ex: /home/markus/WebstormProjects/untitled6/events/event arquivo tipo ping.js
        // ele so vai ler o ping.js ignorar tipo ping.ts
        for (const file of eventFiles){ // esse é o loop do arquivos
            const filePath = path.join(folderPath, file) // esse é o mesmo proposito do folder mas pra arquivos
            const Event = require(filePath) // vai criar uma constante event pro path dos files
            if (Event.prototype instanceof require('../strutures/BaseEvent')){
                const event = new Event() // esse a criação de um novo evento
                console.log(`[EVENTO] Evento ${event.name} carregado.`)
                if (event.once){
                    bot.once(event.name, (...args) => event.execute(bot, ...args)); // esse pre os que devem rodar so uma vez ex: ready
                } else {
                    bot.on(event.name, (...args) => event.execute(bot, ...args)); // esse pro demais comands que tem ser execultado varias vezes
                }
            }
        }
    }
}

