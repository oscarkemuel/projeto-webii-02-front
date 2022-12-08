import axios from 'axios';
import { parseCookies } from 'nookies';

const { authtoken } = parseCookies();

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`
});

if (authtoken) {
  api.defaults.headers.common.Authorization = `Bearer ${authtoken}`;
}

export default api;
