/**
 * InfoTooltip.jsx
 * Created by Lizzie Salita 3/8/19
 */

import React from 'react';
import PropTypes from 'prop-types';

import TooltipWrapper from "../../sharedComponents/TooltipWrapper";

const propTypes = {
    children: PropTypes.node,
    left: PropTypes.bool,
    wide: PropTypes.bool
};

const defaultProps = {
    wide: false
};

const InfoTooltip = ({
    children,
    left,
    wide
}) => (
    <TooltipWrapper left={left} wide={wide} tooltipComponent={children} icon="info" />
);

InfoTooltip.defaultProps = defaultProps;
InfoTooltip.propTypes = propTypes;

export default InfoTooltip;
