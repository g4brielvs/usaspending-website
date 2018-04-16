/**
 * utils.js
 * Created by Kevin Li 4/6/18
 */

import { OrderedMap } from 'immutable';

export function convertArrayToOrderedMap(arr, keyProp) {
    const orderedKeyVals = arr.map((item, index) => {
        let id = String(index);
        if (keyProp && typeof keyProp === 'string') {
            // string key was provided use that
            id = item[keyProp] || String(index);
        }
        else if (keyProp && typeof keyProp === 'function') {
            // function was provided as the key
            const resolvedId = keyProp(item, index);
            id = resolvedId || String(index);
        }

        return (
            [
                id,
                item
            ]
        );
    });

    return new OrderedMap(orderedKeyVals);
}
