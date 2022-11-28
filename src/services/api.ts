import axios from 'axios';
import { parseCookies } from 'nookies';

const { authtoken } = parseCookies();

const api = axios.create({
  baseURL: 'http://localhost:3333/api/'
});

if (authtoken) {
  api.defaults.headers.common.Authorization = `Bearer ${authtoken}`;
}

export default api;
