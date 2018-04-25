/**
 * OverviewParentCell.jsx
 * Created by Kevin Li 4/25/18
 */

import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    parentName: PropTypes.string,
    parentDuns: PropTypes.string
};

const OverviewParentCell = (props) => (
    <div className="overview-parent">
        <div className="overview-parent__name">
            {props.parentName || '--'}
        </div>
        <div className="overview-parent__duns-label">
            Parent DUNS Number
        </div>
        <div className="overview-details__duns">
            {props.parentDuns || '--'}
        </div>
    </div>
);

OverviewParentCell.propTypes = propTypes;

export default OverviewParentCell;
