class DataParser {
  ROW_DELIMITER = '|';
  PROPERTY_PATTERN = /property\d/;

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

  _splitDataRow(row) {
    return row.split(this.ROW_DELIMITER);
  }

  _extractHeaders() {
    let fields = this._splitDataRow(this.data[0]);
    let properties = [];
    let metrics = [];

    let merticsHeaderFound = false;

    for (let field of fields) {
      if (this.PROPERTY_PATTERN.test(field)) {
        if (merticsHeaderFound) {
          throw new Error('Wrong data format: all properties should be placed in a row before metrics!');
        }

        properties.push(field);
      } else {
        merticsHeaderFound = true;
        metrics.push(field);
      }
    }

    this.data.shift(); // remove headers from dataset

    return {
      properties,
      metrics
    };
  }

  _extractData(headers) {
    const dataset = this.data.map((row) => {
      let rowData = this._splitDataRow(row);
      let propertiesData = rowData.splice(0, headers.properties.length);

      // TODO: split into separate functions to simplify code
      return {
        properties: headers.properties.map((property, idx) => {
          let item = {};
          item[property] = propertiesData[idx];
          return item;
        }),
        metrics: headers.metrics.reduce((r, metrics, idx) => {
          r[metrics] = rowData[idx];
          return r;
        }, {})
      };
    });
    return dataset;
  }

  parse() {
    const headers = this._extractHeaders();

    // my first thought is to return just a list of row fields
    const dataset = this._extractData(headers);

    return {
      headers,
      dataset
    };

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
