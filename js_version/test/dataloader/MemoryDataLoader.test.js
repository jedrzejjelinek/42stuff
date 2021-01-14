const expect = require('chai').expect;
const MemoryDataLoader = require('../../src/dataloader/MemoryDataLoader');

// dummy test just as sanity check
describe('MemoryDataLoader', () => {
 it('should return example data', () => {
    const expected = [
      'property0|property1|net_sales|other_metrics',
      'bar|$total|-200|-100',
      'foo|sauce|300|400',
      '$total|$total|200|300',
      'bar|sup|-400|-300',
      'foo|$total|400|500',
      'bar|bro|200|300',
      'foo|bacon|100|800'
    ];
    const loader = new MemoryDataLoader();

    expect(loader.getData()).deep.to.equal(expected);
  });
});
