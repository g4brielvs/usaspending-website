/**
 * BaseSavedTimePeriod.js
 * Created by Kevin Li 4/5/18
 */

import { Set } from 'immutable';

const BaseSavedTimePeriod = {
    populate(data) {
        this.type = 'fy';
        this.value = [];
        if (data.timePeriodType) {
            this.type = data.timePeriodType;
        }

        if (this.type === 'fy') {
            this.value = data.timePeriodFY.toArray();
        }
        else {
            this.value = [
                data.timePeriodStart || null,
                data.timePeriodEnd || null
            ];
        }
    },
    restore(data) {
        const output = {
            timePeriodType: data.type || 'fy'
        };

        if (data.type === 'fy') {
            output.timePeriodFY = new Set(data.value);
        }
        else {
            output.timePeriodStart = data.value[0] || null;
            output.timePeriodend = data.value[1] || null;
        }

        return output;
    }
};

export default BaseSavedTimePeriod;
