function convertObjectToArray(input) {
    return Object.keys(input)
        .map((key) => input[key]);
}

const migration = {
    prev: null, // this is the first migration
    inboundVersion: '2017-11-21', // version we are migrating from
    migrate(data) {
        let inboundFilters = data.filters;
        if (data.version !== this.inboundVersion) {
            if (this.prev) {
                // use an earlier migration to bring it up to the inbound version
                inboundFilters = this.prev.migrate(data);
            }
            else {
                // bad input, return a blank set of data
                return {
                    filters: {},
                    view: {
                        activeTab: 'table',
                        subaward: false
                    }
                };
            }
        }
        const filters = {
            awardType: inboundFilters.awardType || [],
            recipients: inboundFilters.selectedRecipients || [],
            recipientType: inboundFilters.recipientType || [],
            pricingType: inboundFilters.pricingType || [],
            setAside: inboundFilters.setAside || [],
            extentCompeted: inboundFilters.extentCompeted || [],
            awardAmounts: inboundFilters.awardAmounts || {}
        };

        // keyword has been adapted to an array
        if (inboundFilters.keyword) {
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
            filters.location = {
                location: convertObjectToArray(inboundFilters.selectedLocations),
                type: inboundFilters.locationDomesticForeign || 'all'
            };
        }
        // convert location objects to arrays of objects
        if (inboundFilters.selectedRecipientLocations) {
            filters.recipientLocation = {
                location: convertObjectToArray(inboundFilters.selectedRecipientLocations),
                type: inboundFilters.recipientDomesticForeign || 'all'
            };
        }

        // do the same conversion for funding and awarding agencies
        if (inboundFilters.selectedFundingAgencies) {
            filters.fundingAgency = convertObjectToArray(inboundFilters.selectedFundingAgencies);
        }
        if (inboundFilters.selectedAwardingAgencies) {
            filters.awardingAgency = convertObjectToArray(inboundFilters.selectedAwardingAgencies);
        }

        if (inboundFilters.selectedAwardIDs) {
            filters.awardIDs = convertObjectToArray(inboundFilters.selectedAwardIDs);
        }
        if (inboundFilters.selectedCFDA) {
            filters.cfda = convertObjectToArray(inboundFilters.selectedCFDA);
        }
        if (inboundFilters.selectedNAICS) {
            filters.naics = convertObjectToArray(inboundFilters.selectedNAICS);
        }
        if (inboundFilters.selectedPSC) {
            filters.psc = convertObjectToArray(inboundFilters.selectedPSC);
        }

        // in previous versions, there was no search view, so use a stock set of values
        const view = {
            subaward: false
        };

        return {
            filters,
            view
        };
    }
};

export default migration;
