const MemoryDataLoader = require('./src/dataloader/MemoryDataLoader');
const DataParser = require('./src/dataparser/DataParser');
const hierarchicalSort = require('./src/hierarchicalSort');

const dataLoader = new MemoryDataLoader();
const dataParser = new DataParser(dataLoader);

// hierarchicalSort(dataParser.parse());
hierarchicalSort(dataParser.parse(), 'other_metrics');

// TODO notes



// what about reading data: use attached examples
// 2 add loading from file
// 3 test memory usage and execution time (42tech loads huge data files probably)
// should delimiter be configurable?


// !!! sort function
// 2 add configurable metrics
// 3 (extra) add possibility to configure metric per property

// what about tests
// add unit tests
// kind of integrational tests using given examples
// stress tests - ? - prepare large file (maybe based on given examples?)
// what about corner cases? - think that through

// what about performance?
// second: try to optimize - think that through
