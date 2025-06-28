const fs = require('fs');
const path = require('path');
const PunishmentHandler = require('./PunishmentHandler');
const UserActionTracker = require('./utils/UserActionTracker');

class AutoModService {
    constructor(client, config) {
        this.client = client;
        this.config = config;
        this.PunishmentHandler = new PunishmentHandler(client, config.logChannelId);
        this.tracker = new UserActionTracker();
        this.filters = this.__loadFilters();
    }

    __loadFilters() {
        const loadedFilters = []
        const filtersPath = path.join(__dirname, 'filters');
        const filterFiles = fs.readdirSync(filtersPath).filter(file => file.endsWith('.js') && file !== 'BaseFilter.js');
        for( const file of filterFiles ) {
            const filterName = path.parse(file).name;
            const configKey = filterName.charAt(0).toLowerCase() + filterName.slice(1);
            if (this.config.enabled[configKey]){
                const FilterClass = require(path.join(filtersPath, file));
                const filterConfig = this.config.filters[configKey] || {};
                const filterInstance = (filterName === 'SpamFilter')
                    ? new FilterClass(filterConfig, this.tracker)
                    : new FilterClass(filterConfig);

                loadedFilters.push(filterInstance);
                console.log(`[AutoMod Service] Filtro ${filterName} carregado.`);
            }
        }
        return loadedFilters;
    }
    async processMessage(message) {
        for (const filter of this.filters) {
            const result = filter.check(message);
            if (result.isViolated) {
                await this.PunishmentHandler.apply(message, result.reason);
                return true; // Ação foi tomada, para o processo.
            }
        }
        return false; // Nenhuma ação foi tomada.
    }
}

module.exports = AutoModService;