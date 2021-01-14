const assert = require('assert');
const sinon = require('sinon');
const DataParser = require('../../src/dataparser/DataParser');

class DummyDataLoader{
  getData() {}
}

describe('DataParser', () => {
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
