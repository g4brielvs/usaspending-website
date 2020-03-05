/**
  * CheckboxTree.jsx
  * Created by Jonathan Hill 09/27/2019
  **/

import React, { Component, cloneElement } from 'react';
import CheckBoxTree from 'react-checkbox-tree';
import PropTypes from 'prop-types';
import { difference } from 'lodash';
import reactStringReplace from 'react-string-replace';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import CheckboxTreeLabel from 'components/sharedComponents/CheckboxTreeLabel';
import { treeIcons } from 'dataMapping/shared/checkboxTree/checkboxTree';
import { doesNodeHaveAllChildren, addPlaceholderToExistingChildren, placeholderNode } from 'helpers/checkboxTreeHelper';

import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import { getNodeFromTree } from '../../../helpers/checkboxTreeHelper';

const propTypes = {
    data: PropTypes.array,
    isLoading: PropTypes.bool,
    icons: PropTypes.object,
    isSearch: PropTypes.bool,
    searchText: PropTypes.string,
    modifyLabelTextClassname: PropTypes.string,
    labelComponent: PropTypes.element,
    onExpand: PropTypes.func,
    onCheck: PropTypes.func,
    onUncheck: PropTypes.func,
    onCollapse: PropTypes.func,
    expanded: PropTypes.array,
    checked: PropTypes.array
};

export default class CheckboxTree extends Component {
    /**
     * onExpand
     * (react-checkbox-tree calls this function when a user expands a node)
     * Decides whether we are expanding or collapsing the node.
     */
    onExpand = (newExpandedArray, node) => {
        // collapsing node
        if (newExpandedArray.length < this.props.expanded.length) {
            return this.collapseNode(newExpandedArray, node);
        }
        // expanding node
        return this.expandNode(newExpandedArray, node);
    };
    /**
     * onCheck
     * - (react-checkbox-tree calls this function when a user selects a node)
     * @param {*[]} checked - array of checked values
     * @param {object} node - the checked node
     * @returns {null}
     */
    onCheck = (checked, node) => {
        if (!this.props.isLoading) {
            if (this.props.checked.length < checked.length) {
                this.checkedNode(checked, node);
            }
            else {
                this.unCheckedNode(checked, node);
            }
        }
    }
    /**
     * setChildrenToLoading
     * update a node's children property to a loading div.
     * @param {number} path - the path of the node to update
     * @returns {Array.<object>} - new array of nodes
     */
    setChildrenToLoading = () => (
        <div className="children-are-loading">
            <FontAwesomeIcon icon="spinner" spin />
            <div className="children-are-loading__text">Loading your data...</div>
        </div>
    );
    /**
     * checkedNode
     * - updates state and calls prop onCheck
     * @param {*[]} checked - array of checked values
     * @param {object} node - the checked node
     * @returns {null}
     */
    checkedNode = (checked, node) => {
        this.props.onCheck(checked, node);
    }
    /**
     * unCheckedNode
     * - updates state and calls prop onCheck
     * @param {*[]} checked - array of checked values
     * @param {object} node - the checked node
     * @returns {null}
     */
    unCheckedNode = (checked, node) => {
        // update checked nodes to remove the previously checked nodes
        this.props.onUncheck(checked, node);
    }

    /**
     * expandNode
     * updates state with the new expanded array and updates the newly expanded children
     * with a loading object if we have no child data for that node.
     * @param {array} newExpandedArray - array with the newly expanded value
     */
    expandNode = async (newExpandedArray, node) => {
        const { expanded, data, isSearch } = this.props;
        console.log('node', node);
        const expandedValue = node.value;
        if (node?.children?.some((child) => child?.isPlaceHolder === true) && !isSearch) {
            return this.props.onExpand(expandedValue, newExpandedArray, true);
        }
        return this.props.onExpand(expandedValue, newExpandedArray, false);
    };
    /**
     * collapseNode
     * updates state with the new expanded array and calls onCollapse if passed in props.
     */
    collapseNode = (newExpandedArray) => {
        this.props.onCollapse(newExpandedArray);
    }

    // TODO - implement this
    // sets specific icons to custom icons passed in props
    updateIcons = () => {
        const { icons } = this.props;
        if (icons) {
            Object.keys(icons).forEach((key) => {
                treeIcons[key] = icons[key];
            });
        }
        return treeIcons;
    }
    /**
     * highlightText
     * adds a <span> tag with a highlight class around matching text
     * @param {string} text - text to match
     * @returns {element|string} - returns a span element with a highlight class
     * or string if no match is found.
     */
    highlightText = (text) => reactStringReplace(text, this.props.searchText, (match, i) => (
        <span
            className={this.props.modifyLabelTextClassname || 'highlight'}
            key={match + i}>
            {match}
        </span>
    ));
    /**
      ** createLabels
      * maps data labels from strings to html
      * @param {Array.<object>} nodes - an array of objects
      * @returns {Array.<object>} An array of objects
    **/
    createLabels = (nodes) => {
        return nodes.map((node) => {
            // if label is a string, do nothing
            if (typeof node.label !== 'string') return node;
            if (node.isPlaceHolder) {
                return {
                    ...node,
                    label: this.setChildrenToLoading(node)
                };
            }
            const nodeHasAllChildren = doesNodeHaveAllChildren(node);
            if (nodeHasAllChildren) {
                return {
                    ...node,
                    label: this.props.labelComponent
                        ? cloneElement(
                            this.props.labelComponent,
                            { value: node.value, label: node.label }
                        )
                        : (
                            <CheckboxTreeLabel
                                value={this.highlightText(node.value)}
                                label={this.highlightText(node.label)}
                                count={node.count} />
                        ),
                    children: this.createLabels(node.children)
                };
            }
            return {
                ...node,
                label: this.props.labelComponent
                    ? cloneElement(
                        this.props.labelComponent,
                        { value: node.value, label: node.label }
                    )
                    : (
                        <CheckboxTreeLabel
                            value={this.highlightText(node.value)}
                            label={this.highlightText(node.label)}
                            count={node.count} />
                    ),
                children: node.children
                    ? this.createLabels(addPlaceholderToExistingChildren(node.children))
                    : this.createLabels(addPlaceholderToExistingChildren())
            };
        });
    }

    render() {
        const { data, checked, expanded } = this.props;
        const labeledNodes = this.createLabels(data);
        if (!data.length) return null;
        return (
            <div className="checkbox-tree">
                <CheckBoxTree
                    checkModel="all"
                    nodes={labeledNodes}
                    checked={checked}
                    expanded={expanded}
                    onCheck={this.onCheck}
                    onExpand={this.onExpand}
                    icons={treeIcons} />
            </div>
        );
    }
}

CheckboxTree.propTypes = propTypes;
