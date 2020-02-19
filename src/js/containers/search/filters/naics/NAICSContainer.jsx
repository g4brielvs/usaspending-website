/**
  * NAICSSearchContainer.jsx => NAICSContainer.jsx
  * Created by Emily Gullo 07/10/2017
  **/

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    debounce,
    get,
    cloneDeep,
    clone,
    uniq,
    isEqual,
    difference,
    set
} from 'lodash';
import CheckboxTree from 'containers/shared/checkboxTree/CheckboxTree';
import { naicsRequest } from 'helpers/naicsHelper';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { updateNaics } from 'redux/actions/search/searchFilterActions';
import { setNaics, setExpanded, setChecked } from 'redux/actions/search/naicsActions';
import { EntityDropdownAutocomplete } from 'components/search/filters/location/EntityDropdownAutocomplete';
import SelectedNaic from 'components/search/filters/naics/SelectNaic';
import {
    pathToNode,
    buildNodePath,
    createCheckboxTreeDataStrucure,
    updatePathsFromSearch,
    countFromSearch,
    cleanCheckedValues,
    deepestChildValues
} from 'helpers/checkboxTreeHelper';

const propTypes = {
    updateNaics: PropTypes.func,
    setNaics: PropTypes.func,
    setExpanded: PropTypes.func,
    setChecked: PropTypes.func,
    nodes: PropTypes.object,
    expanded: PropTypes.object,
    checked: PropTypes.object
};

const nodeKeys = {
    value: 'naics',
    label: 'naics_description'
};

export class NAICSContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            naics: [],
            expanded: [],
            checked: [],
            isError: false,
            errorMessage: '',
            isLoading: false,
            isSearch: false,
            searchString: '',
            requestType: 'initial',
            selectedNaicsData: []
        };
    }

    componentDidMount() {
        const { nodes, expanded, checked } = this.props;
        if (nodes.size > 0) {
            return this.setStateFromRedux(nodes, expanded, checked);
        }
        // show staged filters
        // this.selectNaicsData();
        return this.fetchNAICS();
    }

    componentDidUpdate(prevProps) {
        if (
            !isEqual(this.props.checked.toJS(), prevProps.checked.toJS())
            || !isEqual(this.props.nodes.toJS(), prevProps.nodes.toJS())
        ) {
            // show stage filters
            // this.selectNaicsData();
        }
    }

    onSearchChange = debounce(() => {
        if (!this.state.searchString) return this.onClear();
        return this.setState({ requestType: 'search' }, this.fetchNAICS);
    }, 500);

    onClear = () => {
        const { nodes, expanded, checked } = this.props;
        if (this.request) this.request.cancel();
        this.setState({
            isSearch: false,
            searchString: '',
            naics: nodes.toJS(),
            expanded: expanded.toJS(),
            checked: checked.toJS(),
            isLoading: false,
            requestType: ''
        });
    }

    onExpand = (value, expanded, fetch) => {
        if (fetch) this.fetchNAICS(value);
        this.props.setExpanded(expanded);
    };

    onCollapse = (expanded) => {
        this.props.setExpanded(expanded);
    };
    /**
     * onCheck
     * - updates redux checked and updates naics search filters in redux
     * @param {string[]} checked - and array of checked values
     * @returns {null}
     */
    onCheck = async (checked) => {
        const newCheckedValues = difference(checked, this.props.checked.toJS());
        // we will now update the counts
        if (newCheckedValues.length) {
            this.addToCounts(newCheckedValues);
        }
        else {
            this.subtractFromCounts(difference(this.props.checked.toJS(), checked));
        }

        let currentlyChecked = clone(this.props.checked.toJS());
        currentlyChecked = uniq(checked);
        if (this.state.isSearch) currentlyChecked = uniq(currentlyChecked.concat(newCheckedValues));
        if (newCheckedValues.length && this.state.isSearch) {
            const nodes = this.addNodeFromSearch(newCheckedValues);
            const updatedCheckedValues = clone(currentlyChecked);
            currentlyChecked.forEach((checkedValue) => {
                /**
                 * Sometimes we will encounter when a user will have expanded nodes in the default tree
                 * and we will not add the search node to the default tree since we already have that node's
                 * data. If a user selects that node in the search view and it is not checked in the default view
                 * we must still keep that checked node.
                 */
                if (checkedValue.includes('placeholderForSearch')) {
                    const cleanValue = cleanCheckedValues([checkedValue])[0];
                    // get this node
                    const { path: nodePath } = pathToNode(nodes, cleanValue);
                    const stringPath = buildNodePath(nodePath);
                    const node = get({ data: nodes }, stringPath);
                    const allChildren = deepestChildValues(node.children);
                    const nodeValueIndex = updatedCheckedValues.findIndex((val) => val === checkedValue);
                    updatedCheckedValues.splice(nodeValueIndex, 1, ...allChildren);
                }
            });
            currentlyChecked = uniq(updatedCheckedValues);
            /**
             * When a user has checked a node in the default view and we do not have all
             * the data for that node and a user checked the same node in search we must
             * account for have that node's child placeholder and search placeholder.
             * Since we do not have all the data for the node, we will add the search node
             * to the data array so we will keep the search checked value.
             */            
            currentlyChecked = updatedCheckedValues.filter((checkedValue) => {
                if (checkedValue.includes('childPlaceholder') || checkedValue.includes('placeholderForSearch')) {
                    const { path: nodeExists } = pathToNode(nodes, checkedValue);
                    if (nodeExists) return true;
                    return false;
                }
                return true;
            });
        }
        // sets checked in naics redux
        await this.props.setChecked(uniq(currentlyChecked));
        // sets staged filters in search redux
        await this.props.updateNaics(uniq(currentlyChecked));
    }

    setRedux = (naics) => this.props.setNaics(naics);

    setStateFromRedux = (naics, expanded, checked) => {
        this.setState({
            naics: naics.toJS(),
            expanded: expanded.toJS(),
            checked: checked.toJS(),
            requestType: ''
        });
    }
    addToCounts = (newSelectedValues) => {
        const { selectedNaicsData, naics } = this.state;
        const nodes = this.state.isSearch
            ? cloneDeep(naics)
            : cloneDeep(this.props.nodes.toJS());
        if (this.state.isSearch) {
            newSelectedValues.sort((a, b) => {
                if (a.includes('placeholderForSearch') && b.includes('placeholderForSearch')) {
                    return a.length - b.length;
                }
                return b.length - a.length;
            });
        }
        const updatedCounts = newSelectedValues.reduce((acc, selectedValue) => {
            // 1. Get Node & Parent Data
            const cleanValue = cleanCheckedValues([selectedValue])[0];
            const { path: nodePath } = pathToNode(nodes, cleanValue);
            if (!nodePath) return acc;
            const parentNodePath = [nodePath[0]];
            // accessing the tier 0 parent node
            const parentNodePathString = buildNodePath(parentNodePath);
            const parentNode = get({ data: nodes }, parentNodePathString);
            // accessing the selected node
            const nodePathString = buildNodePath(nodePath);
            const node = get({ data: nodes }, nodePathString);
            // 2. Find if the Parent Data is in selected data already
            const selectedDataIndex = acc.findIndex((data) => data.value === parentNode.value);
            // 3. If it exists increment count
            if (selectedDataIndex !== -1) {
                if (this.state.isSearch) {
                    acc[selectedDataIndex].count += countFromSearch(node, nodes, newSelectedValues);
                    return acc;
                }
                if (node.count === 0) { // node has no count, add one
                    acc[selectedDataIndex].count++;
                }
                else {
                    acc[selectedDataIndex].count += node.count;
                }
                return acc;
            }
            // 4. If not create it
            if (node.count === 0) {
                parentNode.count = 1;
                acc.push(parentNode);
            }
            else {
                parentNode.count = node.count;
                acc.push(parentNode);
            }
            return acc;
        }, selectedNaicsData);
        this.setState({ selectedNaicsData: updatedCounts });
    }
    subtractFromCounts = (unselectedValues) => {
        const { selectedNaicsData, naics } = this.state;
        const nodes = this.state.isSearch
            ? cloneDeep(naics)
            : cloneDeep(this.props.nodes.toJS());
        if (this.state.isSearch) {
            unselectedValues.sort((a, b) => {
                if (a.includes('placeholderForSearch') && b.includes('placeholderForSearch')) {
                    return a.length - b.length;
                }
                return b.length - a.length;
            });
        }
        const updatedCounts = unselectedValues.reduce((acc, selectedValue) => {
            // 1. Get Node & Parent Data
            const cleanValue = cleanCheckedValues([selectedValue])[0];
            const { path: nodePath } = pathToNode(nodes, cleanValue);
            if (!nodePath) return acc;
            const parentNodePath = [nodePath[0]];
            // accessing the tier 0 parent node
            const parentNodePathString = buildNodePath(parentNodePath);
            const parentNode = get({ data: nodes }, parentNodePathString);
            // accessing the selected node
            const nodePathString = buildNodePath(nodePath);
            const node = get({ data: nodes }, nodePathString);
            // 2. Find if the Parent Data is in selected data already
            const selectedDataIndex = acc.findIndex((data) => data.value === parentNode.value);
            // 3. If it exists increment count
            if (selectedDataIndex !== -1) {
                if (this.state.isSearch) {
                    acc[selectedDataIndex].count -= countFromSearch(node, nodes, unselectedValues);
                    return acc;
                }
                if (node.count === 0) { // node has no count, add one
                    acc[selectedDataIndex].count--;
                }
                else {
                    acc[selectedDataIndex].count -= node.count;
                }
                // if we go to zero, remove it from selected data
                if (acc[selectedDataIndex].count === 0) acc.splice(selectedDataIndex, 1);
                return acc;
            }
            return acc;
        }, selectedNaicsData);
        this.setState({ selectedNaicsData: updatedCounts });
    }

    addNodeFromSearch = (values) => {
        const nodes = cloneDeep(this.props.nodes.toJS());
        const nodesDataObject = { data: nodes };
        // remove fake search children
        const filteredValues = values.filter((value) => !value.includes('placeholderForSearch'));
        filteredValues.forEach((value) => {
            // we are checking if the node exists in Redux
            const { path: pathToNodeRedux } = pathToNode(nodes, value);
            // this is the current path from the the search state
            const { path: pathToNodeState } = pathToNode(this.state.naics, value);
            if (!pathToNodeRedux) {
                // find where to add node by stepping through node path
                /**
                 * Here we walk through the node path backwards, which allows to traverse
                 * the tree data structure upwards, to find the first node we do not have in redux
                 * and then replace that node with the search nodes and children
                 * e.g. Given a sample node path of [0, 7, 1] we will look to see if we have
                 * node [0, 7] and if we do we will put that now in its place in Redux store,
                 * and if not we will try [0], which we should always have top tier data.
                 */
                let foundIt = null;
                let theOldObjectFromState = null;
                let theOldPathToRedux = [];
                pathToNodeState.forEach((path, index, array) => {
                    /**
                     * step through node path e.g. the original node path will be [0, 7, 1]
                     * then the first iteration will be [0, 7]
                     */
                    if (foundIt) return;
                    const pathArrayStateSubset = pathToNodeState.slice(0, array.length - (array.length - (index + 1)));
                    const pathStringStateSubset = buildNodePath(pathArrayStateSubset);
                    const theNodeToAddFromState = get({ data: this.state.naics }, pathStringStateSubset);
                    // See if the node exists in redux
                    const { path: newPathToNodeRedux } = pathToNode(nodes, theNodeToAddFromState.value);
                    if (!newPathToNodeRedux) {
                        foundIt = true;
                        // get the node in redux that we will be replacing for the path property
                        const valueOfNodeInRedux = theOldObjectFromState.value;
                        const { path: pathInRedux } = pathToNode(nodes, valueOfNodeInRedux);
                        const pathString = buildNodePath(pathInRedux);
                        const currentPath = get(nodesDataObject, pathString).path;
                        /**
                         * We need to update all children's path.
                         */
                        const objectToUse = updatePathsFromSearch(theOldObjectFromState, currentPath);
                        // we need to go back one and set that object
                        const oldPathStringToRedux = buildNodePath(theOldPathToRedux);
                        set(nodesDataObject, oldPathStringToRedux, objectToUse);
                    }
                    else {
                        theOldObjectFromState = theNodeToAddFromState;
                        theOldPathToRedux = newPathToNodeRedux;
                    }
                });
                this.props.setNaics(nodes);
            }
        });
        return nodes;
    }
    handleTextInputChange = (e) => {
        const text = e.target.value;
        if (!text) {
            return this.onClear();
        }
        return this.setState({ searchString: text, isSearch: true }, this.onSearchChange);
    };

    request = null

    fetchNAICS = async (param) => {
        if (this.request) this.request.cancel();
        const {
            requestType,
            isSearch,
            searchString
        } = this.state;
        const searchParam = (isSearch && searchString)
            ? `?filter=${searchString}`
            : null;
        if (requestType === 'initial' || requestType === 'search') {
            this.setState({ isLoading: true });
        }

        this.request = naicsRequest(param || searchParam);
        try {
            const { data } = await this.request.promise;
            // create the new node
            const updatedNodes = isSearch ? createCheckboxTreeDataStrucure(
                3,
                nodeKeys,
                data.results,
                null,
                null,
                true
            ) : data.results;

            this.setState({
                naics: updatedNodes,
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
                    naics: this.props.nodes.toJS(),
                    isLoading: false,
                    requestType: ''
                });
            }
        }
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
        const { isError, isLoading, naics } = this.state;
        if (isError || isLoading || naics.length > 0) return null;
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
            isSearch,
            naics,
            expanded,
            searchString
        } = this.state;
        const { checked } = this.props;
        if (isLoading || isError) return null;
        return (
            <CheckboxTree
                limit={3}
                data={naics}
                expanded={expanded}
                checked={checked.toJS()}
                nodeKeys={nodeKeys}
                isSearch={isSearch}
                searchText={searchString}
                onExpand={this.onExpand}
                onCollapse={this.onCollapse}
                onCheck={this.onCheck}
                setRedux={this.setRedux}
                updateRedux={this.setRedux} />
        );
    }

    removeCheckedValues = (node) => {
        console.log(' Value : ', node);
        const nodes = this.state.isSearch
            ? cloneDeep(this.state.naics)
            : cloneDeep(this.props.nodes.toJS());
        const checkedValues = this.props.checked.toJS();
        const { path } = pathToNode(nodes, node.value);
        const pathString = buildNodePath(path);
        const theNode = get({ data: nodes }, pathString);
        let valuesToRemove = [theNode.value];
        if (theNode.children) {
            valuesToRemove = uniq(deepestChildValues(theNode.children).concat(valuesToRemove));
        }
        this.subtractFromCounts(valuesToRemove);
        console.log(' Values to Remove : ', valuesToRemove);
        valuesToRemove.forEach((val) => {
            const i = checkedValues.findIndex((data) => data === val);
            if (i !== -1) {
                checkedValues.splice(i, 1);
            }
        });
        console.log(' Final Checked Array : ', checkedValues);
        this.props.setChecked(checkedValues);
    }

    selectedNaics = () => {
        if (!this.props.checked.size === 0) return null;
        const { selectedNaicsData } = this.state;
        return (<SelectedNaic
            selectedNAICS={selectedNaicsData}
            removeNAICS={this.removeCheckedValues} />);
    }

    render() {
        const loadingDiv = this.loadingDiv();
        const noResultsDiv = this.noResultsDiv();
        const errorDiv = this.errorDiv();
        const { searchString } = this.state;
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
                    {this.selectedNaics()}
                </div>
            </div>
        );
    }
}

NAICSContainer.propTypes = propTypes;

export default connect(
    (state) => ({
        nodes: state.naics.naics,
        expanded: state.naics.expanded,
        checked: state.naics.checked
    }),
    (dispatch) => bindActionCreators(
        Object.assign(
            {},
            { updateNaics },
            { setNaics },
            { setExpanded },
            { setChecked }
        )
        ,
        dispatch
    ))(NAICSContainer);
