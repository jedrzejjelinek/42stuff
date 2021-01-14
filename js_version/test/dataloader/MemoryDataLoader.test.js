const expect = require('chai').expect;
const MemoryDataLoader = require('../../src/dataloader/MemoryDataLoader');

// dummy test just as sanity check
describe('MemoryDataLoader', () => {
 it('should return example data', () => {
    const expected = [
      'property0|property1|net_sales',
      'bar|$total|-200',
      'foo|sauce|300',
      '$total|$total|200',
      'bar|sup|-400',
      'foo|$total|400',
      'bar|bro|200',
      'foo|bacon|100'
    ];
    const loader = new MemoryDataLoader();

    expect(loader.getData()).deep.to.equal(expected);
  });
});
