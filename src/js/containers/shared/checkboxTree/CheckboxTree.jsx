/**
  * CheckboxTree.jsx
  * Created by Jonathan Hill 09/27/2019
  **/

import React, { Component, cloneElement } from 'react';
import CheckBoxTree from 'react-checkbox-tree';
import PropTypes from 'prop-types';
import reactStringReplace from 'react-string-replace';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import CheckboxTreeLabel from 'components/sharedComponents/CheckboxTreeLabel';
import { treeIcons } from 'dataMapping/shared/checkboxTree/checkboxTree';
import { doesNodeHaveAllChildren, addPlaceholderToExistingChildren } from 'helpers/checkboxTreeHelper';

import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import { getNodeFromTree, getHighestAncestorNaicsCode, getImmediateAncestorNaicsCode } from '../../../helpers/checkboxTreeHelper';

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
    onExpand = (newExpandedArray, node) => {
        // collapsing node
        if (newExpandedArray.length < this.props.expanded.length) {
            return this.collapseNode(newExpandedArray, node);
        }
        // expanding node
        return this.expandNode(newExpandedArray, node);
    };

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
    setChildrenToLoading = () => (
        <div className="children-are-loading">
            <FontAwesomeIcon icon="spinner" spin />
            <div className="children-are-loading__text">Loading your data...</div>
        </div>
    );
    checkedNode = (checked, node) => {
        this.props.onCheck(checked, node);
    }
    unCheckedNode = (checked, node) => {
        // update checked nodes to remove the previously checked nodes
        this.props.onUncheck(checked, node);
    }

    expandNode = async (newExpandedArray, node) => {
        const { isSearch } = this.props;
        const expandedValue = node.value;
        if (node?.children?.some((child) => child?.isPlaceHolder === true) && !isSearch) {
            return this.props.onExpand(expandedValue, newExpandedArray, true);
        }
        return this.props.onExpand(expandedValue, newExpandedArray, false);
    };

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
            if (nodeHasAllChildren && node.value.length <= 4) {
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
            else if (node.value.length === 6) {
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
                        )
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
                    ? this.createLabels(addPlaceholderToExistingChildren(node.children, node.value))
                    : this.createLabels(addPlaceholderToExistingChildren([], node.value))
            };
        });
    }

    addDescendantsOfChecked = (checked, labeledNodes) => checked
        .reduce((acc, key) => {
            const node = getNodeFromTree(labeledNodes, key);
            if (node.children) {
                const parentKey = getHighestAncestorNaicsCode(key);
                node.children
                    .forEach((child) => {
                        const ancestorKey = getImmediateAncestorNaicsCode(child.value);
                        if (child.isPlaceHolder) {
                            acc.push(child.value);
                        }
                        if (checked.includes(parentKey)) {
                            acc.push(child.value);
                        }
                        else if (checked.includes(ancestorKey)) {
                            acc.push(child.value);
                        }
                        if (child.children) {
                            child.children
                                .forEach((grandChild) => {
                                    if (child.isPlaceHolder) {
                                        acc.push(grandChild.value);
                                    }
                                    else if (checked.includes(parentKey)) {
                                        acc.push(grandChild.value);
                                    }
                                    else if (checked.includes(ancestorKey)) {
                                        acc.push(grandChild.value);
                                    }
                                });
                        }
                    });
            }
            acc.push(key);
            return acc;
        }, []);

    render() {
        const { data, checked, expanded } = this.props;
        const labeledNodes = this.createLabels(data);
        if (!data.length) return null;
        const checkedWithDescendentsChecked = this.addDescendantsOfChecked(checked, labeledNodes);
        return (
            <div className="checkbox-tree">
                <CheckBoxTree
                    checkModel="all"
                    nodes={labeledNodes}
                    checked={checkedWithDescendentsChecked}
                    expanded={expanded}
                    onCheck={this.onCheck}
                    onExpand={this.onExpand}
                    icons={treeIcons} />
            </div>
        );
    }
}

CheckboxTree.propTypes = propTypes;
