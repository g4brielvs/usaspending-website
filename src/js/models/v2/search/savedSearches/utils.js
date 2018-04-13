/**
 * utils.js
 * Created by Kevin Li 4/6/18
 */

import { OrderedMap } from 'immutable';

export function convertArrayToOrderedMap(arr, keyProp) {
    const orderedKeyVals = arr.map((item, index) => (
        [
            item[keyProp] || `${index}`,
            item
        ]
    ));

    return new OrderedMap(orderedKeyVals);
}

export function convertFlatArrayToOrderedMap(arr) {
    const values = arr.map((value) => ([value, value]));
    return new OrderedMap(values);
}
