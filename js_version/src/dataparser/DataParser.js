class DataParser {
  constructor(dataLoader) {
    if (!dataLoader) {
      throw new Error('DataLoader instance should be passed');
    }

    this.dataLoader = dataLoader;
    this.data = this._loadData();
  }

  _loadData() {
    return this.dataLoader.getData();
  }

  parse() {
    // TODO
    // read first line and get headers
    // read next lines and append data to some structure
    // look for special symbols like '$total'

    // TODO later
    // what about special cases?
    // -- empty data
    // -- duplicated data
    // -- more headers than items in row
    // -- less headers than item in row
    // -- not numbers in metrics
    // -- numbers in properties
  }
}

module.exports = DataParser;
