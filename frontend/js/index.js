import App from './app.js';

const ELEMENTS = {
        INTERNAL_INPUT: document.querySelector('#internal_classifier'),
        EXTERNAL_INPUT: document.querySelector('#external_classifier'),
        SCREENSHOTS_DIV: document.querySelector('.screenshots'),
        GENERATE_ARFF_BUTTON: document.querySelector('.menu button')
      },
      SELECTORS = {
        BASELINE_SCREENSHOT: '.screenshots > div > img:first-child'
      },
      KEYS = {
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        ENTER: 13
      };

const app = App({}),
      internal_input = ELEMENTS.INTERNAL_INPUT,
      external_input = ELEMENTS.EXTERNAL_INPUT,
      screenshots_div = ELEMENTS.SCREENSHOTS_DIV,
      generate_button = ELEMENTS.GENERATE_ARFF_BUTTON;

internal_input.focus();
internal_input.addEventListener('keyup', (ev) => {
  if ([KEYS.UP, KEYS.LEFT].indexOf(ev.keyCode) >= 0)
    app.previous();
  if ([KEYS.DOWN, KEYS.RIGHT].indexOf(ev.keyCode) >= 0)
    app.next();
  if (KEYS.ENTER === ev.keyCode) {
    external_input.focus();
  }
});

external_input.addEventListener('keyup', (ev) => {
  if ([KEYS.UP, KEYS.LEFT].indexOf(ev.keyCode) >= 0)
    app.previous();
  if ([KEYS.DOWN, KEYS.RIGHT].indexOf(ev.keyCode) >= 0)
    app.next();
  if (KEYS.ENTER === ev.keyCode) {
    const internal = parseInt(internal_input.value),
          external = parseInt(external_input.value);
    app.classify(app.get_cursor(), { internal, external });
    app.next();
    internal_input.focus();
    internal_input.value = '';
    external_input.value = '';
  }
});

screenshots_div.addEventListener('click', (ev) => {
  if (document.querySelector(SELECTORS.BASELINE_SCREENSHOT) === ev.target) {
    const baseline_img = ev.target,
          x = ev.pageX - (window.scrollX + baseline_img.getBoundingClientRect().left),
          y = ev.pageY - (window.scrollY + baseline_img.getBoundingClientRect().top);
    app.search({ x, y });
    internal_input.focus();
  }
});

generate_button.addEventListener('click', () => {
  app.save();
  localStorage.setItem('cursor', app.get_cursor());
});

let cursor = localStorage.getItem('cursor');
if (cursor)
  app.set_cursor(cursor);
