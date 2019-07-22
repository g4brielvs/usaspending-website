/**
 * ProgramSourceAutocompleteContainer.jsx
 * Created by Lizzie Salita 7/22/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import { isCancel } from 'axios';
import { pickBy, debounce } from 'lodash';

import * as ProgramSourceHelper from 'helpers/programSourceHelper';
import Autocomplete from 'components/sharedComponents/autocomplete/Autocomplete';

const propTypes = {
    component: PropTypes.object,
    selectedSources: PropTypes.object,
    updateComponent: PropTypes.func,
    dirtyFilters: PropTypes.symbol
};

export default class ProgramSourceAutocompleteContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            noResults: false,
            searchString: '',
            autocompleteOptions: []
        };

        this.autocompleteRequest = null;
        this.fetchAutocompleteResults = this.fetchAutocompleteResults.bind(this);
        this.queryAutocompleteDebounced = debounce(this.fetchAutocompleteResults, 300);
        this.handleTextInput = this.handleTextInput.bind(this);
        this.clearAutocompleteSuggestions = this.clearAutocompleteSuggestions.bind(this);
        this.selectSourceComponent = this.selectSourceComponent.bind(this);
    }

    componentWillUnmount() {
        if (this.autocompleteRequest) {
            this.autocompleteRequest.cancel();
        }
        this.queryAutocompleteDebounced.cancel();
    }

    fetchAutocompleteResults(input) {
        if (this.autocompleteRequest) {
            // a request is in-flight, cancel it
            this.autocompleteRequest.cancel();
        }

        this.setState({
            noResults: false
        });

        // Create the filter object from current selections and the input value
        let filters = this.props.selectedSources;
        filters[this.props.component.code] = input;
        // Exclude filters with empty values
        filters = pickBy(filters);

        // create the params
        const params = {
            filters,
            limit: 10
        };

        const helperFunction = `fetch${this.props.component.code.toUpperCase()}s`;
        this.autocompleteRequest = ProgramSourceHelper[helperFunction](params);

        this.autocompleteRequest.promise
            .then((res) => {
                this.parseResults(res.data.results);
            })
            .catch((err) => {
                this.autocompleteRequest = null;
                if (!isCancel(err)) {
                    this.setState({
                        noResults: true
                    });
                    console.log(err);
                }
            });
    }

    parseResults(results) {
        let parsedResults = [];
        if (this.props.component.code === 'aid' || this.props.component.code === 'ata') {
            parsedResults = results.map((agency) => {
                const abbreviation = agency.agency_abbreviation ? ` (${agency.agency_abbreviation})` : '';
                return ({
                    title: agency.aid,
                    subtitle: `${agency.agency_name}${abbreviation}`,
                    data: { code: agency.aid }
                });
            });
        }
        else {
            parsedResults = results.map((option) => ({
                title: option,
                subtitle: '',
                data: { code: option }
            }));
        }
        this.setState({
            autocompleteOptions: parsedResults,
            noResults: parsedResults.length === 0
        });
    }

    selectSourceComponent(selectedSource) {
        this.props.updateComponent(this.props.component.code, selectedSource.code);
    }

    clearAutocompleteSuggestions() {
        this.setState({
            autocompleteOptions: []
        });
    }

    handleTextInput(event) {
        event.persist();
        this.queryAutocompleteDebounced(event.target.value);
    }

    render() {
        const requiredIndicator = this.props.component.required ? (<span className="program-source-select-filter__label-required">Required</span>) : '';
        return (
            <div className="program-source-select-filter">
                <label className="program-source-select-filter__label">
                    {`${this.props.component.label} (${this.props.component.code.toUpperCase()})`}
                    {requiredIndicator}
                </label>
                <Autocomplete
                    values={this.state.autocompleteOptions}
                    handleTextInput={this.handleTextInput}
                    onSelect={this.selectSourceComponent}
                    retainValue
                    dirtyFilters={this.props.dirtyFilters}
                    minCharsToSearch={1}
                    placeholder={`Enter ${this.props.component.code.toUpperCase()} value (${this.props.component.characterLimit} characters)`}
                    errorHeader={`Unknown ${this.props.component.code.toUpperCase()}`}
                    errorMessage={`We were unable to find that ${this.props.component.label}`}
                    ref={(input) => {
                        this.programSourceList = input;
                    }}
                    clearAutocompleteSuggestions={this.clearAutocompleteSuggestions}
                    noResults={this.state.noResults}
                    characterLimit={this.props.component.characterLimit} />
            </div>
        );
    }
}

ProgramSourceAutocompleteContainer.propTypes = propTypes;
