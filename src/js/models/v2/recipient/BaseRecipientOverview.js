/**
 * BaseRecipientOverview.js
 * Created by Kevin Li 4/23/18
 */

import { recipientTypes } from 'dataMapping/search/recipientType';
import CoreLocation from '../CoreLocation';
import BaseRecipientAmounts from './BaseRecipientAmounts';

export const prepareLocation = (data) => ({
    // map the API response to the data structure required to populate a CoreLocation object
    address1: data.address_line1 || '',
    address2: data.address_line2 || '',
    address3: data.address_line3 || '',
    city: data.city_name || '',
    stateCode: data.state_code || '',
    country: data.country_name || '',
    countryCode: data.location_country_code || '',
    zip5: data.zip5 || '',
    congressionalDistrict: data.congressional_code || ''
});

const BaseRecipientOverview = {
    populate(data, idField = 'duns') {
        this._idField = idField;
        this.name = data.name || '';
        this.duns = data.duns || '';
        this.parentDuns = data.parent_duns || '';
        this.parentName = data.parent_name || '';

        this.lei = data.lei || '';

        this._businessTypeDescription = data.business_types_description || '';
        this._businessCategories = data.business_categories || [];

        this.location = Object.create(CoreLocation);
        if (data.location) {
            this.location.populateCore(prepareLocation(data.location));
        }
        else {
            this.location.populateCore({});
        }

        this.amounts = Object.create(BaseRecipientAmounts);
        if (data.amounts) {
            this.amounts.populate(data.amounts);
        }
        else {
            this.amounts.populate({});
        }
    },
    get id() {
        return this[this._idField];
    },
    get businessCategories() {
        if (this._businessTypeDescription) {
            return [this._businessTypeDescription];
        }

        return this._businessCategories.map((apiValue) => recipientTypes[apiValue] || apiValue);
    },
    get isParent() {
        return !this.parentDuns || this.duns === this.parentDuns;
    }
};

export default BaseRecipientOverview;
