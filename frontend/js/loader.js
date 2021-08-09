import axios from 'axios';

const Loader = ({ url, target, mapping }) => {

  return {
    render: async () => {
      const response = await axios.get(url);
      target.innerHTML = mapping(response.data);
    }
  };

};

export default Loader;
