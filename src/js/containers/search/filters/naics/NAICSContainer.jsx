/**
  * NAICSSearchContainer.jsx => NAICSContainer.jsx
  * Created by Emily Gullo 07/10/2017
  **/

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    debounce
} from 'lodash';
import { isCancel } from 'axios';
import CheckboxTree from 'containers/shared/checkboxTree/CheckboxTree';
import { naicsRequest } from 'helpers/naicsHelper';
import { expandAllNodes, getImmediateAncestorNaicsCode, getHighestAncestorNaicsCode } from 'helpers/checkboxTreeHelper';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { updateNaics } from 'redux/actions/search/searchFilterActions';
import { setNaics, setExpanded, setChecked, setSearchedNaics, addChecked, showNaicsTree, addUnchecked, setUnchecked, removeChecked } from 'redux/actions/search/naicsActions';
import { EntityDropdownAutocomplete } from 'components/search/filters/location/EntityDropdownAutocomplete';
import SelectedNaic from 'components/search/filters/naics/SelectNaic';

const propTypes = {
    setNaics: PropTypes.func,
    setExpanded: PropTypes.func,
    setChecked: PropTypes.func,
    removeNAICS: PropTypes.func,
    setSearchedNaics: PropTypes.func,
    addChecked: PropTypes.func,
    showNaicsTree: PropTypes.func,
    addUnchecked: PropTypes.func,
    setUnchecked: PropTypes.func,
    removeChecked: PropTypes.func,
    expanded: PropTypes.arrayOf(PropTypes.string),
    checked: PropTypes.arrayOf(PropTypes.string),
    unchecked: PropTypes.arrayOf(PropTypes.string),
    nodes: PropTypes.arrayOf(PropTypes.object),
    searchExpanded: PropTypes.arrayOf(PropTypes.string)
};

export class NAICSContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isError: false,
            errorMessage: '',
            isLoading: false,
            isSearch: false,
            searchString: '',
            requestType: 'initial',
            selectedNaicsData: []
        };
        this.request = null;
    }

    componentDidMount() {
        // show staged filters
        return this.fetchNAICS();
    }

    onSearchChange = debounce(() => {
        if (!this.state.searchString) return this.onClear();
        return this.setState({ requestType: 'search' }, this.fetchNAICS);
    }, 500);

    onClear = () => {
        if (this.request) this.request.cancel();
        this.props.showNaicsTree();
        this.setState({
            isSearch: false,
            searchString: '',
            isLoading: false,
            requestType: ''
        });
    }

    onCheck = async (arrayOfCheckedValues, node, isHalfCheck = false) => {
        const { checked, unchecked } = this.props;
        const { value } = node;
        const parentKey = getHighestAncestorNaicsCode(value);
        const ancestorKey = getImmediateAncestorNaicsCode(value);

        if (isHalfCheck) {
            console.log("HALF CHECK");
            const newUnchecked = unchecked
                // clear all unchecked values of every level with prefix of value ie 11/1111 etc...
                .filter((uncheck) => !uncheck.includes(value));
            this.props.setUnchecked(newUnchecked);
        }
        else if (unchecked.includes(parentKey)) {
            const newUnchecked = unchecked
                .filter((item) => item !== parentKey);
            this.props.setUnchecked(newUnchecked);
        }
        else if (unchecked.includes(ancestorKey) && value.length === 6) {
            console.log("mess");
            // EDGE CASE #1:
            // Adding grand child w/o removing the ancestor from unchecked b/c doing so will add all grandchildren.
            // Cleaning this up below.
            this.props.addChecked(value);
        }
        else if (unchecked.includes(ancestorKey)) {
            const newUnchecked = unchecked
                .filter((item) => item !== ancestorKey);
            this.props.setUnchecked(newUnchecked);
        }
        else if (unchecked.includes(value)) {
            const newUnchecked = unchecked
                .filter((item) => item !== value);
            this.props.setUnchecked(newUnchecked);
        }
        // cleaning up edge case #1: pt 1 - User re-adds child-level ancestor
        else if (value.length === 4 && checked.some((check) => check.split(value).length > 1)) {
            console.log("clean up");
            // const newChecked = checked
            //     .filter((check) => {
            //         if (check.length === 6 && check.includes(value)) {
            //             return false;
            //         }
            //         return true;
            //     });
            // this.props.setChecked(newChecked);
        }
        if (checked.includes(parentKey) || checked.includes(ancestorKey)) {
            return;
        }
        this.props.addChecked(value);
    }

    onUncheck = (newCheckedArray, node) => {
        const { checked } = this.props;
        const parentKey = getHighestAncestorNaicsCode(node.value);
        const ancestorKey = getImmediateAncestorNaicsCode(node.value);
        if (node.value.length === 2) {
            const newChecked = checked
                .filter((item) => item !== node.value);
            this.props.setChecked(newChecked);
        }
        else if (node.value.length === 4) {
            if (checked.includes(parentKey)) {
                this.props.addUnchecked(node.value);
            }
            else if (checked.includes(node.value)) {
                const newChecked = checked
                    .filter((item) => item !== node.value);
                this.props.setChecked(newChecked);
            }
        }
        else if (node.value.length === 6) {
            if (checked.includes(parentKey)) {
                this.props.addUnchecked(node.value);
            }
            else if (checked.includes(ancestorKey)) {
                this.props.addUnchecked(node.value);
            }
            else if (checked.includes(node.value)) {
                const newChecked = checked
                    .filter((item) => item !== node.value);
                this.props.setChecked(newChecked);
            }
        }
        // A grandchild element is stuck in the checked state due to edge case #1; clear it.
        if (checked.some((check) => check.split(node.value).length > 1)) {
            const newChecked = checked
                .filter((item) => !item.includes(node.value));
            this.props.setChecked(newChecked);
        }
    }

    onExpand = (value, expanded, fetch) => {
        if (fetch) this.fetchNAICS(value);
        if (this.state.isSearch) {
            this.props.setExpanded(expanded, 'SET_SEARCHED_EXPANDED');
        }
        else {
            this.props.setExpanded(expanded);
        }
    };

    onCollapse = (expanded) => {
        if (this.state.isSearch) {
            this.props.setExpanded(expanded, 'SET_SEARCHED_EXPANDED');
        }
        else {
            this.props.setExpanded(expanded);
        }
    };

    handleTextInputChange = (e) => {
        const text = e.target.value;
        if (!text) {
            return this.onClear();
        }
        return this.setState({ searchString: text, isSearch: true }, this.onSearchChange);
    };

    fetchNAICS = async (param = '') => {
        if (this.request) this.request.cancel();
        const { requestType, isSearch, searchString } = this.state;
        const searchParam = (isSearch && searchString)
            ? `?filter=${searchString}`
            : null;
        if (requestType === 'initial' || requestType === 'search') {
            this.setState({ isLoading: true });
        }

        this.request = naicsRequest(param || searchParam);

        try {
            const { data } = await this.request.promise;

            if (isSearch) {
                const visibleNaicsValues = expandAllNodes(data.results, 'naics');
                this.props.setSearchedNaics(data.results);
                this.props.setExpanded(visibleNaicsValues, 'SET_SEARCHED_EXPANDED');
            }
            else {
                this.props.setNaics(param, data.results);
            }

            this.setState({
                isLoading: false,
                isError: false,
                errorMessage: '',
                requestType: ''
            });
        }
        catch (e) {
            console.log(' Error NAICS Reponse : ', e);
            if (!isCancel(e)) {
                this.setState({
                    isError: true,
                    errorMessage: e.message,
                    isLoading: false,
                    requestType: ''
                });
            }
        }
        this.request = null;
    };

    loadingDiv = () => {
        if (!this.state.isLoading) return null;
        return (
            <div className="naics-filter-message-container">
                <FontAwesomeIcon icon="spinner" spin />
                <div className="naics-filter-message-container__text">Loading your data...</div>
            </div>
        );
    }

    errorDiv = () => {
        const { isError, errorMessage } = this.state;
        if (!isError) return null;
        return (
            <div className="naics-filter-message-container">
                <div className="naics-filter-message-container__text">
                    {errorMessage}
                </div>
            </div>
        );
    }

    noResultsDiv = () => {
        const { isError, isLoading } = this.state;
        if (isError || isLoading || this.props.nodes.length > 0) return null;
        return (
            <div className="naics-filter-message-container">
                <FontAwesomeIcon icon="ban" />
                <div className="naics-filter-message-container__text">
                    No Results
                </div>
            </div>
        );
    }

    checkboxDiv() {
        const {
            isLoading,
            isError,
            searchString,
            isSearch
        } = this.state;
        const {
            checked,
            nodes,
            expanded,
            searchExpanded,
            unchecked
        } = this.props;
        if (isLoading || isError) return null;
        return (
            <CheckboxTree
                limit={3}
                data={nodes}
                unchecked={unchecked}
                expanded={isSearch ? searchExpanded : expanded}
                checked={checked}
                searchText={searchString}
                onExpand={this.onExpand}
                onCollapse={this.onCollapse}
                onUncheck={this.onUncheck}
                onCheck={this.onCheck} />
        );
    }

    render() {
        const loadingDiv = this.loadingDiv();
        const noResultsDiv = this.noResultsDiv();
        const errorDiv = this.errorDiv();
        const { searchString, selectedNaicsData } = this.state;
        return (
            <div>
                <div className="naics-search-container">
                    <EntityDropdownAutocomplete
                        placeholder="Type to find codes"
                        searchString={searchString}
                        enabled
                        openDropdown={this.onSearchClick}
                        toggleDropdown={this.toggleDropdown}
                        handleTextInputChange={this.handleTextInputChange}
                        context={{}}
                        loading={false}
                        handleOnKeyDown={this.handleOnKeyDown}
                        isClearable
                        onClear={this.onClear} />
                    {loadingDiv}
                    {noResultsDiv}
                    {errorDiv}
                    {this.checkboxDiv()}
                    {this.props.checked.length !== 0 && selectedNaicsData.length !== 0 && (
                        <SelectedNaic
                            selectedNAICS={selectedNaicsData}
                            removeNAICS={this.props.removeNAICS} />
                    )}
                </div>
            </div>
        );
    }
}

NAICSContainer.propTypes = propTypes;

export default connect(
    (state) => ({
        nodes: state.naics.naics.toJS(),
        expanded: state.naics.expanded.toJS(),
        searchExpanded: state.naics.searchExpanded.toJS(),
        checked: state.naics.checked.toJS(),
        unchecked: state.naics.unchecked.toJS()
    }),
    (dispatch) => ({
        updateNaics: (checked) => dispatch(updateNaics(checked)),
        setNaics: (key, naics) => dispatch(setNaics(key, naics)),
        setExpanded: (expanded, type) => dispatch(setExpanded(expanded, type)),
        setChecked: (checkedNodes) => dispatch(setChecked(checkedNodes)),
        addChecked: (newCheckedNode) => dispatch(addChecked(newCheckedNode)),
        setSearchedNaics: (nodes) => dispatch(setSearchedNaics(nodes)),
        showNaicsTree: () => dispatch(showNaicsTree()),
        addUnchecked: (naicsCode) => dispatch(addUnchecked(naicsCode)),
        setUnchecked: (unchecked) => dispatch(setUnchecked(unchecked)),
        removeChecked: (excludedNodes) => dispatch(removeChecked(excludedNodes))
    }))(NAICSContainer);
