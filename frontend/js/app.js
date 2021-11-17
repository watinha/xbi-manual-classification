import axios from 'axios';

import Renderer from './renderer.js';
import Loader from './loader.js';
import { render_complete_screenshot, render_metadata, render_screenshot } from
  './components/index.js';

const ELEMENTS = {
        CLASSIFIED_COUNT: document.querySelector('#classified_count'),
        UNCLASSIFIED_COUNT: document.querySelector('#unclassified_count'),
        SCREENSHOTS_DIV: document.querySelector('.screenshots'),
        BASE_CURSOR_DIV: document.querySelector('.cursor .base'),
        TARGET_CURSOR_DIV: document.querySelector('.cursor .target'),
        METADATA_TR: document.querySelector('.metadata'),
        SCREENSHOTS_CONTAINER: document.querySelector('#container'),
      },
      URLS = {
        CLASSIFIED: './classified',
        UNCLASSIFIED: './unclassified'
      };

let cursor = 0,
    current = null;

const default_renderer = Renderer([
  Loader({
    url: URLS.CLASSIFIED,
    target: ELEMENTS.CLASSIFIED_COUNT,
    mapping: (data) => cursor
  }),
  Loader({
    url: URLS.UNCLASSIFIED,
    target: ELEMENTS.UNCLASSIFIED_COUNT,
    mapping: (data) => data.length
  }),
  Loader({
    url: () => `${URLS.UNCLASSIFIED}/${cursor}`,
    target: ELEMENTS.SCREENSHOTS_DIV,
    mapping: (data) => {
      current = data;
      return render_complete_screenshot(data);
    }
  }),
  Loader({
    url: () => `${URLS.UNCLASSIFIED}/${cursor}`,
    target: ELEMENTS.BASE_CURSOR_DIV,
    mapping: (data) => render_screenshot(data.baseScreenshot)
  }),
  Loader({
    url: () => `${URLS.UNCLASSIFIED}/${cursor}`,
    target: ELEMENTS.TARGET_CURSOR_DIV,
    mapping: (data) => render_screenshot(data.targetScreenshot)
  }),
  Loader({
    url: () => `${URLS.UNCLASSIFIED}/${cursor}`,
    target: ELEMENTS.METADATA_TR,
    mapping: render_metadata
  })
]);

const App = ({ renderer=default_renderer, max=100000 }) => {
  renderer.render();

  const self = {
    get_cursor: () => cursor,

    set_cursor: (v) => {
      cursor = Math.max(
        Math.min(v, max), 0);
      renderer.render();
    },

    next: () => {
      self.set_cursor(cursor + 1);
    },

    previous: () => {
      self.set_cursor(cursor - 1);
    },

    classify: (id, data) => {
      axios.put(`${URLS.CLASSIFIED}/${id}`, { data });
    },

    save: () => {
      axios.post(URLS.CLASSIFIED);
    },

    search: async ({ x, y }) => {
      const response = await axios.get(`${URLS.CLASSIFIED}/base/${x}/${y}/${cursor}`);
      self.set_cursor(response.data.closest);
    },

    next_website: async () => {
      const response = await axios.get(`${URLS.CLASSIFIED}/next/${cursor}`);
      self.set_cursor(response.data.id);
    },

    back_website: async () => {
      const response = await axios.get(`${URLS.CLASSIFIED}/back/${cursor}`);
      self.set_cursor(response.data.id);
    }
  };

  return self;
};

export default App;
