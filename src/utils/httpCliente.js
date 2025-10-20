import axios from 'axios';
import { useAuthStore } from '../store/authStore';
const API = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API,
});

export const getProducts = async () => {
  try {
    const response = await fetch(API);
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    const dataProducts = await response.json();
    return dataProducts; // ← ahora sí retorna los datos
  } catch (error) {
    console.error(error);
    return null; // o podrías lanzar el error si preferís manejarlo desde afuera
  }
};

// console.log(dataProducts)

// Interceptor para agregar token automáticamente
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar tokens expirados
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) => api.post('/login', { email, password }),
};

export default api;