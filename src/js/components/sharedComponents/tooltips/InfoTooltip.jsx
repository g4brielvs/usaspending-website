import React from 'react';
import PropTypes from 'prop-types';
import { TooltipWrapper } from 'data-transparency-ui';

const propTypes = {
    children: PropTypes.node,
    left: PropTypes.bool,
    wide: PropTypes.bool,
    icon: PropTypes.string,
    controlledProps: PropTypes.shape({
        isControlled: PropTypes.bool,
        showTooltip: PropTypes.func,
        closeTooltip: PropTypes.func,
        isVisible: PropTypes.bool
    }),
    offsetAdjustments: PropTypes.shape({
        top: PropTypes.number,
        right: PropTypes.number,
        left: PropTypes.number
    }),
    styles: PropTypes.object
};


export const InfoTooltip = (props) => (
    <TooltipWrapper tooltipComponent={props.children} {...props} icon="info" />
);

InfoTooltip.propTypes = propTypes;
