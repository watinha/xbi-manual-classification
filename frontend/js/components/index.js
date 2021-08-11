import Loader from '../loader.js';

const render_complete_screenshot = (data) => {
  const imgBase = document.createElement("img"),
        imgTarget = document.createElement("img"),
        baseContainer = document.createElement("div"),
        targetContainer = document.createElement("div");

  imgBase.src = data.baseScreenshot.replace(/\d+\.png/, 'complete.png')
  imgTarget.src = data.targetScreenshot.replace(/\d+\.png/, 'complete.png')

  baseContainer.appendChild(imgBase);
  targetContainer.appendChild(imgTarget);

  return [baseContainer.outerHTML, targetContainer.outerHTML].join('');
};

const render_metadata = (data) => {
  const diffX = (parseInt(data.baseX) - parseInt(data.targetX)),
        diffY = (parseInt(data.baseY) - parseInt(data.targetY)),
        diffHeight = (parseInt(data.baseHeight) - parseInt(data.targetHeight)),
        diffWidth = (parseInt(data.baseWidth) - parseInt(data.targetWidth)),
        imageDiff = (data.imageDiff),
        pHash = (data.phash);

  return (
    "<td>" + (data.baseX) + "</td>" +
    "<td>" + (data.targetX) + "</td>" +
    "<td>" + (data.baseY) + "</td>" +
    "<td>" + (data.targetY) + "</td>" +
    "<td>" + (data.baseHeight) + "</td>" +
    "<td>" + (data.targetHeight) + "</td>" +
    "<td>" + (data.baseWidth) + "</td>" +
    "<td>" + (data.targetWidth) + "</td>" +
    "<td style=\"background-color:" + (diffX == 0 ? "green":"red") + "\">" + diffX + "</td>" +
    "<td style=\"background-color:" + (diffY == 0 ? "green":"red") + "\">" + diffY + "</td>" +
    "<td style=\"background-color:" + (diffHeight == 0 ? "green":"red") + "\">" + diffHeight + "</td>" +
    "<td style=\"background-color:" + (diffWidth == 0 ? "green":"red") + "\">" + diffWidth + "</td>" +
    "<td style=\"background-color:" + (imageDiff == 0 ? "green":"red") + "\">" + imageDiff + "</td>" +
    "<td>" + (data.basePlatform != 'null') + "</td>" +
    "<td>" + (data.targetPlatform != 'null') + "</td>" +
    "<td style=\"background-color:" + ((pHash==0 || pHash>0.90) ? "green":"red") + "\">" + pHash + "</td>" +
    "<td>" + data.Result + "</td>");
}

const render_screenshot = (data) => {
  const baseScreenshot = document.createElement('img'),
        targetScreenshot = document.createElement('img');

  baseScreenshot.src = data.baseScreenshot;
  targetScreenshot.src = data.targetScreenshot;

  return [baseScreenshot.outerHTML, targetScreenshot.outerHTML].join('');
}

export { render_complete_screenshot, render_metadata, render_screenshot };
