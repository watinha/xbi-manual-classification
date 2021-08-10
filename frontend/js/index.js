import Renderer from './renderer.js';
import Loader from './loader.js';

const ELEMENTS = {
        CLASSIFIED_COUNT: document.querySelector('#classified_count'),
        UNCLASSIFIED_COUNT: document.querySelector('#unclassified_count'),
        SCREENSHOTS_DIV: document.querySelector('.screenshots')
      },
      URLS = {
        CLASSIFIED: './classified',
        UNCLASSIFIED: './unclassified'
      };

let cursor = 0,
    renderer = Renderer([
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
    url: [URLS.UNCLASSIFIED, '/', cursor].join(''),
    target: ELEMENTS.SCREENSHOTS_DIV,
    mapping: (data) => {
      const imgBase = document.createElement("img"),
            imgTarget = document.createElement("img"),
            baseContainer = document.createElement("div"),
            targetContainer = document.createElement("div");
      imgBase.src = data.baseScreenshot.replace(/\d+\.png/, 'complete.png')
      imgTarget.src = data.targetScreenshot.replace(/\d+\.png/, 'complete.png')

      baseContainer.appendChild(imgBase);
      targetContainer.appendChild(imgTarget);

      return [baseContainer.outerHTML, targetContainer.outerHTML].join('');
    }
  })
]);

renderer.render();
