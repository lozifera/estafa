import axios from 'axios';

// Configurar instancia base de axios
const API = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para agregar token de autenticación
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class AdminService {
  // ========== GESTIÓN DE MONEDAS ==========
  
  async getAllCurrencies() {
    try {
      const response = await API.get('/monedas');
      
      return { 
        success: true, 
        data: response.data.data || [],
        message: response.data.message 
      };
    } catch (error) {
      console.error('AdminService getAllCurrencies error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Error de conexión',
        data: []
      };
    }
  }

  async createCurrency(currencyData) {
    try {
      console.log('Creating currency with data:', currencyData);

      const response = await API.post('/monedas', currencyData);

      return { 
        success: true, 
        data: response.data.data,
        message: response.data.message 
      };
    } catch (error) {
      console.error('AdminService createCurrency error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Error de conexión' 
      };
    }
  }

  async updateCurrency(id, currencyData) {
    try {
      console.log('Updating currency:', id, currencyData);

      const response = await API.put(`/monedas/${id}`, currencyData);

      return { 
        success: true, 
        data: response.data.data,
        message: response.data.message 
      };
    } catch (error) {
      console.error('AdminService updateCurrency error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Error de conexión' 
      };
    }
  }

  async deleteCurrency(id) {
    try {
      console.log('Deleting currency:', id);

      const response = await API.delete(`/monedas/${id}`);

      return { 
        success: true, 
        message: response.data.message 
      };
    } catch (error) {
      console.error('AdminService deleteCurrency error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Error de conexión' 
      };
    }
  }

  // ========== GESTIÓN DE USUARIOS ==========

  async getAllUsers() {
    try {
      const response = await API.get('/usuarios/todos');

      return { 
        success: true, 
        data: response.data.data || [],
        message: response.data.message 
      };
    } catch (error) {
      console.error('AdminService getAllUsers error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Error de conexión',
        data: []
      };
    }
  }

  async toggleAdminPermissions(userId, newAdminValue) {
    try {
      console.log('Toggling admin permissions for user:', userId);
      console.log('New admin value:', newAdminValue);

      const response = await API.patch(`/usuarios/${userId}/admin`, {
        es_admin: newAdminValue
      });

      console.log('Response status:', response.status);
      console.log('Response data:', response.data);

      return { 
        success: true, 
        data: response.data.data,
        message: response.data.message 
      };
    } catch (error) {
      console.error('AdminService toggleAdminPermissions error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Error de conexión' 
      };
    }
  }
}

export default new AdminService();