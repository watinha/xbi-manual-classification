import axios from 'axios';

const LengthRenderer = ({ url, target }) => {

  return {
    render: async () => {
      const response = await axios.get(url);
      target.innerHTML = response.length;
    }
  };

};

export default LengthRenderer;
