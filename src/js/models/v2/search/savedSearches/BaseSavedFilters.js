/**
 * BaseSavedFilters.js
 * Created by Kevin Li 4/5/18
 */

import { Set, OrderedMap } from 'immutable';
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
    },
    restore(data) {
        const output = {
            keyword: '',
            awardType: [],
            selectedLocations: new OrderedMap(),
            selectedFundingAgencies: new OrderedMap(),
            selectedAwardingAgencies: new OrderedMap(),
            selectedRecipients: new Set()
        };
        if (data.keyword && data.keyword.length > 0) {
            output.keyword = data.keyword[0];
        }

        if (data.timePeriod) {
            // merge the parsed output
            Object.assign(output, BaseSavedTimePeriod.restore(data.timePeriod));
        }

        if (data.awardType && data.awardType.length > 0) {
            output.awardType = new Set(data.awardType);
        }

        if (data.location) {
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
            output.selectedFundingAgencies = convertArrayToOrderedMap(data.fundingAgency);
        }
        if (data.awardingAgency && data.awardingAgency.length > 0) {
            output.selectedAwardingAgencies = convertArrayToOrderedMap(data.awardingAgency);
        }

        if (data.recipients) {
            output.selectedRecipients = new Set(data.recipients);
        }
        if (data.recipientLocation) {
            Object.assign(
                output,
                BaseSavedLocation.restore(
                    data.recipientLocation,
                    'selectedRecipientLocations',
                    'recipientDomesticForeign'
                )
            );
        }

        return output;
    }
};

export default BaseSavedFilters;
