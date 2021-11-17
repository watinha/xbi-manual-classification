import { jest } from '@jest/globals';
import request from 'supertest';
import fs from 'fs';
import app from '../../backend/app';

function get_rows (n) {
  const rows = [
    '"http://192.168.0.13:8080/59/index.html",1281,"DIV",1,131,"iOS 14.5 - Safari -- iOS 14.5 - iPhone 12","Android null - Chrome -- Android API28 - Pixel","null","null",3,3.5,"null","null",168,15,11953,11816,31,29,198,178,0,0,11657,11528,0,0,1170,1440,390,412,"/body[2]/div[8]/div[1]/div[8]/div[3]/div[16]","/body[2]/div[8]/div[1]/div[8]/div[3]/div[16]","/body[2]/div[8]/div[1]/div[8]/div[3]/div[16]",0,15,217,11953,11771,15,198,11999,11816,0,0,"Open Sans","Open Sans",0,1',
    '"http://192.168.0.13:8080/59/index.html",739,"DIV",1,140,"iOS 14.5 - Safari -- iOS 14.5 - iPhone 12","Android null - Chrome -- Android API28 - Pixel","null","null",3,3.5,"null","null",15,15,6210,6122,18,17,260,282,15,15,6210,6122,0,0,1170,1440,390,412,"/body[2]/div[8]/div[1]/div[4]/div[1]/ul[1]/li[30]/div[2]/div[1]","/body[2]/div[8]/div[1]/div[4]/div[1]/ul[1]/li[30]/div[2]/div[1]","/body[2]/div[8]/div[1]/div[4]/div[1]/ul[1]/li[30]/div[2]/div[1]",0,285,307,6210,6122,15,15,6228,6139,2,2,"Open Sans","Open Sans",1,0',
    '"http://192.168.0.13:8080/26/index.html",386,"DIV",1,61,"iOS 14.5 - Safari -- iOS 14.5 - iPhone 12","iOS 14.5 - Safari -- iOS 14.5 - iPhone 12 max pro","null","null",3,3,"null","null",48,48,30820,35202,234,234,334,319,48,48,30820,35202,0,0,1170,1125,390,375,"/body[2]/main[5]/ul[6]/li[20]/div[1]","/body[2]/main[5]/ul[6]/li[20]/div[1]","/body[2]/main[5]/ul[6]/li[20]/div[1]",0,48,48,29986,34138,48,48,31123,35505,2,2,"-webkit-standard","-webkit-standard",0,0',
    '"http://192.168.0.13:8080/26/index.html",386,"DIV",1,61,"iOS 14.5 - Safari -- iOS 14.5 - iPhone 12","iOS 14.5 - Safari -- iOS 14.5 - iPhone 12 mini","null","null",3,3,"null","null",48,48,60000,35202,234,234,334,319,48,48,30820,35202,0,0,1170,1125,390,375,"/body[2]/main[5]/ul[6]/li[20]/div[1]","/body[2]/main[5]/ul[6]/li[20]/div[1]","/body[2]/main[5]/ul[6]/li[20]/div[1]",0,48,48,29986,34138,48,48,31123,35505,2,2,"-webkit-standard","-webkit-standard",0,0'
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
        { 'name': 'external', 'type': 'enum', 'values': [1, 0] },
        { 'name': 'internal', 'type': 'enum', 'values': [1, 0] },
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
        row[attribute['name']] = +raw_row[ind]; //.replace(/"/g, '');
    });
    data.push(row);
  });

  const arff_header = `@RELATION browserninja.website

@ATTRIBUTE URL string
@ATTRIBUTE id numeric
@ATTRIBUTE tagName string
@ATTRIBUTE childsNumber numeric
@ATTRIBUTE textLength numeric
@ATTRIBUTE basePlatform string
@ATTRIBUTE targetPlatform string
@ATTRIBUTE baseBrowser string
@ATTRIBUTE targetBrowser string
@ATTRIBUTE baseDPI numeric
@ATTRIBUTE targetDPI numeric
@ATTRIBUTE baseScreenshot string
@ATTRIBUTE targetScreenshot string
@ATTRIBUTE baseX numeric
@ATTRIBUTE targetX numeric
@ATTRIBUTE baseY numeric
@ATTRIBUTE targetY numeric
@ATTRIBUTE baseHeight numeric
@ATTRIBUTE targetHeight numeric
@ATTRIBUTE baseWidth numeric
@ATTRIBUTE targetWidth numeric
@ATTRIBUTE baseParentX numeric
@ATTRIBUTE targetParentX numeric
@ATTRIBUTE baseParentY numeric
@ATTRIBUTE targetParentY numeric
@ATTRIBUTE imageDiff numeric
@ATTRIBUTE chiSquared numeric
@ATTRIBUTE baseDeviceWidth numeric
@ATTRIBUTE targetDeviceWidth numeric
@ATTRIBUTE baseViewportWidth numeric
@ATTRIBUTE targetViewportWidth numeric
@ATTRIBUTE xpath string
@ATTRIBUTE baseXpath string
@ATTRIBUTE targetXpath string
@ATTRIBUTE phash numeric
@ATTRIBUTE basePreviousSiblingLeft numeric
@ATTRIBUTE targetPreviousSiblingLeft numeric
@ATTRIBUTE basePreviousSiblingTop numeric
@ATTRIBUTE targetPreviousSiblingTop numeric
@ATTRIBUTE baseNextSiblingLeft numeric
@ATTRIBUTE targetNextSiblingLeft numeric
@ATTRIBUTE baseNextSiblingTop numeric
@ATTRIBUTE targetNextSiblingTop numeric
@ATTRIBUTE baseTextNodes numeric
@ATTRIBUTE targetTextNodes numeric
@ATTRIBUTE baseFontFamily string
@ATTRIBUTE targetFontFamily string
@ATTRIBUTE external {1,0}
@ATTRIBUTE internal {1,0}

@DATA`;

  return [attributes, data, `${arff_header}
${data_raw.join('\n')}`, arff_header];
}

describe('/classified', () => {

  beforeEach(() => {
    jest.mock('fs');
  });

  it('should return a single row', async () => {
    const [attributes, data, arff] = get_rows(1);

    fs.promises.readFile = jest.fn();
    fs.promises.readFile.mockResolvedValue(arff);

    const resp = await request(app).get('/classified?uncached=1')
                                   .expect('Content-type', /json/)
                                   .expect(200);

    expect(resp.body).toEqual({ length: 1 });
    expect(fs.promises.readFile).toHaveBeenCalledWith(
      './data/dataset.classified.arff', { encoding: 'utf8' });
  });

  it('should return three rows', async () => {
    const [attributes, data, arff] = get_rows(3);

    fs.promises.readFile = jest.fn();
    fs.promises.readFile.mockResolvedValue(arff);

    const resp = await request(app).get('/classified?uncached=1')
                                   .expect('Content-type', /json/)
                                   .expect(200);

    expect(resp.body).toEqual({ length: 3 });
    expect(fs.promises.readFile).toHaveBeenCalledWith(
      './data/dataset.classified.arff', { encoding: 'utf8' });
  });

  it('should return empty if exception is thrown', async () => {
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

    it('should not call readFile', async () => {
      const [attributes, data, arff] = get_rows(2);

      fs.promises.readFile = jest.fn();
      fs.promises.readFile.mockResolvedValue(arff);

      const resp = await request(app).get('/classified')
                                     .expect('Content-type', /json/)
                                     .expect(200);

      expect(resp.body).toEqual({ length: 3 });
      expect(fs.promises.readFile).not.toHaveBeenCalled();
    });

  });

  describe('search', () => {

    beforeAll(async () => {
      const [attributes, data, arff] = get_rows(4);
      /*
       *  ID URL    X     Y PLATFORM
       * [0] url1 168 11953 target1
       * [1] url1  15  6210 target1
       * [2] url2  38 30820 target1
       * [3] url2  38 60000 target2
       */
      fs.promises.readFile = jest.fn();
      fs.promises.readFile.mockResolvedValue(arff);

      const resp = await request(app).get('/classified?uncached=1')
                                     .expect('Content-type', /json/)
                                     .expect(200);
    });

    it('should search up for element based on base position', async () => {
      let resp = await request(app).get('/classified/base/168/11953/0')
                                   .expect(200)
                                   .expect('Content-type', /json/);

      expect(resp.body).toEqual({ 'closest': 0 });
    });

    it('should search up for a different element based on base position', async () => {
      let resp = await request(app).get('/classified/base/15/6210/0')
                                   .expect(200)
                                   .expect('Content-type', /json/);

      expect(resp.body).toEqual({ 'closest': 1 });
    });

    it('should search up for closest element based on base position', async () => {
      let resp = await request(app).get('/classified/base/100/10000/0')
                                   .expect(200)
                                   .expect('Content-type', /json/);

      expect(resp.body).toEqual({ 'closest': 0 });
    });

    it('should search up for closest element based on base position, with another base', async () => {
      let resp = await request(app).get('/classified/base/100/5000/0')
                                   .expect(200)
                                   .expect('Content-type', /json/);

      expect(resp.body).toEqual({ 'closest': 1 });
    });

    it('should search up for closest element starting from current element', async () => {
      let resp = await request(app).get('/classified/base/100/6100/1')
                                   .expect(200)
                                   .expect('Content-type', /json/);

      expect(resp.body).toEqual({ 'closest': 1 });
    });

    it('should search up for closest element in 0 x 0 position', async () => {
      let resp = await request(app).get('/classified/base/0/0/0')
                                   .expect(200)
                                   .expect('Content-type', /json/);

      expect(resp.body).toEqual({ 'closest': 1 });
    });


    it('should search up for closest element in the same webpage', async () => {
      let resp = await request(app).get('/classified/base/40/6100/1')
                                   .expect(200)
                                   .expect('Content-type', /json/);

      expect(resp.body).toEqual({ 'closest': 1 });
    });

    it('should search down for closest element in 168 x 10000 position', async () => {
      let resp = await request(app).get('/classified/base/168/10000/1')
                                   .expect(200)
                                   .expect('Content-type', /json/);

      expect(resp.body).toEqual({ 'closest': 0 });
    });

    it('should search for closest element considering the same platform', async () => {
      let resp = await request(app).get('/classified/base/168/10000/3')
                                   .expect(200)
                                   .expect('Content-type', /json/);

      expect(resp.body).toEqual({ 'closest': 3 });
    });

    it('should search for another closest element considering the same platform', async () => {
      let resp = await request(app).get('/classified/base/38/60000/2')
                                   .expect(200)
                                   .expect('Content-type', /json/);

      expect(resp.body).toEqual({ 'closest': 2 });
    });

  });

  describe('editing classified', () => {

    const [attributes, data, arff, arff_header] = get_rows(3);

    beforeAll(async () => {
      fs.promises.readFile = jest.fn();
      fs.promises.readFile.mockResolvedValue(arff);

      const resp = await request(app).get('/classified?uncached=1')
                                     .expect('Content-type', /json/)
                                     .expect(200);
    });

    function generate_arff (data) {
      return (arff_header + '\n' +
        data.map((row) => attributes.map((attr) => {
          if (attr.type === 'string')
            return `"${row[attr.name]}"`;
          return row[attr.name];
        }).join(',')).join('\n') + '\n');
    }

    it('should edit row to classified file', async () => {
      let json = data[0],
          new_arff = '';

      json.internal = 0;
      json.external = 0;

      new_arff = generate_arff(data);

      let resp = await request(app).put('/classified/0')
                                   .send({ data: json })
                                   .expect(200)
                                   .expect('Content-type', /json/);

      expect(resp.body).toEqual({ message: 'success! yay' });

      fs.promises.writeFile = jest.fn();
      fs.promises.writeFile.mockResolvedValue({});

      resp = await request(app).post('/classified')
                               .send({ action: 'save' })
                               .expect('Content-type', /json/)
                               .expect(200);

      expect(resp.body).toEqual({ message: 'Arff file generated!!!' });
      expect(fs.promises.writeFile).toHaveBeenCalledWith(
        './data/dataset.classified.arff', new_arff);
    });

    it('should classity another row and save to classified file', async () => {
      let json = data[2],
          new_arff = '';

      json.internal = 1;
      json.external = 1;

      new_arff = generate_arff(data);

      let resp = await request(app).put('/classified/2')
                                   .send({ data: json })
                                   .expect(200)
                                   .expect('Content-type', /json/);

      expect(resp.body).toEqual({ message: 'success! yay' });

      fs.promises.writeFile = jest.fn();
      fs.promises.writeFile.mockResolvedValue({});

      resp = await request(app).post('/classified')
                               .send({ action: 'save' })
                               .expect('Content-type', /json/)
                               .expect(200);

      expect(resp.body).toEqual({ message: 'Arff file generated!!!' });
      expect(fs.promises.writeFile).toHaveBeenCalledWith(
        './data/dataset.classified.arff', new_arff);
    });

  });

  describe('next/back', () => {

    beforeAll(async () => {
      const [attributes, data, arff] = get_rows(4);
      /*
       *  ID URL    X     Y PLATFORM
       * [0] url1 168 11953 target1
       * [1] url1  15  6210 target1
       * [2] url2  38 30820 target1
       * [3] url2  38 60000 target2
       */
      fs.promises.readFile = jest.fn();
      fs.promises.readFile.mockResolvedValue(arff);

      const resp = await request(app).get('/classified?uncached=1')
                                     .expect('Content-type', /json/)
                                     .expect(200);
    });

    it('should go to next website in the dataset', async () => {
      let resp = await request(app).get('/classified/next/0')
                                   .expect(200)
                                   .expect('Content-type', /json/);

      expect(resp.body).toEqual({ 'id': 2 });
    });

    it('should remain in the same website in the dataset', async () => {
      let resp = await request(app).get('/classified/next/3')
                                   .expect(200)
                                   .expect('Content-type', /json/);

      expect(resp.body).toEqual({ 'id': 3 });
    });

    it('should go to previous website in the dataset', async () => {
      let resp = await request(app).get('/classified/back/3')
                                   .expect(200)
                                   .expect('Content-type', /json/);

      expect(resp.body).toEqual({ 'id': 1 });
    });

    it('should remain in the same website in the dataset', async () => {
      let resp = await request(app).get('/classified/back/0')
                                   .expect(200)
                                   .expect('Content-type', /json/);

      expect(resp.body).toEqual({ 'id': 0 });
    });

  });

});
