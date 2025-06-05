    import React, { createContext, useContext, useState, useEffect } from 'react';

    const AuthContext = createContext();

    export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de AuthProvider');
    }
    return context;
    };

    export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = () => {
        try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
            const parsedUser = JSON.parse(userData);
            console.log('Usuario recuperado del localStorage:', parsedUser);
            setUser(parsedUser);
        }
        } catch (error) {
        console.error('Error al verificar autenticación:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        } finally {
        setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
        console.log('Intentando login con:', { email, password });
        
        // ✅ URL corregida
        const response = await fetch('http://localhost:3001/api/usuarios/login', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        console.log('Response status:', response.status);

        // ✅ Verificar si la respuesta es HTML (error del servidor)
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const textResponse = await response.text();
            console.error('Servidor devolvió HTML en lugar de JSON:', textResponse.substring(0, 200));
            
            if (response.status === 404) {
            return { success: false, error: 'Endpoint /api/usuarios/login no encontrado en el servidor' };
            }
            
            return { success: false, error: 'Error del servidor. Verifica que el backend esté ejecutándose correctamente' };
        }

        const data = await response.json();
        console.log('Respuesta del servidor:', data);

        if (response.ok && data.success) {
            // ✅ Guardar token y datos del usuario (incluyendo es_admin)
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('user', JSON.stringify(data.data.usuario));
            
            console.log('Usuario logueado:', data.data.usuario);
            console.log('Es admin?', data.data.usuario.es_admin);
            
            setUser(data.data.usuario);
            return { success: true, user: data.data.usuario };
        } else {
            return { success: false, error: data.message || 'Error en el login' };
        }
        } catch (error) {
        console.error('Error en login:', error);
        
        // ✅ Mejorar mensajes de error específicos
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            return { success: false, error: 'No se puede conectar al servidor. Verifica que esté ejecutándose en puerto 3001' };
        }
        
        if (error instanceof SyntaxError) {
            return { success: false, error: 'El servidor devolvió una respuesta inválida. Verifica que el backend esté funcionando correctamente' };
        }
        
        return { success: false, error: 'Error de conexión: ' + error.message };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
        {children}
        </AuthContext.Provider>
    );
    };