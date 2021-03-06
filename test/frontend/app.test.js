/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals';
import axios from 'axios';

import App from '../../frontend/js/app.js';

jest.mock('axios');

describe('app', () => {

  describe('cursor handling', () => {

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

      app.set_cursor(0);

      app.previous();

      expect(app.get_cursor()).toBe(0);
      expect(renderer_mock.render.mock.calls.length).toBe(3);
    });

  });

  describe('classifying and saving', () => {

    it('should send classified row (id=0) to the server', async () => {
      const renderer_mock = { render: jest.fn() },
            app = App({ renderer: renderer_mock, max: 33 }),
            row_stub = { external: 1, internal: 1 };

      axios.put = jest.fn();
      axios.put.mockResolvedValue({ message: 'success! yay' });

      app.classify(0, row_stub);

      expect(axios.put).toHaveBeenCalledWith('./classified/0', { data: row_stub });
    });

    it('should send a different classified row (id=2) to the server', async () => {
      const renderer_mock = { render: jest.fn() },
            app = App({ renderer: renderer_mock, max: 33 }),
            row_stub = { external: 0, internal: 0 };

      axios.put = jest.fn();
      axios.put.mockResolvedValue({ message: 'success! yay' });

      app.classify(2, row_stub);

      expect(axios.put).toHaveBeenCalledWith('./classified/2', { data: row_stub });
    });

    it('should send save action to server', async () => {
      const renderer_mock = { render: jest.fn() },
            app = App({ renderer: renderer_mock, max: 33 });

      axios.post = jest.fn();
      axios.post.mockResolvedValue({ message: 'Arff file generated!!!' });

      app.save();

      expect(axios.post).toHaveBeenCalledWith('./classified');
    });

  });

  describe('search', () => {
    it('should search for closest element and update cursor', async () => {
      const renderer_mock = { render: jest.fn() },
            app = App({ renderer: renderer_mock });

      axios.get = jest.fn();
      axios.get.mockResolvedValue({ data: { closest: 32 } });
      app.set_cursor(52);

      app.set_cursor = jest.fn();

      await app.search({ x: 12, y: 34 });

      expect(axios.get).toHaveBeenCalledWith('./classified/base/12/34/52');
      expect(app.set_cursor).toHaveBeenCalledWith(32);
    });

    it('should search for closest element and update cursor with different parameter', async () => {
      const renderer_mock = { render: jest.fn() },
            app = App({ renderer: renderer_mock });

      axios.get = jest.fn();
      axios.get.mockResolvedValue({ data: { closest: 13 } });
      app.set_cursor(230);

      app.set_cursor = jest.fn();

      await app.search({ x: 56, y: 78 });

      expect(axios.get).toHaveBeenCalledWith('./classified/base/56/78/230');
      expect(app.set_cursor).toHaveBeenCalledWith(13);
    });
  });

  describe('next_website', () => {

    it('should go to next, sending request to server and updating cursor', async () => {
      const renderer_mock = { render: jest.fn() },
            app = App({ renderer: renderer_mock });

      axios.get = jest.fn();
      axios.get.mockResolvedValue({ data: { id: 56 } });
      app.set_cursor(34);

      app.set_cursor = jest.fn();

      await app.next_website();

      expect(axios.get).toHaveBeenCalledWith('./classified/next/34');
      expect(app.set_cursor).toHaveBeenCalledWith(56);
    });

    it('should go to next, sending request to server and updating cursor again', async () => {
      const renderer_mock = { render: jest.fn() },
            app = App({ renderer: renderer_mock });

      axios.get = jest.fn();
      axios.get.mockResolvedValue({ data: { id: 13 } });
      app.set_cursor(13);

      app.set_cursor = jest.fn();

      await app.next_website();

      expect(axios.get).toHaveBeenCalledWith('./classified/next/13');
      expect(app.set_cursor).toHaveBeenCalledWith(13);
    });

  });

  describe('back_website', () => {

    it('should go to back, sending request to server and updating cursor', async () => {
      const renderer_mock = { render: jest.fn() },
            app = App({ renderer: renderer_mock });

      axios.get = jest.fn();
      axios.get.mockResolvedValue({ data: { id: 56 } });
      app.set_cursor(34);

      app.set_cursor = jest.fn();

      await app.back_website();

      expect(axios.get).toHaveBeenCalledWith('./classified/back/34');
      expect(app.set_cursor).toHaveBeenCalledWith(56);
    });

    it('should go to back, sending request to server and updating cursor again', async () => {
      const renderer_mock = { render: jest.fn() },
            app = App({ renderer: renderer_mock });

      axios.get = jest.fn();
      axios.get.mockResolvedValue({ data: { id: 13 } });
      app.set_cursor(13);

      app.set_cursor = jest.fn();

      await app.back_website();

      expect(axios.get).toHaveBeenCalledWith('./classified/back/13');
      expect(app.set_cursor).toHaveBeenCalledWith(13);
    });

  });

});
