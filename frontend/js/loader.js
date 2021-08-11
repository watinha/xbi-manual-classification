import axios from 'axios';

const cache = {};

const Loader = ({ url, target, mapping }) => {

  return {
    render: async () => {
      if (!cache[url])
        cache[url] = await axios.get(url);

      const response = cache[url];
      target.innerHTML = mapping(response.data);
    }
  };

};

export default Loader;
