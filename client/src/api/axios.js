// one place to manage all API calls  if the backend url ever changes, just update baseURL here
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// interceptor runs before every single request
// it grabs the token from localStorage and sticks it in the header automatically
// so we never have to manually add Authorization: Bearer  in every page
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('carty_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
