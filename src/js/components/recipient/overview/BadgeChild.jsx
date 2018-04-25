/**
 * BadgeChild.jsx
 * Created by Kevin Li 4/25/18
 */

import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    parentName: PropTypes.string
};

const BadgeChild = (props) => (
    <div className="child-badge">
        This recipient is a subsidiary of <span className="child-badge__parent">{props.parentName}</span>.
    </div>
);

BadgeChild.propTypes = propTypes;

export default BadgeChild;
