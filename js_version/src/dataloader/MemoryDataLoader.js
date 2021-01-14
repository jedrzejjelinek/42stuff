const DataLoader = require('./DataLoader')

class MemoryDataLoader extends DataLoader {
  // XXX: could be configurable, but memory data loader is used for example data only
  constructor() {
    super();

    // XXX: could be static
    this.EXAMPLE_DATA = [
      'property0|property1|net_sales|other_metrics',
      'bar|$total|-200|-100',
      'foo|sauce|300|400',
      '$total|$total|200|300',
      'bar|sup|-400|-300',
      'foo|$total|400|500',
      'bar|bro|200|300',
      'foo|bacon|100|800'
    ];
  }

  getData() {
    return this.EXAMPLE_DATA;
  }
}

module.exports = MemoryDataLoader;
