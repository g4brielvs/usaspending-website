/**
 * BaseSavedFilters.js
 * Created by Kevin Li 4/5/18
 */

import { Set, OrderedMap } from 'immutable';

import BaseSavedTimePeriod from './BaseSavedTimePeriod';

export function convertArrayToOrderedMap(arr, keyProp) {
    const orderedKeyVals = arr.map((item, index) => (
        [
            item[keyProp] || `${index}`,
            item
        ]
    ));

    return new OrderedMap(orderedKeyVals);
}

const BaseSavedFilters = {
    populate(data) {
        this.keyword = [];
        if (data.keyword) {
            this.keyword = [data.keyword];
        }

        this.timePeriod = Object.create(BaseSavedTimePeriod);
        this.timePeriod.populate(data);

        this.awardType = data.awardType.toArray();

        this.location = data.selectedLocations.toArray();
    },
    restore(data) {
        const output = {
            keyword: '',
            awardType: [],
            selectedLocations: new OrderedMap()
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

        if (data.location && data.location.length > 0) {
            output.selectedLocations = convertArrayToOrderedMap(data.location);
        }

        return output;
    }
};

export default BaseSavedFilters;
