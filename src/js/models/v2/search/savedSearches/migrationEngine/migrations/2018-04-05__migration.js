const migration = {
    next: null, // this is the first migration
    inboundVersion: '2017-11-21', // version we are migrating from
    migrate(data) {
        const inboundFilters = data.filters;
        const filters = {
            awardType: inboundFilters.filtersawardType || []
        };

        // keyword has been adapted to an array
        if (inboundFilters.filterskeyword) {
            filters.keyword = [inboundFilters.keyword];
        }

        // time period is a child object
        filters.timePeriod = {
            type: inboundFilters.timePeriodType,
            value: []
        };
        // time period values have been combined into a single value array
        if (inboundFilters.timePeriodType === 'fy') {
            filters.timePeriod.value = inboundFilters.timePeriodFY || [];
        }
        else {
            filters.timePeriod.value = [
                inboundFilters.timePeriodStart || null,
                inboundFilters.timePeriodEnd || null
            ];
        }

        // convert location objects to arrays of objects
        if (inboundFilters.selectedLocations) {
            filters.location = Object.keys(inboundFilters.selectedLocations)
                .map((key) => inboundFilters.selectedLocations[key]);
        }

        // in previous versions, there was no search view, so use a stock set of values
        const view = {
            activeTab: 'table',
            subaward: false
        };

        return {
            filters,
            view
        };
    }
};

export default migration;
