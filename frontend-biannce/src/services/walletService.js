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

    class WalletService {
    async getUserWallets() {
        try {
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (!user || !user.id) {
            throw new Error('Usuario no autenticado');
        }

        console.log('Fetching wallets for user:', user.id);

        const response = await API.get(`/billeteras/usuario/${user.id}`);
        console.log('Wallets API response:', response.data);

        return { 
            success: true, 
            data: response.data.data || [],
            message: response.data.message 
        };
        } catch (error) {
        console.error('WalletService getUserWallets error:', error);
        return { 
            success: false, 
            error: error.response?.data?.message || error.message || 'Error de conexión',
            data: []
        };
        }
    }

    async createWallet(monedaId, saldoInicial = 0) {
        try {
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (!user || !user.id) {
            throw new Error('Usuario no autenticado');
        }

        const walletData = {
            usuario_id: user.id,
            moneda_id: parseInt(monedaId),
            saldo_inicial: parseFloat(saldoInicial)
        };

        console.log('Creating wallet with data:', walletData);

        const response = await API.post('/billeteras', walletData);
        console.log('Create wallet API response:', response.data);

        return { 
            success: true, 
            data: response.data.data,
            message: response.data.message 
        };
        } catch (error) {
        console.error('WalletService createWallet error:', error);
        return { 
            success: false, 
            error: error.response?.data?.message || error.message || 'Error de conexión' 
        };
        }
    }
    }

    export default new WalletService();