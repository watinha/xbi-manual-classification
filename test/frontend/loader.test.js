/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals';
import axios from 'axios';

import Loader from '../../frontend/js/loader.js';

jest.mock('axios');

let container;

describe('loader', () => {

  beforeEach(() => {
    container = document.createElement('div');
    axios.get = jest.fn();
  });

  it('should render 0 elements', async () => {
    const mapping = jest.fn(),
          loader = Loader({
            'url': 'http://url1.com',
            'target': container,
            mapping
          }),
          json = { length: 0 };

    axios.get.mockResolvedValue({ data: json });
    mapping.mockReturnValueOnce('something nice and pretty');

    expect(container.innerHTML.length).toBe(0);

    await loader.render();

    expect(container.innerHTML).toContain('something nice and pretty');
    expect(axios.get).toHaveBeenCalledWith('http://url1.com');
    expect(mapping).toHaveBeenCalledWith(json);
  });

  it('should render 1 element', async () => {
    const mapping = jest.fn((data) => { console.log(data); }),
          loader = Loader({
            'url': 'http://url2.com',
            'target': container,
            mapping
          }),
          json = { length: 1 };

    axios.get.mockResolvedValue({ data: json });
    mapping.mockReturnValueOnce('abobrinha 1');

    expect(container.innerHTML.length).toBe(0);

    await loader.render();

    expect(container.innerHTML).toContain('abobrinha 1');
    expect(axios.get).toHaveBeenCalledWith('http://url2.com');
    expect(mapping).toHaveBeenCalledWith(json);
  });
});
