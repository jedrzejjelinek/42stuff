const DataLoader = require('./DataLoader')

class MemoryDataLoader extends DataLoader {
  // XXX: could be configurable, but memory data loader is used for example data only
  constructor() {
    super();
    
    // XXX: could be static
    this.EXAMPLE_DATA = [
      'property0|property1|net_sales',
      'bar|$total|-200',
      'foo|sauce|300',
      '$total|$total|200',
      'bar|sup|-400',
      'foo|$total|400',
      'bar|bro|200',
      'foo|bacon|100'
    ];
  }

  getData() {
    return this.EXAMPLE_DATA;
  }
}

module.exports = MemoryDataLoader;
