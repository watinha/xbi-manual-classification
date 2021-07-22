const fs = require('fs'),
      arff = require('arff'),
      unclassified_filename = './data/dataset.unclassified.arff',
      classifier = (() => {

  let unclassified = -1;

  const load_unclassified = async (uncached) => {
    if (unclassified === -1 || uncached === '1') {
      unclassified = arff.parse(
        await fs.promises.readFile(
          unclassified_filename, { encoding: 'utf8' }));
    }
  }

  return {
    unclassified_length: async (uncached) => {
      await load_unclassified(uncached);
      return unclassified['data'].length;
    },
    get_unclassified: async (id, uncached) => {
      await load_unclassified(uncached);
      return unclassified['data'][id];
    }
  };

})();

module.exports = classifier;
