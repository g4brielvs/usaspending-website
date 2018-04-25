/**
 * BaseRecipientAmounts.js
 * Created by Kevin Li 4/23/18
 */

import { formatMoney } from 'helpers/moneyFormatter';

const BaseRecipientAmounts = {
    populate(data) {
        this.fy = String(data.fy) || '';
        this._total = Number(data.total) || 0;
        this._average = Number(data.average) || 0;
    },
    get total() {
        return formatMoney(this._total);
    },
    get average() {
        return formatMoney(this._average);
    }
};

export default BaseRecipientAmounts;
