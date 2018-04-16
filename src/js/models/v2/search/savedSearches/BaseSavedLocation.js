/**
 * BaseSavedLocationFilter.js
 * Created by Kevin Li 4/6/18
 */

import { convertArrayToOrderedMap } from './utils';

const BaseSavedLocation = {
    populate(data, type) {
        this.location = data.toArray();
        this.type = type || 'all';
    },
    restore(data, ...names) {
        return {
            [names[0]]: convertArrayToOrderedMap(data.location, 'identifier'),
            [names[1]]: data.type || 'all'
        };
    }
};

export default BaseSavedLocation;
