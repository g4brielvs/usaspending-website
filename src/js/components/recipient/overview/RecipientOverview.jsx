/**
 * RecipientOverview.jsx
 * Created by Kevin Li 4/24/18
 */

import React from 'react';
import PropTypes from 'prop-types';

import BadgeParent from './BadgeParent';
import BadgeChild from './BadgeChild';

import OverviewDetails from './OverviewDetails';
import OverviewAmounts from './OverviewAmounts';

const propTypes = {
    recipient: PropTypes.object
};

const RecipientOverview = (props) => {
    let badge = <BadgeParent />;
    if (!props.recipient.isParent) {
        badge = (
            <BadgeChild
                parentName={props.recipient.parentName || '--'} />
        );
    }

    return (
        <div
            className="overview"
            id="recipient-overview">
            <div className="overview__header">
                <h3 className="overview__title">{props.recipient.name}</h3>
                <hr className="overview__divider" />
                <div className="overview__badge">
                    {badge}
                </div>
            </div>
            <div className="overview__body">
                <div className="overview__amounts">
                    <OverviewAmounts
                        {...props} />
                </div>
                <div className="overview__details">
                    <OverviewDetails {...props} />
                </div>
            </div>
        </div>
    );
};

RecipientOverview.propTypes = propTypes;

export default RecipientOverview;
