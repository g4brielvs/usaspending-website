/**
  * checkboxTreeHelper.js
  * Created by Jonathan Hill 10/01/2019
  **/
export const cleanNaicsData = (nodes) => nodes.map((node) => {
    if (node.naics.length === 6) {
        return {
            ...node,
            label: node.naics_description,
            value: node.naics
        };
    }
    return {
        ...node,
        label: node.naics_description,
        value: node.naics,
        children: node.children
            ? cleanNaicsData(node.children)
            : []
    };
});

export const sortNodes = (a, b) => {
    const nodeA = parseInt(a.value, 10);
    const nodeB = parseInt(b.value, 10);
    if (nodeA > nodeB) return 1;
    if (nodeB > nodeA) return -1;
    return 0;
};

export const getHighestAncestorNaicsCode = (naicsCode) => `${naicsCode[0]}${naicsCode[1]}`;

export const getImmediateAncestorNaicsCode = (naicsCode) => {
    if (naicsCode.length === 2) return naicsCode;
    else if (naicsCode.length === 4) return getHighestAncestorNaicsCode(naicsCode);
    return `${naicsCode[0]}${naicsCode[1]}${naicsCode[2]}${naicsCode[3]}`;
};

export const getNodeFromTree = (tree, nodeKey, treePropForKey = 'value') => {
    const parentKey = getHighestAncestorNaicsCode(nodeKey);
    const ancestorKey = getImmediateAncestorNaicsCode(nodeKey);
    if (nodeKey.length === 2) {
        return tree
            .find((node) => node[treePropForKey] === nodeKey);
    }
    if (nodeKey.length === 4) {
        return tree
            .find((node) => node[treePropForKey] === parentKey)
            .children
            .find((node) => node[treePropForKey] === nodeKey);
    }
    if (nodeKey.length === 6) {
        return tree
            .find((node) => node[treePropForKey] === parentKey)
            .children
            .find((node) => node[treePropForKey] === ancestorKey)
            .children
            .find((node) => node[treePropForKey] === nodeKey);
    }
    return null;
};

export const expandAllNodes = (nodes, propForNode = 'value') => {
    const getValue = (acc, node) => {
        acc.push(node[propForNode]);
        if (node.children) {
            acc.push(
                ...node.children.map((child) => child[propForNode])
            );
        }
        return acc;
    };

    return nodes
        .reduce(getValue, []);
};

const mergeChildren = (parentFromSearch, existingParent) => {
    // 1. hide node not in search
    // 2. add placeholders if not there
    if (existingParent.children && parentFromSearch.children) {
        const existingChildArray = existingParent.children.map((node) => ({ ...node, className: 'hide' }));

        const nodes = parentFromSearch.children
            .reduce((acc, searchChild) => {
                const existingChildIndex = acc
                    .findIndex((existingChild) => existingChild.value === searchChild.value);
                
                if (existingChildIndex !== -1) {
                    // show this child
                    acc[existingChildIndex].className = '';
                    if (acc[existingChildIndex].children) {
                        // hide this child's children
                        acc[existingChildIndex].children = acc[existingChildIndex].children.map((grand) => ({ ...grand, className: 'hide' }));
                    }

                    if (acc[existingChildIndex].children && searchChild.children) {
                        searchChild.children
                            .forEach((grandChild) => {
                                const existingGrandChildIndex = acc[existingChildIndex].children
                                    .findIndex((existingGC) => existingGC.value === grandChild.value);

                                if (existingGrandChildIndex !== -1) {
                                    // unless it's in the search array
                                    acc[existingChildIndex].children[existingGrandChildIndex].className = '';
                                }
                                else {
                                    // or we're adding a new node.
                                    acc[existingChildIndex].children.push(grandChild);
                                }
                            });
                    }
                    return acc;
                }
                // child added via search
                if (searchChild.count === searchChild.children.length) {
                    acc.push(searchChild);
                }
                else {
                    acc.push({
                        ...searchChild
                        // children: [
                        //     ...searchChild.children,
                        //     {
                        //         isPlaceHolder: true,
                        //         label: "Child Placeholder",
                        //         value: `children_of_${searchChild.value}`,
                        //         className: 'hide'
                        //     }
                        // ]
                    });
                }


                return acc;
            }, existingChildArray);

        return nodes;
    }
    else if (existingParent.children && !parentFromSearch.children) {
        return existingParent.children.map((child) => ({ ...child, className: 'hide' }));
    }
    else if (!existingParent.children && parentFromSearch.children && parentFromSearch.children.length !== parentFromSearch.count) {
        return parentFromSearch.children;
    }
    return [];
};

export const addSearchResultsToTree = (tree, searchResults) => {
    const nodesFromSearchToBeReplaced = searchResults.map((node) => node.value);
    return tree
        .map((existingNode) => {
            // nodeKey is naicsCode!
            const nodeKey = existingNode.value;
            if (nodesFromSearchToBeReplaced.includes(nodeKey)) {
                const nodeFromSearch = searchResults.find((node) => node.value === nodeKey);
                return {
                    ...nodeFromSearch,
                    children: [...mergeChildren(nodeFromSearch, existingNode)]
                };
            }
            return { ...existingNode, className: 'hide' };
        })
        .sort(sortNodes);
};

export const placeholderNode = {
    isPlaceHolder: true,
    value: 'n',
    showCheckbox: false,
    count: null
};

export const showAllTreeItems = (tree, key = '', payload = []) => tree
    .map((existingNode) => {
        if (existingNode.value === key) {
            const [data] = payload;
            return {
                ...data,
                children: data.children.map((newChild) => {
                    const existingChild = existingNode.children
                        ? existingNode.children.find((olderChild) => olderChild.value === newChild.value)
                        : null;
                    const weHaveTheGrandChildren = (
                        existingChild &&
                        existingChild?.children.length === newChild.count &&
                        !existingChild?.children.some((existingGrand) => existingGrand?.isPlaceHolder)
                    );
                    const weHaveAtLeastOneGrandChild = (
                        existingChild &&
                        existingChild?.children.filter((grand) => !grand.isPlaceHolder).length > 0
                    );
                    if (weHaveTheGrandChildren) {
                        return {
                            ...newChild,
                            children: existingChild.children.sort(sortNodes)
                        };
                    }
                    if (weHaveAtLeastOneGrandChild) {
                        return {
                            ...newChild,
                            children: [...newChild.children, ...existingChild.children].sort(sortNodes)
                        };
                    }
                    return {
                        ...newChild,
                        children: newChild.children
                            ? newChild.children
                            : []
                    };
                }).sort(sortNodes)
            };
        }
        return {
            ...existingNode,
            className: '',
            children: existingNode.children
                ? existingNode.children.map((existingChild) => {
                    if (existingChild.value === key) {
                        if (existingChild.children.length === existingChild.count && !existingChild.children.some((existingGrandChild) => existingGrandChild.isPlaceHolder)) {
                            // we already have the child data for this particular child, don't overwrite it w/ a placeholder.
                            return {
                                ...existingChild
                            };
                        }
                        return {
                            ...payload[0]
                        };
                    }
                    if (existingChild.children && existingChild.children.some((existingGrandChild) => existingGrandChild.className === 'hide')) {
                        return {
                            ...existingChild,
                            className: '',
                            children: existingChild.children.map((existingGrandChild) => ({ ...existingGrandChild, className: '' }))
                        };
                    }
                    return {
                        ...existingChild,
                        className: ''
                    };
                }).sort(sortNodes)
                : []
        };
    });

export const doesNodeHaveAllChildren = (node) => {
    if (node.value.length === 6) return true;
    const { count } = node;
    if (node.children) {
        const countForNode = node.children
            .filter((child) => !child.isPlaceHolder)
            .reduce((currentCount, child) => {
                const childCount = child.count === 0
                    ? 1
                    : child.count;
                return currentCount + childCount;
            }, 0);
        return (countForNode === count);
    }
    return false;
};

export const addPlaceholderToExistingChildren = (nodeChildren = []) => [
    ...nodeChildren,
    placeholderNode
];
