/**
 * ProgramSourceSection.jsx
 * Created by Lizzie Salita 6/6/19
 */

import React from 'react';
import PropTypes from 'prop-types';

import SubmitHint from 'components/sharedComponents/filterSidebar/SubmitHint';
import FederalAccountFilters from './FederalAccountFilters';
import SelectedSources from './SelectedSources';

const propTypes = {
    selectedFederalComponents: PropTypes.object,
    updateFederalAccountComponents: PropTypes.func,
    dirtyFilters: PropTypes.symbol
};

export default class ProgramSourceSection extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // TODO - Lizzie: change to 'treasury' in final version
            activeTab: 'federal',
            federalAccountComponents: {
                aid: '',
                main: ''
            }
        };

        this.toggleTab = this.toggleTab.bind(this);
        this.updateFederalAccountComponent = this.updateFederalAccountComponent.bind(this);
        this.applyFilter = this.applyFilter.bind(this);
        this.removeFilter = this.removeFilter.bind(this);
    }

    componentDidMount() {
        // this.openDefaultTab();
    }

    componentDidUpdate(prevProps) {
        if (this.props.dirtyFilters && prevProps.dirtyFilters !== this.props.dirtyFilters) {
            if (this.hint) {
                this.hint.showHint();
            }
        }
    }

    updateFederalAccountComponent(field, value) {
        // Updates the component state
        const updatedComponents = Object.assign({}, this.state.federalAccountComponents, {
            [field]: value
        });
        this.setState({
            federalAccountComponents: updatedComponents
        });
    }

    // TODO - Lizzie: implement openDefaultTab()
    // to switch to the first tab with a filter already applied

    toggleTab(e) {
        const type = e.target.value;

        this.setState({
            activeTab: type
        });
    }

    applyFilter() {
        if (this.state.activeTab === 'federal') {
            const components = this.state.federalAccountComponents;
            const identifier = `${components.aid}-${components.main}`;
            this.props.updateFederalAccountComponents(identifier);
            // Clear the values after they have been applied
            this.setState({
                federalAccountComponents: {
                    aid: '',
                    main: ''
                }
            });
        }
    }

    removeFilter(identifier) {
        if (this.state.activeTab === 'federal') {
            this.props.updateFederalAccountComponents(identifier);
        }
    }

    render() {
        const activeTab = this.state.activeTab;
        const activeTreasury = activeTab === 'treasury' ? '' : 'inactive';
        const activeFederal = activeTab === 'federal' ? '' : 'inactive';
        const filter = (
            <FederalAccountFilters
                updateComponent={this.updateFederalAccountComponent}
                applyFilter={this.applyFilter}
                components={this.state.federalAccountComponents}
                dirtyFilters={this.props.dirtyFilters} />);

        let selectedSources = null;
        if (activeTab === 'federal' && this.props.selectedFederalComponents) {
            selectedSources = (
                <SelectedSources
                    removeSource={this.removeFilter}
                    selectedSources={this.props.selectedFederalComponents} />);
        }

        return (
            <div className="program-source-filter search-filter">
                <ul
                    className="toggle-buttons"
                    role="menu">
                    <li>
                        <button
                            className={`date-toggle ${activeTreasury}`}
                            value="treasury"
                            role="menuitemradio"
                            aria-checked={this.state.activeTab === 'treasury'}
                            title="Treasury Account"
                            aria-label="Treasury Account"
                            disabled >
                            Treasury Account
                        </button>
                    </li>
                    <li>
                        <button
                            className={`date-toggle ${activeFederal}`}
                            value="federal"
                            role="menuitemradio"
                            aria-checked={this.state.activeTab === 'federal'}
                            title="Federal Account"
                            aria-label="Federal Account"
                            onClick={this.toggleTab}>
                            Federal Account
                        </button>
                    </li>
                </ul>
                <div className="toggle-border" />
                {filter}
                {selectedSources}
                <SubmitHint
                    ref={(component) => {
                        this.hint = component;
                    }} />
            </div>
        );
    }
}

ProgramSourceSection.propTypes = propTypes;
