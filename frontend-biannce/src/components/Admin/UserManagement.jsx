    import React, { useState, useEffect } from 'react';
    import adminService from '../../services/adminService';

    const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [processingUser, setProcessingUser] = useState(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        const result = await adminService.getAllUsers();
        if (result.success) {
        setUsers(result.data);
        } else {
        setError(result.error);
        }
        setLoading(false);
    };

    // ✅ Función para dar permisos de admin (true)
    const makeAdmin = async (userId, userName) => {
        if (!window.confirm(`¿Dar permisos de administrador a ${userName}?`)) {
        return;
        }

        setError('');
        setSuccess('');
        setProcessingUser(userId);

        try {
        const result = await adminService.toggleAdminPermissions(userId, true);
        
        if (result.success) {
            setSuccess(`${userName} ahora es administrador`);
            loadUsers(); // Recargar lista
        } else {
            setError(result.error);
        }
        } catch (error) {
        setError('Error inesperado');
        } finally {
        setProcessingUser(null);
        }
    };

    // ✅ Función para quitar permisos de admin (false)
    const removeAdmin = async (userId, userName) => {
        if (!window.confirm(`¿Quitar permisos de administrador a ${userName}?`)) {
        return;
        }

        setError('');
        setSuccess('');
        setProcessingUser(userId);

        try {
        const result = await adminService.toggleAdminPermissions(userId, false);
        
        if (result.success) {
            setSuccess(`${userName} ya no es administrador`);
            loadUsers(); // Recargar lista
        } else {
            setError(result.error);
        }
        } catch (error) {
        setError('Error inesperado');
        } finally {
        setProcessingUser(null);
        }
    };

    if (loading) return <div>Cargando usuarios...</div>;

    return (
        <div>
        <h2>Gestión de Usuarios ({users.length} usuarios)</h2>
        
        {error && (
            <div style={{
            background: '#ffebee',
            color: '#c62828',
            padding: '1rem',
            borderRadius: '4px',
            marginBottom: '1rem'
            }}>
            ❌ {error}
            </div>
        )}

        {success && (
            <div style={{
            background: '#e8f5e8',
            color: '#2e7d32',
            padding: '1rem',
            borderRadius: '4px',
            marginBottom: '1rem'
            }}>
            ✅ {success}
            </div>
        )}
        
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
            <thead>
            <tr style={{ background: '#f8f9fa' }}>
                <th style={{ padding: '1rem', textAlign: 'left', border: '1px solid #dee2e6' }}>ID</th>
                <th style={{ padding: '1rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Nombre</th>
                <th style={{ padding: '1rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Email</th>
                <th style={{ padding: '1rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Tipo</th>
                <th style={{ padding: '1rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Estado</th>
                <th style={{ padding: '1rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Acciones</th>
            </tr>
            </thead>
            <tbody>
            {users.map((user) => (
                <tr key={user.id}>
                <td style={{ padding: '1rem', border: '1px solid #dee2e6' }}>{user.id}</td>
                <td style={{ padding: '1rem', border: '1px solid #dee2e6' }}>{user.nombre}</td>
                <td style={{ padding: '1rem', border: '1px solid #dee2e6' }}>{user.email}</td>
                <td style={{ padding: '1rem', border: '1px solid #dee2e6' }}>
                    <span style={{ 
                    background: user.es_admin ? '#fff3cd' : '#d1ecf1', 
                    color: user.es_admin ? '#856404' : '#0c5460',
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px',
                    fontWeight: '500'
                    }}>
                    {user.es_admin ? '🛡️ Admin' : '👤 Usuario'}
                    </span>
                </td>
                <td style={{ padding: '1rem', border: '1px solid #dee2e6' }}>
                    <span style={{ 
                    background: user.activo ? '#d4edda' : '#f8d7da', 
                    color: user.activo ? '#155724' : '#721c24',
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px' 
                    }}>
                    {user.activo ? 'Activo' : 'Inactivo'}
                    </span>
                </td>
                <td style={{ padding: '1rem', border: '1px solid #dee2e6' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {/* ✅ Botón para HACER admin */}
                    {!user.es_admin && (
                        <button 
                        onClick={() => makeAdmin(user.id, user.nombre)}
                        disabled={processingUser === user.id}
                        style={{ 
                            background: '#28a745', 
                            color: 'white', 
                            border: 'none', 
                            padding: '0.5rem 1rem', 
                            borderRadius: '4px',
                            cursor: processingUser === user.id ? 'not-allowed' : 'pointer',
                            opacity: processingUser === user.id ? 0.6 : 1,
                            fontSize: '0.8rem'
                        }}
                        >
                        {processingUser === user.id ? 'Procesando...' : '✅ Hacer Admin'}
                        </button>
                    )}
                    
                    {/* ✅ Botón para QUITAR admin */}
                    {user.es_admin && (
                        <button 
                        onClick={() => removeAdmin(user.id, user.nombre)}
                        disabled={processingUser === user.id}
                        style={{ 
                            background: '#dc3545', 
                            color: 'white', 
                            border: 'none', 
                            padding: '0.5rem 1rem', 
                            borderRadius: '4px',
                            cursor: processingUser === user.id ? 'not-allowed' : 'pointer',
                            opacity: processingUser === user.id ? 0.6 : 1,
                            fontSize: '0.8rem'
                        }}
                        >
                        {processingUser === user.id ? 'Procesando...' : '❌ Quitar Admin'}
                        </button>
                    )}
                    </div>
                </td>
                </tr>
            ))}
            </tbody>
        </table>

        {users.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
            No hay usuarios registrados
            </div>
        )}

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <button 
            onClick={loadUsers}
            disabled={loading}
            style={{
                background: '#007bff',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
            }}
            >
            {loading ? 'Cargando...' : '🔄 Recargar Usuarios'}
            </button>
        </div>
        </div>
    );
    };

    export default UserManagement;