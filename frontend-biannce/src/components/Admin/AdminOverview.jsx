    import React, { useState, useEffect } from 'react';
    import adminService from '../../services/adminService';
    import announcementService from '../../services/announcementService';
    import currencyService from '../../services/currencyService';

    const AdminOverview = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeCurrencies: 0,
        totalAnnouncements: 0,
        totalTransactions: 156 // Este dato no tienes API, manténlo fijo por ahora
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadSystemStats();
    }, []);

    const loadSystemStats = async () => {
        try {
        setLoading(true);
        
        // Obtener usuarios
        const usersResult = await adminService.getAllUsers();
        
        // Obtener monedas activas
        const currenciesResult = await currencyService.getActiveCurrencies();
        
        // Obtener anuncios
        const announcementsResult = await announcementService.getAnnouncementsByType('venta');
        
        setStats({
            totalUsers: usersResult.success ? usersResult.data.length : 0,
            activeCurrencies: currenciesResult.success ? currenciesResult.data.length : 0,
            totalAnnouncements: announcementsResult.success ? announcementsResult.data.length : 0,
            totalTransactions: 156 // Mantener fijo hasta que tengas la API
        });

        // Si alguna API falla, mostrar error pero continuar
        if (!usersResult.success || !currenciesResult.success || !announcementsResult.success) {
            setError('Algunos datos no pudieron cargarse completamente');
        }
        
        } catch (error) {
        console.error('Error loading system stats:', error);
        setError('Error al cargar estadísticas del sistema');
        } finally {
        setLoading(false);
        }
    };

    if (loading) {
        return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f4f6',
            borderLeft: '4px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
            }}></div>
            <p>Cargando estadísticas...</p>
        </div>
        );
    }

    return (
        <div>
        <h2>Resumen del Sistema</h2>
        
        {error && (
            <div style={{
            background: '#fff3cd',
            border: '1px solid #ffeaa7',
            color: '#856404',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '2rem'
            }}>
            ⚠️ {error}
            </div>
        )}
        
        {/* Cards con datos reales */}
        <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem',
            marginBottom: '2rem'
        }}>
            <div style={{ background: '#e3f2fd', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '2rem', margin: '0', color: '#1976d2' }}>
                {stats.totalUsers}
            </h3>
            <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>Usuarios Totales</p>
            </div>
            
            <div style={{ background: '#f3e5f5', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '2rem', margin: '0', color: '#7b1fa2' }}>
                {stats.activeCurrencies}
            </h3>
            <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>Monedas Activas</p>
            </div>
            
            <div style={{ background: '#e8f5e8', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '2rem', margin: '0', color: '#388e3c' }}>
                {stats.totalAnnouncements}
            </h3>
            <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>Anuncios</p>
            </div>
            
            <div style={{ background: '#fff3e0', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '2rem', margin: '0', color: '#f57c00' }}>
                {stats.totalTransactions}
            </h3>
            <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>Transacciones*</p>
            </div>
        </div>

        {/* Información adicional */}
        <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px' }}>
            <h3>Panel de Administración</h3>
            <p>Desde aquí puedes:</p>
            <ul>
            <li>✅ Gestionar monedas del sistema ({stats.activeCurrencies} activas)</li>
            <li>✅ Administrar usuarios y permisos ({stats.totalUsers} usuarios)</li>
            <li>✅ Monitorear anuncios del mercado ({stats.totalAnnouncements} anuncios)</li>
            </ul>
            <small style={{ color: '#666', marginTop: '1rem', display: 'block' }}>
            * Las transacciones son un valor simulado hasta implementar la API correspondiente
            </small>
        </div>

        {/* Botón para actualizar datos */}
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <button 
            onClick={loadSystemStats}
            disabled={loading}
            style={{
                background: '#3498db',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
            }}
            >
            {loading ? 'Actualizando...' : '🔄 Actualizar Datos'}
            </button>
        </div>
        </div>
    );
    };

    export default AdminOverview;