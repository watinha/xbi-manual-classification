import fs from 'fs';
import arff from '@watinha/arff';

const unclassified_filename = './data/dataset.unclassified.filtered.arff',
      classified_filename = './data/dataset.classified.arff',
      distance = (x_1, x_2, y_1, y_2) => Math.sqrt((x_1 - x_2) ** 2 + (y_1 - y_2) ** 2);

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
    },

    search: ({ position_x, position_y, current_id }) => {
      const x = parseInt(position_x),
            y = parseInt(position_y),
            id = parseInt(current_id);
      let current = cache['classified']['data'][id],
          url = current.URL,
          platform = current.targetPlatform,
          closest = current,
          closest_id = cache['classified']['data'].indexOf(closest),
          first_element_id = (() => {
            for (let i = id - 1; i >= 0; i--) {
              if (cache['classified']['data'][i].URL !== url ||
                  cache['classified']['data'][i].targetPlatform !== platform)
                return i + 1;
            }
            return 0;
          })();

      for (let i = first_element_id; i < cache['classified']['data'].length; i++) {
        current = cache['classified']['data'][i];

        if (current.URL !== url || current.targetPlatform !== platform)
          return closest_id;

        if (distance(x, current.baseX, y, current.baseY) <
            distance(x, closest.baseX, y, closest.baseY)) {
          closest = current;
          closest_id = i;
        }

      };

      return closest_id;
    },

    next: ({ current_id }) => {
      const id = parseInt(current_id),
            data = cache['classified']['data'],
            url = data[id].URL;
      let cur = id;
      while (cur < data.length && data[cur].URL === url) cur++;
      if (cur === data.length) return id;
      return cur;
    },

    back: ({ current_id }) => {
      const id = parseInt(current_id),
            data = cache['classified']['data'],
            url = data[id].URL;
      let cur = id;
      while (cur >= 0 && data[cur].URL === url) cur--;
      if (cur === -1) return id;
      return cur;
    }

  };

})();

export default classifier;
