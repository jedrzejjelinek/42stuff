const Tree = require('./tree');

var sortMetrics;

const SORT_METRICS = 'net_sales';
const TOTAL_SYMBOL = '$total';

// TODO I dont like it, simple function but complicated due to dataset properties structure
function countTotalFields(propertiesNames, item) {
  return item.properties.reduce((r, property, idx) => {
    if (property[propertiesNames[idx]] === TOTAL_SYMBOL) {
      r -= 1;
    }
    return r;
  }, propertiesNames.length);
}

const compareNodes = (nodeA, nodeB) => {
  let propertyName = nodeA.getDeepestPropertyName();
  let metricsNameToSortBy = sortMetrics[propertyName] || SORT_METRICS;

  let nodeAValue = nodeA.value.metrics[metricsNameToSortBy];
  let nodeBValue = nodeB.value.metrics[metricsNameToSortBy];

  if (nodeAValue > nodeBValue) return -1;
  if (nodeAValue < nodeBValue) return 1;
  if (nodeAValue == nodeBValue) return 0;
}

// TODO delimiter should not be here.. and this function too ;)
const printNode = (node, headers) => {
  let propertiesString = node.value.properties.map((item) => {
    return item[Object.keys(item)[0]];
  }).join('|');

  let metricsString = headers.metrics.map((metricsName) => {
    return node.value.metrics[metricsName];
  }).join('|');

  console.log(propertiesString + '|' + metricsString);
};

// TODO find iterative version
const sortAndPrint = (node, headers) => {
  printNode(node, headers);
  node.children.sort(compareNodes);
  for (child of node.children) {
    sortAndPrint(child, headers);
  }
};

const printHeader = (data) => {
  console.log(data.headers.properties.join('|') + '|' + data.headers.metrics.join('|'))
};

function hierarchicalSort(data, sortMetricsConfig) {
  sortMetrics = sortMetricsConfig || {};

  const tree = new Tree(data, countTotalFields);
  let root = tree.build();

  printHeader(data);
  sortAndPrint(root, data.headers);
};

module.exports = hierarchicalSort;
