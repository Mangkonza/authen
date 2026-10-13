// src/services/menuApi.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/menu';

export const menuApi = {
  getAll: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },
  create: async (data) => {
    const response = await axios.post(API_URL, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  },
};