/**
  * checkboxTreeHelper.js
  * Created by Jonathan Hill 10/01/2019
  **/

import {
    flattenDeep,
    compact,
    cloneDeep,
    flatten,
    get,
    uniq
} from 'lodash';

/**
 * updateValueAndLabel
 */
export const updateValueAndLabel = (node, keys) => {
    const newNode = { ...node };
    const { value, label } = keys;
    newNode.value = node[value];
    newNode.label = node[label];
    delete newNode[value];
    delete newNode[label];
    return newNode;
};
/**
* updatePath
*/
export const updatePath = (params) => {
    const {
        node,
        parentNode,
        index,
        isChildren
    } = params;
    const newNode = { ...node };
    /**
     * Case I - No Parent Node
     * Initially populate the tree. These are Tier 1 data points,
     * therefore we only add the index, there is no parent.
     */
    if (!parentNode) {
        newNode.path = [index];
    }
    /**
     * Case II - We are mapping new data
     * When we are not calling itself and we pass a parent node we are at a
     * state where we initially populate the tree. These are Tier 1 data points,
     * therefore we only add the index, there is no parent.
     */
    if (!isChildren && parentNode) {
        newNode.path = parentNode.path;
    }
    /**
     * Case III - We are mapping children
     * We only pass the children property when this function is calling itself to
     * convert a parents children to the data structure. Therefore, we include the
     * parents path before the current child's index.
     */
    if (isChildren) {
        newNode.path = [...parentNode.path, index];
    }
    return newNode;
};
/**
 * updateChildren
*/
export const updateChildren = (params) => {
    const {
        isChildren,
        node,
        limit
    } = params;
    const newNode = cloneDeep(node);
    /**
     * Case I - This node will have no children based on it's path and limit
     * TODO - once backend changes this add check for count === 0
     * Applies the limit, once we hit limit do not add children.
     * By not adding children we will not see the caret to the left of the checkbox.
     */

    if (isChildren && newNode.path.length === limit) return newNode;
    /**
     * Case II - Show Expand Caret
     * When there is no children property and there is a count for this node
     * (means this node has child data) we must set the child property to an
     * array with one empty object to get the expand caret to show.
     */
    console.log(' Starting with this node : ', newNode);
    console.log(' New Node Value : ', newNode.value);
    console.log(' New Node Children : ', newNode?.children);
    console.log(' TRUTHY I : ', !newNode.children);
    console.log(' Truthy II : ', newNode.count > 0 && !newNode.children);
    // if ((newNode.count > 0 && !newNode.children) && !isSearch) {
    //     newNode.children = [{
    //         value: `${newNode.value}childPlaceholder`,
    //         label: 'Placeholder Child',
    //         isPlaceholder: true
    //     }];
    //     return newNode;
    // }
    if (newNode.count > 0 && !newNode.children) {
        console.log(' Adding placeholder ');
        newNode.children = [{
            value: `${newNode.value}childPlaceholder`,
            label: 'Placeholder Child',
            isPlaceholder: true
        }];
        return newNode;
    }
    console.log(' Returning this Node From Update Children : ', newNode);
    return newNode;
};
/**
  ** createCheckboxTreeDataStrucure
  * map data from API response to react-checkbox-tree data structure
  * @param {number} limit - total possible depth of tree structure
  * @param {object} keysToBeMapped - An object with keys value, and label with values
  * that correlate to your value and label properties
  * {
  *   value: [the name of your propery that will become the value e.g., naics]
  *   label: [the name of your propery that will become the label e.g., naics_description]
  * }
  * @param {Array.<object>} nodes - data to map
  * @param {boolean} isChildren - if we are mapping children
  * @param {object} parentNode - parent of the current data
  * @param {boolean} isSearch - data is from search
  * @returns {Array.<object>} An array of objects with value, label, and children properties
  * that follow react-checkbox-tree data structure and keeps any other fields within those objects
  * that originated from your data
  * Please refer to https://github.com/jakezatecky/react-checkbox-tree for more details
**/
/* eslint-disable import/prefer-default-export */
export const createCheckboxTreeDataStrucure = (
    limit,
    keysToBeMapped,
    nodes,
    isChildren,
    parentNode,
    isSearch
) => nodes.map((node, index) => {
    let newNode = cloneDeep(node);
    console.log(' Jon : ', newNode);
    /**
     * Five Steps to this Function
     *
     * 1. Map Value and Label Properties
     *   - Maps properties passed in the data to value and label
     *
     * 2. Update Path
     *   - Sets the path property based on different situations
     *   - noted in their respective function
     *
     * 3. Children Property
     *   - Updates the children property based on different situations
     *   - noted in their respective function
     *
     * 4. Map Child Data
     *   - repeats the process for child data
     *
     * 5. Search
     *   - need to add a classname on search
     */

    // Step 1 - Map Value and Label Properties
    newNode = updateValueAndLabel(newNode, keysToBeMapped);
    console.log(' Jon II : ', newNode);
    // Step 2 - Update Path
    const params = {
        node: newNode,
        parentNode,
        index,
        isChildren
    };
    newNode = updatePath(params);
    console.log(' Jon III : ', newNode);
    // Step 3 - Children
    const childParams = {
        isChildren,
        node: cloneDeep(newNode),
        limit
    };
    newNode = updateChildren(childParams);
    console.log(' Jon IV : ', newNode);
    // Step 4 - Map Child Data
    // if ((newNode.count > 0) && newNode.children && !isEmpty(newNode.children[0])) {
    if ((newNode.count > 0) && newNode.children && !newNode?.children?.[0]?.isPlaceholder) {
        newNode.children = createCheckboxTreeDataStrucure(
            limit,
            keysToBeMapped,
            newNode.children,
            true,
            newNode,
            isSearch
        );
    }
    // Step 5 - Search
    if (isSearch) newNode.className = 'react-checkbox-tree_search';
    console.log(' Returning this node : ', newNode);
    return newNode;
});
/**
 * expandedFromSearch
 * - maps data passed to nodes in the checkbox tree data structure and decides which
 * nodes are expanded based on if they have a children property. We also add placeholder
 * children so that the checkboxes (full check and half check) work as expected.
 * @param {number} limit - total possible depth of tree structure
 * @param {object} nodeKeys - and object with keys value
 * @param {array} nodes - array of objects
 * @returns {object} - object with properties updatedNodes and expanded.
 * expanded is an array of nodes that are expanded
 * updatedNodes is an array of nodes mapped to the checkbox tree data structure
 */
export const handleSearch = (
    limit,
    nodeKeys,
    nodes
) => {
    /**
     * expandedFunc
     * - recursively loops through nodes updating an array with the value of children
     * a children property
     * @param {array} theNodes - an array of nodes
     * @param {array} expanded - an array of expanded values
     * @returns {array} - an array of expanded values
     */
    const expandedFunc = (theNodes, expanded) => {
        const expandedValues = expanded;
        theNodes.forEach((node) => {
            const newNode = node;
            if (!newNode?.className) {
                newNode.className = 'react-checkbox-tree__search';
            }
            if (newNode.children) {
                expandedValues.push(newNode.value);
                expandedFunc(newNode.children, expandedValues);
            }
        });
        return expandedValues;
    };
    // maps nodes to an array of expanded values
    const expanded = nodes.map((node) => {
        const newNode = node;
        newNode.className = 'react-checkbox-tree__tier-zero';
        if (newNode.children) {
            return [newNode.value, ...expandedFunc(newNode.children, [])];
        }
        return [null];
    });
    // flattens and removes any null values
    const expandedArray = compact(flattenDeep(expanded));
    return { updatedNodes: nodes, expanded: expandedArray };
};
/**
 * Update Paths From Search
 * @param {*} nodes
 */
export const updatePathsFromSearch = (node, currentPath) => {
    const nodeData = cloneDeep(node);
    // updates child paths
    const updateChildPath = (children, parentPath) => children.map((child) => {
        const newChild = cloneDeep(child);
        if (!newChild.path) newChild.path = [];
        const newPathForChild = flattenDeep([parentPath, newChild.path.slice(parentPath.length)]);
        newChild.path = newPathForChild;
        newChild.isSearch = true;
        if (newChild.children) newChild.children = updateChildPath(newChild.children, newPathForChild);
        return newChild;
    });
    // updates node path to the current parent path
    nodeData.path = currentPath;
    nodeData.isSearch = true;
    if (nodeData.children) {
        nodeData.children = nodeData.children.map((data) => {
            const newData = cloneDeep(data);
            if (!newData.path) newData.path = [];
            // remove current parent path from child and places new parent path in place
            const newPathForChild = flatten([currentPath, newData.path.slice(currentPath.length)]);
            newData.path = newPathForChild;
            newData.isSearch = true;
            if (newData.children) newData.children = updateChildPath(newData.children, newPathForChild);
            return newData;
        });
    }
    return nodeData;
};
/**
 * deepest child values
 * - gets all child values
 * @param {object[]} nodes - nodes to traverse
 * @returns {*[]} - an array of values
 */
export const deepestChildValues = (nodes) => {
    /**
     * valueFunc
     * - recursively loops through nodes updating an array with the value of the node if is has
     * a children property
     * @param {array} theNodes - an array of nodes
     * @param {array} arrayOfValues - an array of values
     * @returns {array} - an array of values
     */
    const valueFunc = (theNodes, childValues) => {
        theNodes.forEach((node) => {
            const newNode = node;
            if (newNode.children) {
                valueFunc(newNode.children, childValues);
            }
            else {
                childValues.push(newNode.value);
            }
        });
        return childValues;
    };
    // maps nodes to an array of expanded values
    const values = nodes.map((node) => {
        if (node.children) return [...valueFunc(node.children, [])];
        return [node.value];
    });
    // flattens and removes any null values
    const valuesArray = compact(flattenDeep(values));
    return valuesArray;
};
/**
 * allChildValues
 * - gets all child values
 * @param {object[]} nodes - nodes to traverse
 * @returns {*[]} - an array of values
 */
export const allChildValues = (nodes) => {
    /**
     * valueFunc
     * - recursively loops through nodes updating an array with the value of the node if is has
     * a children property
     * @param {array} theNodes - an array of nodes
     * @param {array} arrayOfValues - an array of values
     * @returns {array} - an array of values
     */
    const valueFunc = (theNodes, arrayOfValues) => {
        const checkedValues = arrayOfValues;
        theNodes.forEach((node) => {
            const newNode = node;
            checkedValues.push(newNode.value);
            if (newNode.children) {
                const childValues = newNode.children.map((child) => child.value);
                checkedValues.push(childValues);
                newNode.forEach((childNode) => valueFunc(childNode, checkedValues));
            }
        });
        return checkedValues;
    };
    // maps nodes to an array of expanded values
    const values = nodes.map((node) => {
        const newNode = node;
        if (newNode.children) return [newNode.value, ...valueFunc(newNode.children, [])];
        return [newNode.value];
    });
    // flattens and removes any null values
    const valuesArray = compact(flattenDeep(values));
    return valuesArray;
};
/**
 * pathToNode
 * finds the path to an object
 * @param {array} nodes - nodes to search through
 * @param {*} value - value to match on
 * @returns {array} - A path array to the matched object
 */
export const pathToNode = (nodes, value, key = 'value') => {
    let theNodePath = null;
    const recursiveFind = (theNodes, theValue) => {
        // array of parent indices including found node index
        for (let i = 0; i < theNodes.length; i++) {
            // we found the node, break
            if (theNodes[i][key] === theValue) {
                theNodePath = theNodes[i].path;
                break;
            }
            if (theNodes[i].children) {
                // we have not found the match, repeat process with children
                recursiveFind(theNodes[i].children, theValue);
            }
        }
        return false;
    };

    // array of parent indices including found node index
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i][key] === value) {
            theNodePath = nodes[i].path;
            break;
        }
        if (nodes[i].children) {
            recursiveFind(nodes[i].children, value);
        }
        if (theNodePath) break;
    }
    return { path: theNodePath };
};
/**
 * cleanCheckedValues
 * - removes and values that have childPlaceholder
 * @param {string[]} checked - array of strings
 * @returns {string[]} - an array of strings
 */
export const cleanCheckedValues = (checked) => {
    const placeholder = 'childPlaceholder';
    const searchPlaceholder = 'placeholderForSearch';
    return uniq(checked.map((value) => {
        if (value.includes(placeholder)) {
            return value.replace(placeholder, '');
        }
        else if (value.includes(searchPlaceholder)) {
            const indexOf = value.indexOf('p');
            return value.slice(0, indexOf);
        }
        return value;
    }));
};
/**
 * buildNodePath
 * Creates an object path string
 * @param {array} path - an object path
 * @param {string} [startingProperty = 'data'] - the property of the object to start the path
 */
export const buildNodePath = (path, startingProperty = 'data') => path
    .reduce((acc, step, index) => {
        let stringPath = acc;
        /**
         * add starting property and index to string
         * e.g. 'data[0]'
         */
        if (index === 0) {
            stringPath += `${startingProperty}[${step}]`;
        }
        else {
            // add children to string, e.g. 'data[0].children[7]'
            stringPath += `.children[${step}]`;
        }
        return stringPath;
    }, '');
/**
 * traverse node's parents to see if any of their placeholder for search values
 * exist in the checked array. If a parent's placeholder for search value exists in
 * in the checked array, do not count this child and return the acc. If none of them
 * exist, count this child.
 */
export const countFromSearch = (node, nodes, checked) => {
    const nodeData = cloneDeep(node);
    let parentExists = false;
    if (nodeData.path.length > 1) nodeData.path.pop();
    nodeData.path.forEach((path, index, array) => {
        if (parentExists) return null;
        // get parent node
        const parentPath = nodeData.path.slice(0, array.length - index);
        const parentPathString = buildNodePath(parentPath);
        const parentNode = get({ data: nodes }, parentPathString);
        parentExists = checked.some(
            (checkedValue) => checkedValue.includes(`${parentNode?.value}placeholderForSearch`)
        );
        return null;
    });
    if (parentExists) return 0;
    return node.count === 0 ? 1 : node.count;
};

export const isCleanData = (data) => data.every((node) => {
    const keys = Object.keys(node);
    if (!keys.includes('value')) return false;
    if (!keys.includes('label')) return false;
    if (!keys.includes('path')) return false;
    return true;
});

/**
 * createNodesObject
 * Creates an object with a data property set to the value of nodes in state in
 * order to get and update the nodes property easily with a path string.
 * @returns {object} - An object with property data set to the
 * value of the state property ndoes.
 */
// export const createNodesObject = (nodes) => ({ data: [...nodes] });
export const createNodesObject = (nodes) => ({ data: cloneDeep(nodes) });

export const getNode = (nodes, value) => {
    const { path } = pathToNode(nodes, value);
    if (!path) return path;
    const pathString = buildNodePath(path);
    if (!pathString) return null;
    return get(createNodesObject(nodes), pathString);
};


export const testingNewSearchData = [
    {
        naics: "48",
        naics_description: "Transportation and Warehousing",
        count: 50,
        children: [
            {
                naics: "4811",
                naics_description: "Scheduled Air Transportation",
                count: 2
            },
            {
                naics: "4812",
                naics_description: "Nonscheduled Air Transportation",
                count: 3
            },
            {
                naics: "4821",
                naics_description: "Rail Transportation",
                count: 2
            },
            {
                naics: "4831",
                naics_description: "Deep Sea, Coastal, and Great Lakes Water Transportation",
                count: 4
            },
            {
                naics: "4832",
                naics_description: "Inland Water Transportation",
                count: 2
            },
            {
                naics: "4841",
                naics_description: "General Freight Trucking",
                count: 3
            },
            {
                naics: "4842",
                naics_description: "Specialized Freight Trucking",
                count: 3
            },
            {
                naics: "4851",
                naics_description: "Urban Transit Systems",
                count: 4
            },
            {
                naics: "4852",
                naics_description: "Interurban and Rural Bus Transportation",
                count: 1
            },
            {
                naics: "4853",
                naics_description: "Taxi and Limousine Service",
                count: 2
            },
            {
                naics: "4854",
                naics_description: "School and Employee Bus Transportation",
                count: 1,
                children: [
                    {
                        naics: "485410",
                        naics_description: "School and Employee Bus Transportation",
                        count: 0
                    }
                ]
            },
            {
                naics: "4855",
                naics_description: "Charter Bus Industry",
                count: 1
            },
            {
                naics: "4859",
                naics_description: "Other Transit and Ground Passenger Transportation",
                count: 2
            },
            {
                naics: "4861",
                naics_description: "Pipeline Transportation of Crude Oil",
                count: 1
            },
            {
                naics: "4862",
                naics_description: "Pipeline Transportation of Natural Gas",
                count: 1
            },
            {
                naics: "4869",
                naics_description: "Other Pipeline Transportation",
                count: 2
            },
            {
                naics: "4871",
                naics_description: "Scenic and Sightseeing Transportation, Land",
                count: 1
            },
            {
                naics: "4872",
                naics_description: "Scenic and Sightseeing Transportation, Water",
                count: 1
            },
            {
                naics: "4879",
                naics_description: "Scenic and Sightseeing Transportation, Other",
                count: 1
            },
            {
                naics: "4881",
                naics_description: "Support Activities for Air Transportation",
                count: 3
            },
            {
                naics: "4882",
                naics_description: "Support Activities for Rail Transportation",
                count: 1
            },
            {
                naics: "4883",
                naics_description: "Support Activities for Water Transportation",
                count: 4
            },
            {
                naics: "4884",
                naics_description: "Support Activities for Road Transportation",
                count: 2
            },
            {
                naics: "4885",
                naics_description: "Freight Transportation Arrangement",
                count: 1
            },
            {
                naics: "4889",
                naics_description: "Other Support Activities for Transportation",
                count: 2
            }
        ]
    },
    {
        naics: "61",
        naics_description: "Educational Services",
        count: 17,
        children: [
            {
                naics: "6111",
                naics_description: "Elementary and Secondary Schools",
                count: 1,
                children: [
                    {
                        naics: "611110",
                        naics_description: "Elementary and Secondary Schools",
                        count: 0
                    }
                ]
            },
            {
                naics: "6112",
                naics_description: "Junior Colleges",
                count: 1
            },
            {
                naics: "6113",
                naics_description: "Colleges, Universities, and Professional Schools",
                count: 1,
                children: [
                    {
                        naics: "611310",
                        naics_description: "Colleges, Universities, and Professional Schools",
                        count: 0
                    }
                ]
            },
            {
                naics: "6114",
                naics_description: "Business Schools and Computer and Management Training",
                count: 3,
                children: [
                    {
                        naics: '611410',
                        naics_description: 'Business and Secretarial Schools',
                        count: 0
                    }
                ]
            },
            {
                naics: "6115",
                naics_description: "Technical and Trade Schools",
                count: 4,
                children: [
                    {
                        naics: "611511",
                        naics_description: "Cosmetology and Barber Schools",
                        count: 0
                    },
                    {
                        naics: "611512",
                        naics_description: "Flight Training",
                        count: 0
                    },
                    {
                        naics: "611513",
                        naics_description: "Apprenticeship Training",
                        count: 0
                    },
                    {
                        naics: "611519",
                        naics_description: "Other Technical and Trade Schools",
                        count: 0
                    }
                ]
            },
            {
                naics: "6116",
                naics_description: "Other Schools and Instruction",
                count: 6,
                children: [
                    {
                        naics: "611610",
                        naics_description: "Fine Arts Schools",
                        count: 0
                    },
                    {
                        naics: "611620",
                        naics_description: "Sports and Recreation Instruction",
                        count: 0
                    },
                    {
                        naics: "611630",
                        naics_description: "Language Schools",
                        count: 0
                    },
                    {
                        naics: "611691",
                        naics_description: "Exam Preparation and Tutoring",
                        count: 0
                    },
                    {
                        naics: "611692",
                        naics_description: "Automobile Driving Schools",
                        count: 0
                    },
                    {
                        naics: "611699",
                        naics_description: "All Other Miscellaneous Schools and Instruction",
                        count: 0
                    }
                ]
            },
            {
                naics: "6117",
                naics_description: "Educational Support Services",
                count: 1,

            }
        ]
    }
];
