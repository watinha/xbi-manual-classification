import App from './app.js';
import Renderer from './renderer.js';
import Loader from './loader.js';
import { render_complete_screenshot, render_metadata, render_screenshot } from './components/index.js';

const ELEMENTS = {
        CLASSIFIED_COUNT: document.querySelector('#classified_count'),
        UNCLASSIFIED_COUNT: document.querySelector('#unclassified_count'),
        SCREENSHOTS_DIV: document.querySelector('.screenshots'),
        BASE_CURSOR_DIV: document.querySelector('.cursor .base'),
        TARGET_CURSOR_DIV: document.querySelector('.cursor .target'),
        METADATA_TR: document.querySelector('.metadata'),
        SCREENSHOTS_CONTAINER: document.querySelector('#container'),
        INTERNAL_INPUT: document.querySelector('#internal_classifier'),
        EXTERNAL_INPUT: document.querySelector('#external_classifier'),
      },
      KEYS = {
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        ENTER: 13
      },
      URLS = {
        CLASSIFIED: './classified',
        UNCLASSIFIED: './unclassified'
      };

let cursor = 0,
    current = null;

const renderer = Renderer([
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

const app = App({ renderer }),
      internal_input = ELEMENTS.INTERNAL_INPUT,
      external_input = ELEMENTS.EXTERNAL_INPUT;

internal_input.focus();
internal_input.addEventListener('keyup', (ev) => {
  if ([KEYS.UP, KEYS.LEFT].indexOf(ev.keyCode) >= 0)
    app.next();
  if ([KEYS.DOWN, KEYS.RIGHT].indexOf(ev.keyCode) >= 0)
    app.previous();
  cursor = app.get_cursor();
});

renderer.render();
