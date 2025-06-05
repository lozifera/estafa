import axios from 'axios';

// Configurar instancia base de axios
const API = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

class CurrencyService {
  async getAvailableCurrencies() {
    try {
      console.log('Fetching currencies from:', '/monedas');
      
      const response = await API.get('/monedas');
      console.log('Currency API Response:', response.data);

      if (!response.data.success) {
        throw new Error(response.data.message || 'API returned success: false');
      }

      return { 
        success: true, 
        data: response.data.data || [],
        message: response.data.message 
      };
    } catch (error) {
      console.error('CurrencyService Error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Error de conexión al obtener monedas',
        data: []
      };
    }
  }

  // Método para obtener una moneda específica por ID
  async getCurrencyById(id) {
    try {
      const result = await this.getAvailableCurrencies();
      if (result.success) {
        const currency = result.data.find(curr => curr.id === parseInt(id));
        return currency ? { success: true, data: currency } : { success: false, error: 'Moneda no encontrada' };
      }
      return result;
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Error al obtener moneda' 
      };
    }
  }

  // Método para obtener solo monedas activas
  async getActiveCurrencies() {
    try {
      const result = await this.getAvailableCurrencies();
      if (result.success) {
        const activeCurrencies = result.data.filter(currency => currency.activo === true);
        return { success: true, data: activeCurrencies };
      }
      return result;
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Error al obtener monedas activas' 
      };
    }
  }
}

export default new CurrencyService();