import { jest } from '@jest/globals';
import Renderer from '../../frontend/js/renderer.js';

describe('renderer', () => {

  it('should call render from one {}', () => {
    const mock = { render: jest.fn() },
          renderer = Renderer([ mock ]);

    renderer.render();

    expect(mock.render).toHaveBeenCalled();
  });

  it('should call render from multiple component', () => {
    const mock1 = { render: jest.fn() },
          mock2 = { render: jest.fn() },
          renderer = Renderer([ mock1, mock2 ]);

    renderer.render();

    expect(mock1.render).toHaveBeenCalled();
    expect(mock2.render).toHaveBeenCalled();
  });

});
