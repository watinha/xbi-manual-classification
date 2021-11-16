import Loader from '../loader.js';

const render_complete_screenshot = (data) => {
  const imgBase = document.createElement("img"),
        imgTarget = document.createElement("img"),
        pointerBase = document.createElement('div'),
        pointerTarget = document.createElement('div'),
        baseContainer = document.createElement("div"),
        targetContainer = document.createElement("div");

  const get_complete_screenshot = (screenshot, platform) => {
    if (screenshot.search(/\d+\.png/) >= 0)
      return screenshot.replace(/\d+\.png/, 'complete.png');
    else {
      let platform_folder = '',
          website_folder = '';
      if (platform.search('iPhone 12 mini') >= 0)
        platform_folder = 'iphone12mini';
      else if (platform.search('iPhone 12 Pro Max') >= 0)
        platform_folder = 'iphone12max';
      else if (platform.search('iPhone 12') >= 0)
        platform_folder = 'iphone12';
      else
        platform_folder = 'pixel_xl';

      website_folder = screenshot.substr(1, screenshot.length - 5);
      return `${website_folder}results/${platform_folder}/complete.png`;
    }
  }
  imgBase.src = get_complete_screenshot(data.baseScreenshot, data.basePlatform);
  imgTarget.src = get_complete_screenshot(data.targetScreenshot, data.targetPlatform);

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
};

const render_metadata = (data) => {
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

const render_screenshot = (screenshot) => {
  const img = document.createElement("img");
  img.src = screenshot;

  return img.outerHTML;
}

export { render_complete_screenshot, render_metadata, render_screenshot };
