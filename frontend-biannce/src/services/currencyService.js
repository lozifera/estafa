const API_BASE_URL = 'http://localhost:3001/api';

class CurrencyService {
  async getAvailableCurrencies() {
    try {
      console.log('Fetching currencies from:', `${API_BASE_URL}/monedas`);
      
      const response = await fetch(`${API_BASE_URL}/monedas`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('Currency API Response:', data);

      if (!response.ok) {
        throw new Error(data.message || `HTTP Error: ${response.status}`);
      }

      if (!data.success) {
        throw new Error(data.message || 'API returned success: false');
      }

      return { 
        success: true, 
        data: data.data || [],
        message: data.message 
      };
    } catch (error) {
      console.error('CurrencyService Error:', error);
      return { 
        success: false, 
        error: error.message || 'Error de conexión al obtener monedas',
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