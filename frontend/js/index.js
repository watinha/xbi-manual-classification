import Renderer from './renderer.js';
import Loader from './loader.js';

const ELEMENTS = {
        CLASSIFIED_COUNT: document.querySelector('#classified_count'),
        UNCLASSIFIED_COUNT: document.querySelector('#unclassified_count')
      },
      URLS = {
        CLASSIFIED: './classified',
        UNCLASSIFIED: './unclassified'
      };

let renderer = Renderer([
  Loader({
    url: URLS.CLASSIFIED,
    target: ELEMENTS.CLASSIFIED_COUNT,
    mapping: (data) => data.length
  }),
  Loader({
    url: URLS.UNCLASSIFIED,
    target: ELEMENTS.UNCLASSIFIED_COUNT,
    mapping: (data) => data.length
  })
]);

renderer.render();
