export default (components) => {

  return {
    render: () => {
      components.forEach((component) => component.render());
    }
  };

};
