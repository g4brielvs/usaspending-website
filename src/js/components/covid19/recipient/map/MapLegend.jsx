/**
 * MapLegend.jsx
 * Created by Jonathan Hill 06/24/20
 */

import React from 'react';
import PropTypes from 'prop-types';


const propTypes = {
    units: PropTypes.shape({
        unit: PropTypes.number,
        precision: PropTypes.number,
        unitLabel: PropTypes.string
    }),
    segments: PropTypes.arrayOf(PropTypes.number)
};

const defaultProps = {
    units: {
        unit: 1,
        precision: 0,
        unitLabel: ''
    }
};

function numberWithCommas(x) {
    if (!x) {
        return "";
    }
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const MapLegend = ({ units, segments }) => {

    return (
        <div className="map-legend">
            <ul className="map-legend-body">
                ${numberWithCommas(Math.trunc(segments[0]))}
                <div className="map-legend-gradient" />
                ${numberWithCommas(Math.trunc(segments[segments.length - 1]))}
            </ul>
        </div>
    );
};

MapLegend.propTypes = propTypes;
MapLegend.defaultProps = defaultProps;
export default MapLegend;
