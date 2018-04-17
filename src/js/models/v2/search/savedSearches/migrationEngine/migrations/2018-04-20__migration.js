import prevMigration from './2018-04-05__migration';

const migration = {
    prev: prevMigration, // this is the first migration
    inboundVersion: '2018-04-05', // version we are migrating from
    migrate(data) {
        let inbound = data;
        if (data.version !== this.inboundVersion) {
            if (this.prev) {
                // use an earlier migration to bring it up to the inbound version
                inbound = this.prev.migrate(data);
            }
            else {
                // bad input, return a blank set of data
                return {
                    filters: {},
                    view: {
                        subaward: false
                    }
                };
            }
        }

        const inboundFilters = inbound.filters;
        // migrate the data
        const filters = {};
        if (inboundFilters.keyword && typeof inboundFilters.keyword === 'string') {
            filters.keyword = [inboundFilters.keyword];
        }

        let migratedFilters = inboundFilters.filters;
        if (Object.keys(filters).length > 0) {
            // don't merge in the filter object if it is empty
            migratedFilters = Object.assign({}, inboundFilters, filters);
            console.log(migratedFilters);
        }

        return {
            filters: migratedFilters,
            view: inbound.view
        };
    }
};

export default migration;
