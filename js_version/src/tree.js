var propertyLevelStruct;

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

  getDeepestPropertyName() {
    let propertyObj =  this.value.properties[this.value.properties.length - 1];
    return Object.keys(propertyObj)[0];
  }
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

const preparePropertyLevelStruct = (data) => {
  propertyLevelStruct = data.headers.properties.map(() => {return [];});
  propertyLevelStruct.push([]); // add one for the root
};

function buildTree(data, countLevelFunc) {
  preparePropertyLevelStruct(data);

  for (item of data.dataset) {
    let level = countLevelFunc(data.headers.properties, item);
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

  return propertyLevelStruct[0][0];
}

module.exports = buildTree;
