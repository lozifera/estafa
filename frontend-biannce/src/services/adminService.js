    const API_BASE_URL = 'http://localhost:3001/api';

    class AdminService {
    // ========== GESTIÓN DE MONEDAS ==========
    
    async getAllCurrencies() {
        try {
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${API_BASE_URL}/monedas`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
            },
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error al obtener monedas');
        }

        return { 
            success: true, 
            data: data.data || [],
            message: data.message 
        };
        } catch (error) {
        console.error('AdminService getAllCurrencies error:', error);
        return { 
            success: false, 
            error: error.message || 'Error de conexión',
            data: []
        };
        }
    }

    async createCurrency(currencyData) {
        try {
        const token = localStorage.getItem('token');
        
        console.log('Creating currency with data:', currencyData);

        const response = await fetch(`${API_BASE_URL}/monedas`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(currencyData),
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error al crear moneda');
        }

        return { 
            success: true, 
            data: data.data,
            message: data.message 
        };
        } catch (error) {
        console.error('AdminService createCurrency error:', error);
        return { 
            success: false, 
            error: error.message || 'Error de conexión' 
        };
        }
    }

    async updateCurrency(id, currencyData) {
        try {
        const token = localStorage.getItem('token');
        
        console.log('Updating currency:', id, currencyData);

        const response = await fetch(`${API_BASE_URL}/monedas/${id}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(currencyData),
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error al actualizar moneda');
        }

        return { 
            success: true, 
            data: data.data,
            message: data.message 
        };
        } catch (error) {
        console.error('AdminService updateCurrency error:', error);
        return { 
            success: false, 
            error: error.message || 'Error de conexión' 
        };
        }
    }

    async deleteCurrency(id) {
        try {
        const token = localStorage.getItem('token');
        
        console.log('Deleting currency:', id);

        const response = await fetch(`${API_BASE_URL}/monedas/${id}`, {
            method: 'DELETE',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
            },
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error al eliminar moneda');
        }

        return { 
            success: true, 
            message: data.message 
        };
        } catch (error) {
        console.error('AdminService deleteCurrency error:', error);
        return { 
            success: false, 
            error: error.message || 'Error de conexión' 
        };
        }
    }

    // ========== GESTIÓN DE USUARIOS ==========

    async getAllUsers() {
        try {
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${API_BASE_URL}/usuarios/todos`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
            },
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error al obtener usuarios');
        }

        return { 
            success: true, 
            data: data.data || [],
            message: data.message 
        };
        } catch (error) {
        console.error('AdminService getAllUsers error:', error);
        return { 
            success: false, 
            error: error.message || 'Error de conexión',
            data: []
        };
        }
    }

    async toggleAdminPermissions(userId, newAdminValue) {
    try {
        const token = localStorage.getItem('token');
        
        console.log(' Toggling admin permissions for user:', userId);
        console.log(' New admin value:', newAdminValue);

        const response = await fetch(`${API_BASE_URL}/usuarios/${userId}/admin`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        // ✅ Enviar el valor en el body como en Postman
        body: JSON.stringify({
            es_admin: newAdminValue
        })
        });

        console.log('📡 Response status:', response.status);

        const data = await response.json();
        console.log('📋 Response data:', data);
        
        if (!response.ok) {
        throw new Error(data.message || 'Error al cambiar permisos');
        }

        return { 
        success: true, 
        data: data.data,
        message: data.message 
        };
    } catch (error) {
        console.error(' AdminService toggleAdminPermissions error:', error);
        return { 
        success: false, 
        error: error.message || 'Error de conexión' 
        };
    }
    }
    }

    export default new AdminService();