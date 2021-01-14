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

class Tree {
  constructor(data, countLevelFunc) {
    this.data = data;
    this._countLevelFunc = countLevelFunc;
    this._preparePropertyLevelStruct();
  }

  _preparePropertyLevelStruct() {
    // TODO this structure should be a class, but it's not so important right now
    this._propertyLevelStruct = this.data.headers.properties.map(() => {return [];});
    this._propertyLevelStruct.push([]); // add one for the root
  }

  _findNodeChildren(level, node) {
    let children = [];
    let childrenLevel = level + 1;

    if (level === 0) {
      return this._propertyLevelStruct[childrenLevel];
    }

    if (childrenLevel >= this._propertyLevelStruct.length) {
      return children;
    }


    for (let item of this._propertyLevelStruct[childrenLevel]) {
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

  _findNodeParent(level, node) {
    let parentLevel = level - 1;
    for (let item of this._propertyLevelStruct[parentLevel]) {
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

  getRoot() {
    try {
      return this._propertyLevelStruct[0][0];
    } catch(e) {
      return null;
    }
  }

  build() {
    let data = this.data;
    for (let item of data.dataset) {
      let level = this._countLevelFunc(data.headers.properties, item);
      let node = new Node(item);

      this._propertyLevelStruct[level].push(node);

      // find parent to fill the structure
      if (level > 0) {
        let parent = this._findNodeParent(level, node);
        if (parent) {
          node.setParent(parent);
        }
      }

      // find children to fill the structure
      let children = this._findNodeChildren(level, node);
      children.forEach((child) => {
        child.setParent(node);
      });
    }

    return this.getRoot();
  }
};

module.exports = Tree;
