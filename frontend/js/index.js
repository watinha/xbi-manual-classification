import App from './app.js';

const ELEMENTS = {
        INTERNAL_INPUT: document.querySelector('#internal_classifier'),
        EXTERNAL_INPUT: document.querySelector('#external_classifier'),
        SCREENSHOTS_DIV: document.querySelector('.screenshots'),
        GENERATE_ARFF_BUTTON: document.querySelector('button.generate'),
        BASE_CURSOR_DIV: document.querySelector('.cursor .base'),
        TARGET_CURSOR_DIV: document.querySelector('.cursor .target'),
        WEBSITE_BACK: document.querySelector('button.back'),
        WEBSITE_NEXT: document.querySelector('button.next'),
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
      generate_button = ELEMENTS.GENERATE_ARFF_BUTTON,
      base_cursor_div = ELEMENTS.BASE_CURSOR_DIV,
      target_cursor_div = ELEMENTS.TARGET_CURSOR_DIV,
      website_back = ELEMENTS.WEBSITE_BACK,
      website_next = ELEMENTS.WEBSITE_NEXT;

internal_input.focus();
setInterval(() => {
  const base_img = base_cursor_div.querySelector('img'),
        target_img = target_cursor_div.querySelector('img');
  if ((base_img && base_img.src.search(/null$/) !== -1) ||
      (target_img && target_img.src.search(/null$/) !== -1)) {
    internal_input.value = '';
    internal_input.disabled = true;
    external_input.focus();
  } else {
    if (internal_input.disabled) {
      internal_input.disabled = false;
      internal_input.focus();
    }
    internal_input.disabled = false;
  }
}, 300);

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

website_back.addEventListener('click', () => {
  app.back_website();
});

website_next.addEventListener('click', () => {
  app.next_website();
});

let cursor = localStorage.getItem('cursor');
if (cursor)
  app.set_cursor(cursor);
