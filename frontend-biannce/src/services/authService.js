import axios from 'axios';

// Configurar instancia base de axios para auth
const API = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

class AuthService {
  async register(userData) {
    try {
      const response = await API.post('/usuarios/registro', userData);
      
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Error de conexión' 
      };
    }
  }

  async login(email, password) {
    try {
      const response = await API.post('/usuarios/login', { email, password });

      // Adaptar la respuesta de la API al formato esperado por el contexto
      return { 
        success: true, 
        data: {
          token: response.data.data.token,
          user: response.data.data.usuario
        }
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Error de conexión' 
      };
    }
  }
}

export default new AuthService();