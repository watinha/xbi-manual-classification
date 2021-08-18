const App = ({ renderer, max=100000 }) => {
  let cursor = 0;

  renderer.render();

  const self = {
    get_cursor: () => cursor,
    set_cursor: (v) => {
      cursor = Math.max(
        Math.min(v, max), 0);
      renderer.render();
    },
    next: () => {
      self.set_cursor(cursor + 1);
    },
    previous: () => {
      self.set_cursor(cursor - 1);
    }
  };

  return self;
};

export default App;
