import axios from 'axios';

const cache = {};

const Loader = ({ url, target, mapping }) => {

  return {
    render: async () => {
      const url_parameter = url.call ? url() : url;

      if (!cache[url_parameter])
        cache[url_parameter] = await axios.get(url_parameter);

      const response = cache[url_parameter];
      target.innerHTML = mapping(response.data);
    }
  };

};

export default Loader;
