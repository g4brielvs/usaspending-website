/**
 * OverviewAmounts.jsx
 * Created by Kevin Li 4/25/18
 */

import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    amounts: PropTypes.object
};

const OverviewAmounts = (props) => (
    <div className="overview-amounts">
        <div className="overview-amounts__total">
            <div className="overview-amounts__label">
                Amount Awarded for FY {props.amounts.fy}
            </div>
            <div className="overview-amounts__hero-value">
                {props.amounts.total}
            </div>
        </div>
        <div className="overview-amounts__average">
            <div className="overview-amounts__label">
                Average Award Size
            </div>
            <div className="overview-amounts__value">
                {props.amounts.average}
            </div>
        </div>
    </div>
);

OverviewAmounts.propTypes = propTypes;

export default OverviewAmounts;
