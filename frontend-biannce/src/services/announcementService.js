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

class AnnouncementService {
  async createAnnouncement(announcementData) {
    try {
      console.log('Creating announcement with data:', announcementData);

      const response = await API.post('/anuncios', announcementData);
      console.log('Create announcement API response:', response.data);

      return { 
        success: true, 
        data: response.data.data,
        message: response.data.message 
      };
    } catch (error) {
      console.error('AnnouncementService createAnnouncement error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Error de conexión' 
      };
    }
  }

  async getAnnouncementsByType(type = 'venta') {
    try {
      console.log('Fetching announcements of type:', type);

      const response = await API.get(`/anuncios/tipo/${type}`);
      console.log('Get announcements API response:', response.data);

      return { 
        success: true, 
        data: response.data.data || [],
        message: response.data.message 
      };
    } catch (error) {
      console.error('AnnouncementService getAnnouncementsByType error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Error de conexión',
        data: []
      };
    }
  }

  async getUserAnnouncements() {
    try {
      const user = JSON.parse(localStorage.getItem('user'));

      if (!user || !user.id) {
        throw new Error('Usuario no autenticado');
      }

      const response = await API.get(`/anuncios/usuario/${user.id}`);

      return { 
        success: true, 
        data: response.data.data || []
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Error de conexión',
        data: []
      };
    }
  }
}

export default new AnnouncementService();