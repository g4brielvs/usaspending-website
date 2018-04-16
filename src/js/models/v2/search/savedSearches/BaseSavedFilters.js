/**
 * BaseSavedFilters.js
 * Created by Kevin Li 4/5/18
 */

import { Set, OrderedMap } from 'immutable';
import { initialState } from 'redux/reducers/search/searchFiltersReducer';
import { convertArrayToOrderedMap } from './utils';
import BaseSavedTimePeriod from './BaseSavedTimePeriod';
import BaseSavedLocation from './BaseSavedLocation';

const BaseSavedFilters = {
    populate(data) {
        this.keyword = [];
        if (data.keyword) {
            this.keyword = [data.keyword];
        }

        this.timePeriod = Object.create(BaseSavedTimePeriod);
        this.timePeriod.populate(data);

        this.awardType = data.awardType.toArray();
        this.location = Object.create(BaseSavedLocation);
        this.location.populate(data.selectedLocations, data.locationDomesticForeign);
        this.fundingAgency = data.selectedFundingAgencies.toArray();
        this.awardingAgency = data.selectedAwardingAgencies.toArray();
        this.recipients = data.selectedRecipients.toArray();

        this.recipientLocation = Object.create(BaseSavedLocation);
        this.recipientLocation.populate(
            data.selectedRecipientLocations,
            data.recipientDomesticForeign
        );

        this.recipientType = data.recipientType.toArray();
        this.awardType = data.awardType.toArray();
        this.awardIDs = data.selectedAwardIDs.toArray();
        this.awardAmounts = data.awardAmounts.toJS();
        this.cfda = data.selectedCFDA.toArray();
        this.naics = data.selectedNAICS.toArray();
        this.psc = data.selectedPSC.toArray();
        this.pricingType = data.pricingType.toArray();
        this.setAside = data.setAside.toArray();
        this.extentCompeted = data.extentCompeted.toArray();
    },
    restore(data) {
        const output = Object.assign({}, initialState);

        if (data.keyword && data.keyword.length > 0) {
            output.keyword = data.keyword[0];
        }

        if (data.timePeriod) {
            // merge the parsed output
            Object.assign(output, BaseSavedTimePeriod.restore(data.timePeriod));
        }

        if (data.awardType) {
            output.awardType = new Set(data.awardType);
        }

        if (data.location) {
            // BaseSavedLocation model is responsible for restoring the data structure
            // we'll just merge the restored obj back into the output object
            Object.assign(
                output,
                BaseSavedLocation.restore(
                    data.location,
                    'selectedLocations',
                    'locationDomesticForeign'
                )
            );
        }

        if (data.fundingAgency && data.fundingAgency.length > 0) {
            output.selectedFundingAgencies =
                convertArrayToOrderedMap(data.fundingAgency, (agency) => (
                    `${agency.id}_${agency.agencyType}`
                ));
        }
        if (data.awardingAgency && data.awardingAgency.length > 0) {
            output.selectedAwardingAgencies =
                convertArrayToOrderedMap(data.awardingAgency, (agency) => (
                    `${agency.id}_${agency.agencyType}`
                ));
        }

        if (data.recipients) {
            output.selectedRecipients = new Set(data.recipients);
        }

        if (data.recipientLocation) {
            // BaseSavedLocation model is responsible for restoring the data structure
            // we'll just merge the restored obj back into the output object
            Object.assign(
                output,
                BaseSavedLocation.restore(
                    data.recipientLocation,
                    'selectedRecipientLocations',
                    'recipientDomesticForeign'
                )
            );
        }

        if (data.recipientType) {
            output.recipientType = new Set(data.recipientType);
        }

        if (data.awardIDs) {
            output.selectedAwardIDs = convertArrayToOrderedMap(data.awardIDs, (id) => id);
        }
        if (data.awardAmounts) {
            output.awardAmounts = new OrderedMap(data.awardAmounts);
        }
        if (data.cfda) {
            output.selectedCFDA = convertArrayToOrderedMap(data.cfda, 'identifier');
        }
        if (data.naics) {
            output.selectedNAICS = convertArrayToOrderedMap(data.naics, 'identifier');
        }
        if (data.psc) {
            output.selectedPSC = convertArrayToOrderedMap(data.psc, 'identifier');
        }
        if (data.pricingType) {
            output.pricingType = new Set(data.pricingType);
        }
        if (data.setAside) {
            output.setAside = new Set(data.setAside);
        }
        if (data.extentCompeted) {
            output.extentCompeted = new Set(data.extentCompeted);
        }

        return output;
    }
};

export default BaseSavedFilters;
