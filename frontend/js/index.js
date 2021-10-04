import App from './app.js';

const ELEMENTS = {
        INTERNAL_INPUT: document.querySelector('#internal_classifier'),
        EXTERNAL_INPUT: document.querySelector('#external_classifier'),
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
      external_input = ELEMENTS.EXTERNAL_INPUT;

internal_input.focus();
internal_input.addEventListener('keyup', (ev) => {
  if ([KEYS.UP, KEYS.LEFT].indexOf(ev.keyCode) >= 0)
    app.previous();
  if ([KEYS.DOWN, KEYS.RIGHT].indexOf(ev.keyCode) >= 0)
    app.next();
});
