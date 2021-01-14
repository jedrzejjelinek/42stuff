// const MemoryDataLoader = require('./src/dataloader/MemoryDataLoader');
const FileDataLoader = require('./src/dataloader/FileDataLoader');
const DataParser = require('./src/dataparser/DataParser');
const hierarchicalSort = require('./src/hierarchicalSort');

// const dataLoader = new MemoryDataLoader();
// const dataLoader = new FileDataLoader('./data/example.in');
const dataLoader = new FileDataLoader('./data/data.txt');
const dataParser = new DataParser(dataLoader);

// hierarchicalSort(dataParser.parse());
// hierarchicalSort(dataParser.parse(), 'other_metrics');
dataParser.parse().then((data) => {
  hierarchicalSort(data, {
    'property1': 'net_sales',
    'property0': 'net_sales'
  });
});


// TODO notes
//test memory usage and execution time (42tech loads huge data files probably)
// should delimiter be configurable?

// what about tests
// add unit tests
// kind of integrational tests using given examples
// stress tests - ? - prepare large file (maybe based on given examples?)
// what about corner cases? - think that through

// what about performance?
// second: try to optimize - think that through
