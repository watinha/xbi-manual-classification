import fs from 'fs';
import arff from '@watinha/arff';

const unclassified_filename = './data/dataset.unclassified.filtered.arff',
      classified_filename = './data/dataset.classified.arff';

let classifier = (() => {

  let cache = {
    'unclassified': -1,
    'classified': -1
  };

  const load = async (uncached, cache_key, filename) => {
    if (cache[cache_key] === -1 || uncached === '1') {
      cache[cache_key] = arff.parse(
        await fs.promises.readFile(
          filename, { encoding: 'utf8' }));
    }
  };
  const load_unclassified = async (uncached) => {
    return load(uncached, 'unclassified', unclassified_filename);
  };
  const load_classified = async (uncached) => {
    return load(uncached, 'classified', classified_filename);
  };

  return {

    unclassified_length: async (uncached) => {
      await load_unclassified(uncached);
      return cache['unclassified']['data'].length;
    },

    get_unclassified: async (id, uncached) => {
      await load_unclassified(uncached);
      return cache['unclassified']['data'][id];
    },

    classified_length: async (uncached) => {
      await load_classified(uncached);
      return cache['classified']['data'].length;
    },

    classify: (id, { external, internal }) => {
      cache['classified']['data'][parseInt(id)].external = external;
      cache['classified']['data'][parseInt(id)].internal = internal;
    },

    save_classified: async () => {
      return fs.promises.writeFile(classified_filename,
        arff.format(cache['classified']));
    }

  };

})();

export default classifier;
