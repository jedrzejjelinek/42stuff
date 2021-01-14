const DataLoader = require('./DataLoader')
const fs = require('fs').promises;


class FileDataLoader extends DataLoader {
  constructor(path) {
    super();
    this.path = path;
  }

  // TODO it would be better to read line by line and return in some kind of generator / iterator
  // now everything is loaded into memory :(
  async getData() {
    const data = await fs.readFile(this.path, 'utf8');
    return data.toString().split("\n");
  }
}

module.exports = FileDataLoader;
