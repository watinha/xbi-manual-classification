/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals';
import axios from 'axios';

import App from '../../frontend/js/app.js';

describe('app', () => {

  it('should call renderer.render when initialized', () => {
    const renderer_mock = { render: jest.fn() },
          app = App({ renderer: renderer_mock });

    expect(renderer_mock.render).toHaveBeenCalled();
  });

  it('should initialize get_cursor with 0', () => {
    const renderer_mock = { render: jest.fn() },
          app = App({ renderer: renderer_mock });

    expect(app.get_cursor()).toBe(0);
  });

  it('should increment cursor, after next is called', () => {
    const renderer_mock = { render: jest.fn() },
          app = App({ renderer: renderer_mock });

    app.next();
    expect(app.get_cursor()).toBe(1);
    expect(renderer_mock.render.mock.calls.length).toBe(2);
    app.next();
    expect(app.get_cursor()).toBe(2);
    expect(renderer_mock.render.mock.calls.length).toBe(3);
  });

  it('should not increment cursor, if max limit is reached', () => {
    const renderer_mock = { render: jest.fn() },
          app = App({ renderer: renderer_mock, max: 3 });

    app.next();
    expect(renderer_mock.render.mock.calls.length).toBe(2);
    app.next();
    expect(renderer_mock.render.mock.calls.length).toBe(3);
    app.next();
    expect(renderer_mock.render.mock.calls.length).toBe(4);
    app.next();
    expect(app.get_cursor()).toBe(3);
    expect(renderer_mock.render.mock.calls.length).toBe(5);
  });

  it('should set cursor to an initial position', () => {
    const renderer_mock = { render: jest.fn() },
          app = App({ renderer: renderer_mock });

    app.set_cursor(99);
    expect(app.get_cursor()).toBe(99);
    expect(renderer_mock.render.mock.calls.length).toBe(2);
  });

  it('should set cursor to another position', () => {
    const renderer_mock = { render: jest.fn() },
          app = App({ renderer: renderer_mock });

    app.set_cursor(72);
    expect(app.get_cursor()).toBe(72);
    expect(renderer_mock.render.mock.calls.length).toBe(2);
  });

  it('should not set cursor beyound max', () => {
    const renderer_mock = { render: jest.fn() },
          app = App({ renderer: renderer_mock, max: 2 });

    app.set_cursor(77);
    expect(app.get_cursor()).toBe(2);
    expect(renderer_mock.render.mock.calls.length).toBe(2);
  });

  it('should not set cursor to lower than 0', () => {
    const renderer_mock = { render: jest.fn() },
          app = App({ renderer: renderer_mock, max: 2 });

    app.set_cursor(-3);
    expect(app.get_cursor()).toBe(0);
    expect(renderer_mock.render.mock.calls.length).toBe(2);
  });

  it('should decrement cursor when previous is pressed', () => {
    const renderer_mock = { render: jest.fn() },
          app = App({ renderer: renderer_mock, max: 33 });

    app.set_cursor(33);
    app.previous();

    expect(app.get_cursor()).toBe(32);
    expect(renderer_mock.render.mock.calls.length).toBe(3);

    app.previous();

    expect(app.get_cursor()).toBe(31);
    expect(renderer_mock.render.mock.calls.length).toBe(4);
  });

  it('should not decrement cursor if 0 is reached', () => {
    const renderer_mock = { render: jest.fn() },
          app = App({ renderer: renderer_mock, max: 33 });

    app.previous();

    expect(app.get_cursor()).toBe(0);
    expect(renderer_mock.render.mock.calls.length).toBe(2);
  });

});
