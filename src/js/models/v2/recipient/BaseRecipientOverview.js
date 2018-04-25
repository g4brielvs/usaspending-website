/**
 * BaseRecipientOverview.js
 * Created by Kevin Li 4/23/18
 */

import { getBusinessTypes } from 'helpers/businessTypesHelper';
import CoreLocation from '../CoreLocation';
import BaseRecipientAmounts from './BaseRecipientAmounts';

const businessCategoryMapping = getBusinessTypes()
    .reduce((parsed, type) => Object.assign({}, parsed, {
        [type.fieldName]: type
    }), {});

export const prepareLocation = (data) => ({
    // map the API response to the data structure required to populate a CoreLocation object
    address1: data.address_line1 || '',
    address2: data.address_line2 || '',
    address3: data.address_line3 || '',
    city: data.city_name || '',
    stateCode: data.state_code || '',
    country: data.country_name || '',
    countryCode: data.location_country_code || '',
    zip5: data.zip5 || ''
});

export const parseBusinessCategories = (rawArr) => (
    rawArr.map((rawCategory) => {
        const parsed = businessCategoryMapping[rawCategory];
        if (parsed) {
            return parsed.displayName;
        }
        return rawCategory;
    })
);

const BaseRecipientOverview = {
    populate(data, idField = 'duns') {
        this._idField = idField;
        this.name = data.name || '';
        this.duns = data.duns || '';
        this.parentDuns = data.parent_duns || '';
        this.parentName = data.parent_name || '';

        this.lei = data.lei || '';

        this._businessCategories = data.business_categories || [];
        this.businessCategories = parseBusinessCategories(this._businessCategories);

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
    get isParent() {
        return this.duns === this.parentDuns && this.duns && this.parentDuns;
    }
};

export default BaseRecipientOverview;
