import Renderer from './renderer.js';
import Loader from './loader.js';
import { render_complete_screenshot, render_metadata, render_screenshot } from './components/index.js';

const ELEMENTS = {
        CLASSIFIED_COUNT: document.querySelector('#classified_count'),
        UNCLASSIFIED_COUNT: document.querySelector('#unclassified_count'),
        SCREENSHOTS_DIV: document.querySelector('.screenshots'),
        METADATA_TR: document.querySelector('#metadata_tr'),
        SCREENSHOTS_CONTAINER: document.querySelector('#container')
      },
      URLS = {
        CLASSIFIED: './classified',
        UNCLASSIFIED: './unclassified'
      };

let cursor = 0;

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
  }),
  Loader({
    url: `${URLS.UNCLASSIFIED}/${cursor}`,
    target: ELEMENTS.SCREENSHOTS_DIV,
    mapping: render_complete_screenshot
  }),
  Loader({
    url: `${URLS.UNCLASSIFIED}/${cursor}`,
    target: ELEMENTS.METADATA_TR,
    mapping: render_metadata
  }),
  Loader({
    url: `${URLS.UNCLASSIFIED}/${cursor}`,
    target: ELEMENTS.SCREENSHOTS_CONTAINER,
    mapping: render_screenshot
  })
]);

renderer.render();
