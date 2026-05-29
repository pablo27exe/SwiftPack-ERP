import axios from 'axios'

// Función para obtener la URL base automáticamente
const getBaseURL = () => {
  // Si estamos en localhost (misma PC)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:8000';
  }
  
  // Si estamos en la red local (móvil u otra PC)
  // Usar la misma IP del frontend pero cambiando el puerto a 8000
  const hostname = window.location.hostname;
  return `http://${hostname}:8000`;
};

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || getBaseURL(),
    headers: {
        'Content-Type': 'application/json',
    },
})

// Interceptor para agregar token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token')
        if (token){
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response?.status === 401){
            localStorage.removeItem('access_token')
            localStorage.removeItem('user')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default api