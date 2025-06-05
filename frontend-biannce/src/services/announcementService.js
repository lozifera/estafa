    const API_BASE_URL = 'http://localhost:3001/api';

    class AnnouncementService {
    async createAnnouncement(announcementData) {
        try {
        const token = localStorage.getItem('token');
        
        console.log('Creating announcement with data:', announcementData);

        const response = await fetch(`${API_BASE_URL}/anuncios`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(announcementData),
        });

        const data = await response.json();
        console.log('Create announcement API response:', data);

        if (!response.ok) {
            throw new Error(data.message || 'Error al crear anuncio');
        }

        return { 
            success: true, 
            data: data.data,
            message: data.message 
        };
        } catch (error) {
        console.error('AnnouncementService createAnnouncement error:', error);
        return { 
            success: false, 
            error: error.message || 'Error de conexión' 
        };
        }
    }

    // ✅ Nuevo método para obtener anuncios de venta
    async getAnnouncementsByType(type = 'venta') {
        try {
        console.log('Fetching announcements of type:', type);

        const response = await fetch(`${API_BASE_URL}/anuncios/tipo/${type}`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        console.log('Get announcements API response:', data);

        if (!response.ok) {
            throw new Error(data.message || 'Error al obtener anuncios');
        }

        return { 
            success: true, 
            data: data.data || [],
            message: data.message 
        };
        } catch (error) {
        console.error('AnnouncementService getAnnouncementsByType error:', error);
        return { 
            success: false, 
            error: error.message || 'Error de conexión',
            data: []
        };
        }
    }

    // ✅ Método para obtener anuncios del usuario actual
    async getUserAnnouncements() {
        try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user || !user.id) {
            throw new Error('Usuario no autenticado');
        }

        const response = await fetch(`${API_BASE_URL}/anuncios/usuario/${user.id}`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al obtener anuncios');
        }

        return { 
            success: true, 
            data: data.data || []
        };
        } catch (error) {
        return { 
            success: false, 
            error: error.message || 'Error de conexión',
            data: []
        };
        }
    }
    }

    export default new AnnouncementService();