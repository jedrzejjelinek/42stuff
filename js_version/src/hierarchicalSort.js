var propertyLevelStruct;
var metricsNameToSortBy;

// TODO allow to sort by other metrics
const SORT_METRICS = 'net_sales';
const TOTAL_SYMBOL = '$total';

class Node {
  constructor(value) {
    this.value = value; // TODO change that later, don't know the format now
    this.parent = null;
    this.children = [];
  }

  setParent(node) {
    this.parent = node;
    node.children.push(this);
  }

  setChild(node) {
    this.children.push(node);
    node.parent = this;
  }
}

// TODO I dont like it, simple function but complicated due to dataset properties structure
function countTotalFields(propertiesNames, item) {
  return item.properties.reduce((r, property, idx) => {
    if (property[propertiesNames[idx]] === TOTAL_SYMBOL) {
      r -= 1;
    }
    return r;
  }, propertiesNames.length);
}

function findNodeChildren(level, node) {
  let children = [];
  let childrenLevel = level + 1;

  if (level === 0) {
    return propertyLevelStruct[childrenLevel];
  }

  if (childrenLevel >= propertyLevelStruct.length) {
    return children;
  }


  for (item of propertyLevelStruct[childrenLevel]) {
    // child item is when:
    // - has corresponding properties (first 'level' properties)
    let isChild = true;
    for (let i = 0; i < level; i++) {
      if (JSON.stringify(node.value.properties[i]) != JSON.stringify(item.value.properties[i])) { // TODO hmm structure is still pain in the ass...
        isChild = false;
        break;
      }
    }

    if (isChild) {
      children.push(item);
    }
  }

  return children;
}

function findNodeParent(level, node) {
  let parentLevel = level - 1;
  for (item of propertyLevelStruct[parentLevel]) {
    if (parentLevel === 0) {
      return item; // root
    }

    // parent item is when:
    // - has corresponding properties (first 'parentlevel' properties)
    let isParent = true;
    for (let i = 0; i < parentLevel; i++) {
      if (JSON.stringify(node.value.properties[i]) != JSON.stringify(item.value.properties[i])) { // TODO hmm structure is still pain in the ass...
        isParent = false;
        break;
      }
    }

    if (isParent) {
      return item;
    }
  }

  return null;
}

function buildTree(data) {
  for (item of data.dataset) {
    let level = countTotalFields(data.headers.properties, item);
    let node = new Node(item);

    propertyLevelStruct[level].push(node);

    // find parent to fill the structure
    if (level > 0) {
      let parent = findNodeParent(level, node);
      if (parent) {
        node.setParent(parent);
      }
    }

    // find children to fill the structure
    let children = findNodeChildren(level, node);
    children.forEach((child) => {
      child.setParent(node);
    });
  }
}

const compareNodes = (nodeA, nodeB) => {
  let nodeAValue = nodeA.value.metrics[metricsNameToSortBy];
  let nodeBValue = nodeB.value.metrics[metricsNameToSortBy];

  if (nodeAValue > nodeBValue) return -1;
  if (nodeAValue < nodeBValue) return 1;
  if (nodeAValue == nodeBValue) return 0;
}

// TODO delimiter should not be here.. and this function too ;)
const printNode = (node) => {
  let propertiesString = node.value.properties.map((item) => {
    return item[Object.keys(item)[0]];
  }).join('|');

  let metricsString = Object.keys(node.value.metrics).sort().map((key) => {
    return node.value.metrics[key];
  }).join('|');

  console.log(propertiesString + '|' + metricsString);
};

// TODO find iterative version
const sortAndPrint = (node) => {
  printNode(node);
  node.children.sort(compareNodes);
  for (child of node.children) {
    sortAndPrint(child);
  }
};

function hierarchicalSort(data, metricsName) {
  metricsNameToSortBy = metricsName || SORT_METRICS;

  propertyLevelStruct = data.headers.properties.map(() => {return [];});
  propertyLevelStruct.push([]); // add one for the root

  buildTree(data);

  let root = propertyLevelStruct[0][0];
  sortAndPrint(root);
};

module.exports = hierarchicalSort;
