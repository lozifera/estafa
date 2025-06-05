    const API_BASE_URL = 'http://localhost:3001/api';

    class AuthService {
    async register(userData) {
        try {
        const response = await fetch(`${API_BASE_URL}/usuarios/registro`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error en el registro');
        }

        return { success: true, data };
        } catch (error) {
        return { 
            success: false, 
            error: error.message || 'Error de conexión' 
        };
        }
    }

    async login(email, password) {
        try {
        const response = await fetch(`${API_BASE_URL}/usuarios/login`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error en el login');
        }

        // Adaptar la respuesta de la API al formato esperado por el contexto
        return { 
            success: true, 
            data: {
            token: data.data.token,
            user: data.data.usuario
            }
        };
        } catch (error) {
        return { 
            success: false, 
            error: error.message || 'Error de conexión' 
        };
        }
    }
    }

export default new AuthService();