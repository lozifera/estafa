    import React, { useState } from 'react';
    import { useAuth } from '../../context/Authcontext';
    import AdminOverview from './AdminOverview';
    import CurrencyManagement from './CurrencyManagement';
    import UserManagement from './UserManagement';

    const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <div style={{ padding: '2rem', minHeight: '100vh', background: '#f5f5f5' }}>
        {/* Header Simple */}
        <div style={{ 
            background: 'white', 
            padding: '1rem 2rem', 
            borderRadius: '8px', 
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <div>
            <h1 style={{ margin: 0, color: '#333' }}>Panel de Administrador</h1>
            <p style={{ margin: 0, color: '#666' }}>Hola, {user?.nombre}</p>
            </div>
            <button 
            onClick={logout}
            style={{
                background: '#e74c3c',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer'
            }}
            >
            Cerrar Sesión
            </button>
        </div>

        {/* Navegación con Tabs */}
        <div style={{ background: 'white', borderRadius: '8px', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid #eee' }}>
            <button
                onClick={() => setActiveTab('overview')}
                style={{
                padding: '1rem 2rem',
                border: 'none',
                background: activeTab === 'overview' ? '#3498db' : 'transparent',
                color: activeTab === 'overview' ? 'white' : '#333',
                cursor: 'pointer',
                borderRadius: '8px 0 0 0'
                }}
            >
                📊 Resumen
            </button>
            <button
                onClick={() => setActiveTab('currencies')}
                style={{
                padding: '1rem 2rem',
                border: 'none',
                background: activeTab === 'currencies' ? '#3498db' : 'transparent',
                color: activeTab === 'currencies' ? 'white' : '#333',
                cursor: 'pointer'
                }}
            >
                🪙 Monedas
            </button>
            <button
                onClick={() => setActiveTab('users')}
                style={{
                padding: '1rem 2rem',
                border: 'none',
                background: activeTab === 'users' ? '#3498db' : 'transparent',
                color: activeTab === 'users' ? 'white' : '#333',
                cursor: 'pointer',
                borderRadius: '0 8px 0 0'
                }}
            >
                👥 Usuarios
            </button>
            </div>

            {/* Contenido */}
            <div style={{ padding: '2rem' }}>
            {activeTab === 'overview' && <AdminOverview />}
            {activeTab === 'currencies' && <CurrencyManagement />}
            {activeTab === 'users' && <UserManagement />}
            </div>
        </div>
        </div>
    );
    };

    export default AdminDashboard;