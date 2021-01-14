const expect = require('chai').expect;
const assert = require('assert');
const sinon = require('sinon');
const DataParser = require('../../src/dataparser/DataParser');

class DummyDataLoader{
  getData() {}
}


describe('DataParser', () => {
  describe('loading data', () => {
    let dataLoader, getDataStub;

    beforeEach(() => {
      dataLoader = new DummyDataLoader();
      getDataStub = sinon.stub(dataLoader, "getData").returns([]);
    });

    afterEach(() => {
      getDataStub.restore();
    });

    it('should load data during initialization', () => {
      const dataParser = new DataParser(dataLoader);
      assert.ok(getDataStub.calledOnce);
    });
  });

  describe('parsing', () => {
    it('should extract headers', () => {
      const dataLoader = new DummyDataLoader();
      const dataParser = new DataParser(dataLoader);

      dataParser.data = ['property0|property1|net_sales'];
      const expected = {
        properties: ['property0', 'property1'],
        metrics: ['net_sales']
      };
      const given = dataParser._extractHeaders();

      expect(given).deep.to.equal(expected);
    });

    it('should extract multiple metrics and properties', () => {
      const dataLoader = new DummyDataLoader();
      const dataParser = new DataParser(dataLoader);

      dataParser.data = ['property0|property1|property12|property443|net_sales|other_metric|other_metric2'];
      const expected = {
        properties: ['property0', 'property1', 'property12', 'property443'],
        metrics: ['net_sales', 'other_metric', 'other_metric2']
      };
      const given = dataParser._extractHeaders();

      expect(given).deep.to.equal(expected);
    });

    it('should throw an error when property appears after metrics', () => {
      const dataLoader = new DummyDataLoader();
      const dataParser = new DataParser(dataLoader);

      dataParser.data = ['property0|net_sales|property1'];
      assert.throws(() => {
        dataParser._extractHeaders()
      });
    });

    it('should return properly parsed data', () => {
      const dataLoader = new DummyDataLoader();
      const dataParser = new DataParser(dataLoader);

      dataParser.data = [
        'property0|property1|net_sales',
        'bar|$total|-200',
        'foo|sauce|300',
        '$total|$total|200',
        'bar|sup|-400',
        'foo|$total|400',
        'bar|bro|200',
        'foo|bacon|100'
      ];

      const expected = {
        headers: {
          properties: [ 'property0', 'property1' ],
          metrics: [ 'net_sales' ]
        },
        dataset: [
          ['bar', '$total', '-200'],
          ['foo', 'sauce', '300'],
          ['$total', '$total', '200'],
          ['bar', 'sup', '-400'],
          ['foo', '$total', '400'],
          ['bar', 'bro', '200'],
          ['foo', 'bacon', '100']
        ]
      };
      const given = dataParser.parse();
      expect(given).deep.to.equal(expected);
    });
  });
});
