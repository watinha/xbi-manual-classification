import Renderer from './renderer.js';
import Loader from './loader.js';

const ELEMENTS = {
        CLASSIFIED_COUNT: document.querySelector('#classified_count'),
        UNCLASSIFIED_COUNT: document.querySelector('#unclassified_count'),
        SCREENSHOTS_DIV: document.querySelector('.screenshots'),
        METADATA_TR: document.querySelector('#metadata_tr')
      },
      URLS = {
        CLASSIFIED: './classified',
        UNCLASSIFIED: './unclassified'
      },
      cache = {
        cursor: 0
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
  }),
  Loader({
    url: [URLS.UNCLASSIFIED, '/', cache.cursor].join(''),
    target: ELEMENTS.SCREENSHOTS_DIV,
    mapping: (data) => {
      if (!cache.current)
        current = data;

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
  }),
  {
    render: () => {
			const diffX = (parseInt(current.baseX) - parseInt(current.targetX)),
            diffY = (parseInt(current.baseY) - parseInt(current.targetY)),
            diffHeight = (parseInt(current.baseHeight) - parseInt(current.targetHeight)),
            diffWidth = (parseInt(current.baseWidth) - parseInt(current.targetWidth)),
            imageDiff = (current.imageDiff),
            pHash = (current.phash);

      ELEMENTS.METADATA_TR.innerHTML =
				"<td>" + (current.baseX) + "</td>" +
        "<td>" + (current.targetX) + "</td>" +
        "<td>" + (current.baseY) + "</td>" +
        "<td>" + (current.targetY) + "</td>" +
        "<td>" + (current.baseHeight) + "</td>" +
        "<td>" + (current.targetHeight) + "</td>" +
        "<td>" + (current.baseWidth) + "</td>" +
        "<td>" + (current.targetWidth) + "</td>" +
        "<td style=\"background-color:" + (diffX == 0 ?"green":"red") + "\">" + diffX + "</td>" +
        "<td style=\"background-color:" + (diffY == 0 ?"green":"red") + "\">" + diffY + "</td>" +
        "<td style=\"background-color:" + (diffHeight == 0 ?"green":"red") + "\">" + diffHeight + "</td>" +
        "<td style=\"background-color:" + (diffWidth == 0 ?"green":"red") + "\">" + diffWidth + "</td>" +
        "<td style=\"background-color:" + (imageDiff == 0 ?"green":"red") + "\">" + imageDiff + "</td>" +
        "<td>" + (current.basePlatform != 'null') + "</td>" +
        "<td>" + (current.targetPlatform != 'null') + "</td>" +
        "<td style=\"background-color:" + ((pHash==0 || pHash>0.90) ?"green":"red") + "\">" + pHash + "</td>" +
        "<td>" + current.Result + "</td>";
    }
  }
]);

renderer.render();
