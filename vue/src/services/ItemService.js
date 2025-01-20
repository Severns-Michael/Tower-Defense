import axios from 'axios';

export default {

  getItems() {
    return axios.get('/items')
  },

  getItemById(id) {
    return axios.get('/items' + id)
  },

  addItem(item) {
    return axios.post('/items', item)
  }

}