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
    mapping: (data) => {
      const imgBase = document.createElement("img"),
            imgTarget = document.createElement("img"),
            pointerBase = document.createElement('div'),
            pointerTarget = document.createElement('div'),
            baseContainer = document.createElement("div"),
            targetContainer = document.createElement("div");
      imgBase.src = data.baseScreenshot.replace(/\d+\.png/, 'complete.png');
      imgTarget.src = data.targetScreenshot.replace(/\d+\.png/, 'complete.png')

      pointerBase.className = 'pointer';
      pointerBase.style.top = `${data.baseY}px`;
      pointerBase.style.left = `${data.baseX}px`;
      pointerBase.style.height = `${data.baseHeight}px`;
      pointerBase.style.width = `${data.baseWidth}px`;

      pointerTarget.className = 'pointer';
      pointerTarget.style.top = `${data.targetY}px`;
      pointerTarget.style.left = `${data.targetX}px`;
      pointerTarget.style.height = `${data.targetHeight}px`;
      pointerTarget.style.width = `${data.targetWidth}px`;

      baseContainer.appendChild(imgBase);
      baseContainer.appendChild(pointerBase);
      targetContainer.appendChild(imgTarget);
      targetContainer.appendChild(pointerTarget);

      return [baseContainer.outerHTML, targetContainer.outerHTML].join('');
    }
  }),
  Loader({
    url: [URLS.UNCLASSIFIED, '/', cursor].join(''),
    target: ELEMENTS.BASE_CURSOR_DIV,
    mapping: (data) => {
      const imgBase = document.createElement("img");
      imgBase.src = data.baseScreenshot;

      return imgBase.outerHTML;
    }
  }),
  Loader({
    url: [URLS.UNCLASSIFIED, '/', cursor].join(''),
    target: ELEMENTS.TARGET_CURSOR_DIV,
    mapping: (data) => {
      const imgTarget = document.createElement("img");
      imgTarget.src = data.targetScreenshot;

      return imgTarget.outerHTML;
    }
  }),
  Loader({
    url: [URLS.UNCLASSIFIED, '/', cursor].join(''),
    target: ELEMENTS.METADATA_TR,
    mapping: (data) => {
      const diff = (base, target) => Math.abs(parseInt(base) - parseInt(target)),
            diffX = diff(data.baseX, data.targetX),
            diffX_class = diffX === 0 ? 'green' : 'orange',
            diffY = diff(data.baseY, data.targetY),
            diffY_class = diffY === 0 ? 'green' : 'orange',
            diffHeight = diff(data.baseHeight, data.targetHeight),
            diffHeight_class = diffHeight === 0 ? 'green' : 'orange',
            diffWidth = diff(data.baseWidth, data.targetWidth),
            diffWidth_class = diffWidth === 0 ? 'green' : 'orange',
            imageDiff_class = data.imageDiff === 0 ? 'green' : 'orange';
      return `<td>${data.baseX}</td>
              <td>${data.targetX}</td>
              <td>${data.baseY}</td>
              <td>${data.targetY}</td>
              <td>${data.baseHeight}</td>
              <td>${data.targetHeight}</td>
              <td>${data.baseWidth}</td>
              <td>${data.targetWidth}</td>
              <td style="background-color: ${diffX_class}">${diffX}</td>
              <td style="background-color: ${diffY_class}">${diffY}</td>
              <td style="background-color: ${diffHeight_class}">${diffHeight}</td>
              <td style="background-color: ${diffWidth_class}">${diffWidth}</td>
              <td style="background-color: ${imageDiff_class}">${data.imageDiff}</td>
              <td>${data.basePlatform}</td>
              <td>${data.targetPlatform}</td>
              <td>${data.phash}</td>
              <td>${data.external}</td>
              <td>${data.internal}</td>`;
    }
  })
]);

renderer.render();
