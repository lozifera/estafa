    const API_BASE_URL = 'http://localhost:3001/api';

    class WalletService {
    async getUserWallets() {
        try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (!user || !user.id) {
            throw new Error('Usuario no autenticado');
        }

        console.log('Fetching wallets for user:', user.id);

        const response = await fetch(`${API_BASE_URL}/billeteras/usuario/${user.id}`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
            },
        });

        const data = await response.json();
        console.log('Wallets API response:', data);

        if (!response.ok) {
            throw new Error(data.message || 'Error al obtener billeteras');
        }

        return { 
            success: true, 
            data: data.data || [],
            message: data.message 
        };
        } catch (error) {
        console.error('WalletService getUserWallets error:', error);
        return { 
            success: false, 
            error: error.message || 'Error de conexión',
            data: []
        };
        }
    }

    async createWallet(monedaId, saldoInicial = 0) {
        try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (!user || !user.id) {
            throw new Error('Usuario no autenticado');
        }

        console.log('Creating wallet with data:', {
            usuario_id: user.id,
            moneda_id: parseInt(monedaId),
            saldo_inicial: parseFloat(saldoInicial)
        });

        const response = await fetch(`${API_BASE_URL}/billeteras`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
            usuario_id: user.id,
            moneda_id: parseInt(monedaId),
            saldo_inicial: parseFloat(saldoInicial)
            }),
        });

        const data = await response.json();
        console.log('Create wallet API response:', data);

        if (!response.ok) {
            throw new Error(data.message || 'Error al crear billetera');
        }

        return { 
            success: true, 
            data: data.data,
            message: data.message 
        };
        } catch (error) {
        console.error('WalletService createWallet error:', error);
        return { 
            success: false, 
            error: error.message || 'Error de conexión' 
        };
        }
    }
    }

    export default new WalletService();