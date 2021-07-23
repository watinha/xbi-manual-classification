const request = require('supertest'),
      app = require('../backend/app');

let fs = require('fs');

function get_rows (n) {
  const rows = [
    'http://192.168.0.13:8080/59/index.html,1281,DIV,1,131,"iOS 14.5 - Safari -- iOS 14.5 - iPhone 12","Android null - Chrome -- Android API28 - Pixel",null,null,3.0,3.5,null,null,168,15,11953,11816,31,29,198,178,0,0,11657,11528,0.0,0.0,1170,1440,390,412,/body[2]/div[8]/div[1]/div[8]/div[3]/div[16],/body[2]/div[8]/div[1]/div[8]/div[3]/div[16],/body[2]/div[8]/div[1]/div[8]/div[3]/div[16],0.0,15,217,11953,11771,15,198,11999,11816,0,0,"Open Sans","Open Sans",0,1',
    'http://192.168.0.13:8080/59/index.html,739,DIV,1,140,"iOS 14.5 - Safari -- iOS 14.5 - iPhone 12","Android null - Chrome -- Android API28 - Pixel",null,null,3.0,3.5,null,null,15,15,6210,6122,18,17,260,282,15,15,6210,6122,0.0,0.0,1170,1440,390,412,/body[2]/div[8]/div[1]/div[4]/div[1]/ul[1]/li[30]/div[2]/div[1],/body[2]/div[8]/div[1]/div[4]/div[1]/ul[1]/li[30]/div[2]/div[1],/body[2]/div[8]/div[1]/div[4]/div[1]/ul[1]/li[30]/div[2]/div[1],0.0,285,307,6210,6122,15,15,6228,6139,2,2,"Open Sans","Open Sans",1,0',
    'http://192.168.0.13:8080/26/index.html,386,DIV,1,61,"iOS 14.5 - Safari -- iOS 14.5 - iPhone 12","iOS 14.5 - Safari -- iOS 14.5 - iPhone 12 mini",null,null,3.0,3.0,null,null,48,48,30820,35202,234,234,334,319,48,48,30820,35202,0.0,0.0,1170,1125,390,375,/body[2]/main[5]/ul[6]/li[20]/div[1],/body[2]/main[5]/ul[6]/li[20]/div[1],/body[2]/main[5]/ul[6]/li[20]/div[1],0.0,48,48,29986,34138,48,48,31123,35505,2,2,-webkit-standard,-webkit-standard,0,0'
  ];

  let data_raw = rows.filter((cur, index) => index < n),
      data = [],
      attributes = [
        { 'name': 'URL', 'type': 'string' }, { 'name': 'id', 'type': 'numeric' },
        { 'name': 'tagName', 'type': 'string' }, { 'name': 'childsNumber', 'type': 'numeric' },
        { 'name': 'textLength', 'type': 'numeric' }, { 'name': 'basePlatform', 'type': 'string' },
        { 'name': 'targetPlatform', 'type': 'string' }, { 'name': 'baseBrowser', 'type': 'string' },
        { 'name': 'targetBrowser', 'type': 'string' }, { 'name': 'baseDPI', 'type': 'numeric' },
        { 'name': 'targetDPI', 'type': 'numeric' }, { 'name': 'baseScreenshot', 'type': 'string' },
        { 'name': 'targetScreenshot', 'type': 'string' }, { 'name': 'baseX', 'type': 'numeric' },
        { 'name': 'targetX', 'type': 'numeric' }, { 'name': 'baseY', 'type': 'numeric' },
        { 'name': 'targetY', 'type': 'numeric' }, { 'name': 'baseHeight', 'type': 'numeric' },
        { 'name': 'targetHeight', 'type': 'numeric' }, { 'name': 'baseWidth', 'type': 'numeric' },
        { 'name': 'targetWidth', 'type': 'numeric' }, { 'name': 'baseParentX', 'type': 'numeric' },
        { 'name': 'targetParentX', 'type': 'numeric' }, { 'name': 'baseParentY', 'type': 'numeric' },
        { 'name': 'targetParentY', 'type': 'numeric' }, { 'name': 'imageDiff', 'type': 'numeric' },
        { 'name': 'chiSquared', 'type': 'numeric' }, { 'name': 'baseDeviceWidth', 'type': 'numeric' },
        { 'name': 'targetDeviceWidth', 'type': 'numeric' }, { 'name': 'baseViewportWidth', 'type': 'numeric' },
        { 'name': 'targetViewportWidth', 'type': 'numeric' }, { 'name': 'xpath', 'type': 'string' },
        { 'name': 'baseXpath', 'type': 'string' }, { 'name': 'targetXpath', 'type': 'string' },
        { 'name': 'phash', 'type': 'numeric' },
        { 'name': 'basePreviousSiblingLeft', 'type': 'numeric' },
        { 'name': 'targetPreviousSiblingLeft', 'type': 'numeric' },
        { 'name': 'basePreviousSiblingTop', 'type': 'numeric' },
        { 'name': 'targetPreviousSiblingTop', 'type': 'numeric' },
        { 'name': 'baseNextSiblingLeft', 'type': 'numeric' },
        { 'name': 'targetNextSiblingLeft', 'type': 'numeric' },
        { 'name': 'baseNextSiblingTop', 'type': 'numeric' },
        { 'name': 'targetNextSiblingTop', 'type': 'numeric' },
        { 'name': 'baseTextNodes', 'type': 'numeric' },
        { 'name': 'targetTextNodes', 'type': 'numeric' },
        { 'name': 'baseFontFamily', 'type': 'string' },
        { 'name': 'targetFontFamily', 'type': 'string' },
        { 'name': 'internal', 'type': 'enum', 'values': [1, 0] },
        { 'name': 'external', 'type': 'enum', 'values': [1, 0] }
      ];

  data_raw.forEach((value) => {
    let row = {},
        raw_row = value.split(',');
    attributes.forEach((attribute, ind) => {
      if (attribute['type'] === 'numeric') {
        if (raw_row[ind].search('\\.') >= 0)
          row[attribute['name']] = parseFloat(raw_row[ind]);
        else
          row[attribute['name']] = parseInt(raw_row[ind]);
      }
      if (attribute['type'] === 'string')
        row[attribute['name']] = raw_row[ind].replace(/"/g, '');
      if (attribute['type'] === 'enum')
        row[attribute['name']] = raw_row[ind];
    });
    data.push(row);
  });

  return [attributes, data, `
@RELATION browserninja.website
@ATTRIBUTE URL STRING
@ATTRIBUTE id NUMERIC
@ATTRIBUTE tagName STRING
@ATTRIBUTE childsNumber NUMERIC
@ATTRIBUTE textLength NUMERIC
@ATTRIBUTE basePlatform STRING
@ATTRIBUTE targetPlatform STRING
@ATTRIBUTE baseBrowser STRING
@ATTRIBUTE targetBrowser STRING
@ATTRIBUTE baseDPI NUMERIC
@ATTRIBUTE targetDPI NUMERIC
@ATTRIBUTE baseScreenshot STRING
@ATTRIBUTE targetScreenshot STRING
@ATTRIBUTE baseX NUMERIC
@ATTRIBUTE targetX NUMERIC
@ATTRIBUTE baseY NUMERIC
@ATTRIBUTE targetY NUMERIC
@ATTRIBUTE baseHeight NUMERIC
@ATTRIBUTE targetHeight NUMERIC
@ATTRIBUTE baseWidth NUMERIC
@ATTRIBUTE targetWidth NUMERIC
@ATTRIBUTE baseParentX NUMERIC
@ATTRIBUTE targetParentX NUMERIC
@ATTRIBUTE baseParentY NUMERIC
@ATTRIBUTE targetParentY NUMERIC
@ATTRIBUTE imageDiff NUMERIC
@ATTRIBUTE chiSquared NUMERIC
@ATTRIBUTE baseDeviceWidth NUMERIC
@ATTRIBUTE targetDeviceWidth NUMERIC
@ATTRIBUTE baseViewportWidth NUMERIC
@ATTRIBUTE targetViewportWidth NUMERIC
@ATTRIBUTE xpath STRING
@ATTRIBUTE baseXpath STRING
@ATTRIBUTE targetXpath STRING
@ATTRIBUTE phash NUMERIC
@ATTRIBUTE basePreviousSiblingLeft NUMERIC
@ATTRIBUTE targetPreviousSiblingLeft NUMERIC
@ATTRIBUTE basePreviousSiblingTop NUMERIC
@ATTRIBUTE targetPreviousSiblingTop NUMERIC
@ATTRIBUTE baseNextSiblingLeft NUMERIC
@ATTRIBUTE targetNextSiblingLeft NUMERIC
@ATTRIBUTE baseNextSiblingTop NUMERIC
@ATTRIBUTE targetNextSiblingTop NUMERIC
@ATTRIBUTE baseTextNodes NUMERIC
@ATTRIBUTE targetTextNodes NUMERIC
@ATTRIBUTE baseFontFamily STRING
@ATTRIBUTE targetFontFamily STRING
@ATTRIBUTE external {1,0}
@ATTRIBUTE internal {1,0}
@DATA
${data_raw.join('\n')}`];
}

describe('/classified', () => {

  beforeEach(() => {
    jest.mock('fs');
  });

  it('/classified should return a single row', async () => {
    const [attributes, data, arff] = get_rows(1);

    fs.promises = {};
    fs.promises.readFile = jest.fn();
    fs.promises.readFile.mockResolvedValue(arff);

    const resp = await request(app).get('/classified?uncached=1')
                                   .expect('Content-type', /json/)
                                   .expect(200);

    expect(resp.body).toEqual({ length: 1 });
    expect(fs.promises.readFile).toHaveBeenCalledWith(
      './data/dataset.classified.arff', { encoding: 'utf8' });
  });

  it('/classified should return three rows', async () => {
    const [attributes, data, arff] = get_rows(3);

    fs.promises = {};
    fs.promises.readFile = jest.fn();
    fs.promises.readFile.mockResolvedValue(arff);

    const resp = await request(app).get('/classified?uncached=1')
                                   .expect('Content-type', /json/)
                                   .expect(200);

    expect(resp.body).toEqual({ length: 3 });
    expect(fs.promises.readFile).toHaveBeenCalledWith(
      './data/dataset.classified.arff', { encoding: 'utf8' });
  });

  it('/classified should return empty if exception is thrown', async () => {
    fs.promises = {};
    fs.promises.readFile = jest.fn();
    fs.promises.readFile.mockRejectedValue('File not found!!! (Simulation)');

    const resp = await request(app).get('/classified?uncached=1')
                                   .expect('Content-type', /json/)
                                   .expect(200);

    expect(resp.body).toEqual({ length: -1 });
    expect(fs.promises.readFile).toHaveBeenCalledWith(
      './data/dataset.classified.arff', { encoding: 'utf8' });
  });

  describe('cached calls', () => {

    it('/classified should not call readFile', async () => {
      const [attributes, data, arff] = get_rows(2);

      fs.promises = {};
      fs.promises.readFile = jest.fn();
      fs.promises.readFile.mockResolvedValue(arff);

      const resp = await request(app).get('/classified')
                                     .expect('Content-type', /json/)
                                     .expect(200);

      expect(resp.body).toEqual({ length: 3 });
      expect(fs.promises.readFile).not.toHaveBeenCalled();
    });

  });
});
