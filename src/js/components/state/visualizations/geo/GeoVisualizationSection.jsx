/**
 * GeoVisualizationSection.jsx
 * Created by Lizzie Salita 5/14/18
 */

import React from 'react';
import PropTypes from 'prop-types';

import LoadingSpinner from 'components/sharedComponents/LoadingSpinner';
import { ExclamationTriangle } from 'components/sharedComponents/icons/Icons';

import GeoVisualizationTooltip from 'components/search/visualizations/geo/GeoVisualizationTooltip';
import MapMessage from 'components/search/visualizations/geo/MapMessage';
import MapWrapper from './MapWrapper';

const propTypes = {
    scope: PropTypes.string,
    mapLayer: PropTypes.string,
    changeScope: PropTypes.func,
    changeMapLayer: PropTypes.func,
    mapMoved: PropTypes.func,
    renderHash: PropTypes.string,
    data: PropTypes.object,
    total: PropTypes.number,
    loading: PropTypes.bool,
    error: PropTypes.bool,
    noResults: PropTypes.bool
};

const availableLayers = ['county', 'congressionalDistrict'];

export default class GeoVisualizationSection extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showHover: false,
            selectedItem: {}
        };

        this.showTooltip = this.showTooltip.bind(this);
        this.hideTooltip = this.hideTooltip.bind(this);
    }

    showTooltip(geoId, position) {
        // convert state code to full string name
        const label = this.props.data.labels[geoId];
        this.setState({
            showHover: true,
            selectedItem: {
                label: label.label,
                total: this.props.total,
                value: label.value,
                x: position.x,
                y: position.y
            }
        });
    }

    hideTooltip() {
        this.setState({
            showHover: false,
            selectedItem: {}
        });
    }

    render() {
        let message = null;
        if (this.props.loading) {
            message = (
                <MapMessage>
                    <div className="map-loading">
                        <LoadingSpinner />
                        <div className="loading-message">
                            Gathering your data...
                        </div>
                    </div>
                </MapMessage>
            );
        }
        else if (this.props.error) {
            message = (
                <MapMessage>
                    <div className="map-no-results">
                        <div className="error-icon">
                            <ExclamationTriangle alt="An error occurred" />
                        </div>
                        <div className="title">
                            An error occurred.
                        </div>
                        <div className="description">
                            Something went wrong while gathering your data.
                        </div>
                    </div>
                </MapMessage>
            );
        }
        else if (this.props.noResults) {
            message = (
                <MapMessage>
                    <div className="map-no-results">
                        <div className="no-results-icon" />
                        <div className="title">
                            No results found in the current map area.
                        </div>
                    </div>
                </MapMessage>
            );
        }

        return (
            <div className="geo__map-section">
                <MapWrapper
                    data={this.props.data}
                    renderHash={this.props.renderHash}
                    scope={this.props.mapLayer}
                    changeMapLayer={this.props.changeMapLayer}
                    showHover={this.state.showHover}
                    selectedItem={this.state.selectedItem}
                    showTooltip={this.showTooltip}
                    hideTooltip={this.hideTooltip}
                    tooltip={GeoVisualizationTooltip}
                    availableLayers={availableLayers}
                    showLayerToggle>
                    {message}
                </MapWrapper>
            </div>
        );
    }
}

GeoVisualizationSection.propTypes = propTypes;
