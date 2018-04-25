/**
 * OverviewDetails.jsx
 * Created by Kevin Li 4/24/18
 */

import React from 'react';
import PropTypes from 'prop-types';

import OverviewParentCell from './OverviewParentCell';

const propTypes = {
    isParent: PropTypes.bool
};

const rowTypes = [
    {
        label: 'Parent Recipient',
        value(data) {
            return (
                <OverviewParentCell
                    {...data} />
            );
        }
    },
    {
        label: 'DUNS',
        value(data) {
            return data.duns;
        }
    },
    {
        label: 'Address',
        value(data) {
            return data.location.fullAddress;
        }
    },
    {
        label: 'Business Types',
        value(data) {
            return data.businessCategories.map((category, index) => (
                <div
                    className="overview-details__value-item"
                    key={data._businessCategories[index]}>
                    {category}
                </div>
            ));
        }
    }
];

const excludedIndices = [0];

const OverviewDetails = (props) => {
    const rows = rowTypes.reduce((relevantRows, row, index) => {
        const rowComponent = (
            <div
                className="overview-details__row"
                key={row.label}>
                <div className="overview-details__label">
                    {row.label}
                </div>
                <div className="overview-details__value">
                    {row.value(props)}
                </div>
            </div>
        );

        if (!props.isParent) {
            // non-parents include every row
            relevantRows.push(rowComponent);
            return relevantRows;
        }
        if (excludedIndices.indexOf(index) === -1) {
            // leave out excluded rows for parent entities
            relevantRows.push(rowComponent);
        }
        return relevantRows;
    }, []);

    return (
        <div className="overview-details">
            {rows}
        </div>
    );
};

OverviewDetails.propTypes = propTypes;

export default OverviewDetails;
