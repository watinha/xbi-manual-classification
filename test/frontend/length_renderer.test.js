/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals';
import axios from 'axios';

import LengthRenderer from '../../frontend/js/length_renderer.js';

jest.mock('axios');

let container;

describe('length_renderer', () => {

  beforeEach(() => {
    container = document.createElement('div');
  });

  it('should render 0 elements', async () => {
    const renderer = LengthRenderer({
            'url': 'http://url1.com',
            'target': container
          }),
          json = { length: 0 };

    axios.get = jest.fn();
    axios.get.mockResolvedValue(json);

    expect(container.innerHTML).not.toContain('0');

    await renderer.render();

    expect(container.innerHTML).toContain('0');
    expect(axios.get).toHaveBeenCalledWith('http://url1.com');
  });

  it('should render 1 element', async () => {
    const renderer = LengthRenderer({
            'url': 'http://url2.com',
            'target': container
          }),
          json = { length: 1 };

    axios.get = jest.fn();
    axios.get.mockResolvedValue(json);

    expect(container.innerHTML).not.toContain('1');

    await renderer.render();

    expect(container.innerHTML).toContain('1');
    expect(axios.get).toHaveBeenCalledWith('http://url2.com');
  });
});
