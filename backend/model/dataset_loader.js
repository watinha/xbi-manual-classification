const fs = require('fs'),
      arff = require('arff');

module.exports = {
  load: async (filename) => {
    const raw_data = await fs.promises.readFile(
      filename, { encoding: 'utf8' });
    return arff.parse(raw_data);
  }
};
