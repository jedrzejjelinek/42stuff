// TODO allow to sort by other metrics
const SORT_METRICS = 'net_sales';
const TOTAL_SYMBOL = '$total';

class Node {
  constructor(value) {
    this.value = value; // TODO change that later, don;t know the format now
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

function findNodeChildren(level, propertyLevelStruct, node) {
  let children = [];
  let childrenLevel = level + 1;

  if (childrenLevel >= propertyLevelStruct.length) {
    return children;
  }


  for (item of propertyLevelStruct[childrenLevel]) {
    // child item is when:
    // - has corresponding properties (first 'level' properties)
    let isChild = true;
    for (let i = 0; i <= level; i++) {
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

function findNodeParent(level, propertyLevelStruct, node) {
  let parentLevel = level - 1;
  for (item of propertyLevelStruct[parentLevel]) {
    if (parentLevel === 0) {
      return item; // root
    }

    // parent item is when:
    // - has corresponding properties (first 'parentlevel' properties)
    let isParent = true;
    for (let i = 0; i <= parentLevel; i++) {
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

function hierarchicalSort(data) {
/*
{
  headers: {
    properties: [ 'property0', 'property1' ],
    metrics: [ 'net_sales' ]
  },
  dataset: [
      {
      properties: [ { property0: 'bar' }, { property1: '$total' } ],
      metrics: { net_sales: '-200' }
    }
  ]
}
*/

  // TODO - how it should work?
  // iterate through dataset
  // build a tree
  // - depth equals number of properties
  // - for every item in dataset
  // -- check depth level (number of "$total" in properties)
  // -- find it's parent
  // -- connect them
  // --

  let root = null;

  // kind of cache for new nodes - allows to find a parent when child is earlies on the list in file
  // const propertyLevelStruct = data.headers.properties.map((property) => {
  //   // return {
  //   //   property: property,
  //   //   data: []
  //   // }
  // });
  const propertyLevelStruct = data.headers.properties.map(() => {return [];});
  propertyLevelStruct.push([]); // add one for root

  // build a tree
  for (item of data.dataset) {
    let level = countTotalFields(data.headers.properties, item);
    let node = new Node(item);

    propertyLevelStruct[level].push(node);

    // find parent
    if (level === 0) {
      root = node;
    } else {
      let parent = findNodeParent(level, propertyLevelStruct, node);
      if (parent) {
        node.setParent(parent);
      }
    }

    // find children
    let children = findNodeChildren(level, propertyLevelStruct, node);
    children.forEach((child) => {
      child.setParent(node);
    });
  }


  // start from root, get children, sort using given metrics and print output
  // TODO iterate, checking recursively can be memory-usage-heavy
  for (level = 0; level < propertyLevelStruct.length, level++) {
    
  }



};

module.exports = hierarchicalSort;
