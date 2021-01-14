// TODO allow to sort by other metrics
const sort_metrics = 'net_sales';

class Node {
  constructor(value) {
    this.value = value; // TODO change that later, don;t know the format now
    this.parent = null;
    this.child = null;
  }

  setParent(node) {
    this.parent = node;
    node.child = this;
  }

  setChild(node) {
    this.child = node;
    node.parent = this;
  }
}

function countTotalFields(item) {

}

function hierarchicalSort(data) {
  console.log(data.dataset[0]);
/*
{
  headers: {
    properties: [ 'property0', 'property1' ],
    metrics: [ 'net_sales' ]
  },
  dataset: [
    [ 'bar', '$total', '-200' ],
    [ 'foo', 'sauce', '300' ],
    [ '$total', '$total', '200' ],
    [ 'bar', 'sup', '-400' ],
    [ 'foo', '$total', '400' ],
    [ 'bar', 'bro', '200' ],
    [ 'foo', 'bacon', '100' ]
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

  // const propertyLevelStruct = data.headers.properties.map(() => {
  //
  // });

  // for (item of data.dataset) {
  //   let level = countTotalFields(item);
  // }


};

module.exports = hierarchicalSort;
