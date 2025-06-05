    import React, { useState, useEffect } from 'react';
    import { useNavigate } from 'react-router-dom';
    import announcementService from '../../services/announcementService';

    const AnnouncementsList = () => {
    const navigate = useNavigate();
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('market'); // 'market' o 'mine'

    useEffect(() => {
        if (activeTab === 'market') {
        fetchMarketAnnouncements();
        } else {
        fetchMyAnnouncements();
        }
    }, [activeTab]);

    const fetchMarketAnnouncements = async () => {
        setLoading(true);
        try {
        const result = await announcementService.getAnnouncementsByType('venta');
        if (result.success) {
            setAnnouncements(result.data);
        } else {
            setError(result.error);
        }
        } catch (error) {
        console.error('Error fetching market announcements:', error);
        setError('Error al cargar anuncios del mercado');
        } finally {
        setLoading(false);
        }
    };

    const fetchMyAnnouncements = async () => {
        setLoading(true);
        try {
        const result = await announcementService.getUserAnnouncements();
        if (result.success) {
            setAnnouncements(result.data);
        } else {
            setError(result.error);
        }
        } catch (error) {
        console.error('Error fetching my announcements:', error);
        setError('Error al cargar mis anuncios');
        } finally {
        setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return parseFloat(price).toLocaleString('es-ES', {
        style: 'currency',
        currency: 'USD'
        });
    };

    const formatCrypto = (amount, symbol) => {
        return `${parseFloat(amount).toLocaleString()} ${symbol}`;
    };

    if (loading) {
        return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '3rem',
            color: '#6b7280' 
        }}>
            <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f4f6',
            borderLeft: '4px solid #f59e0b',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '1rem'
            }}></div>
            <p>Cargando anuncios...</p>
        </div>
        );
    }

    return (
        <div style={{ padding: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem'
        }}>
            <div>
            <h2 style={{ margin: '0 0 0.25rem 0', color: '#1f2937', fontSize: '1.8rem' }}>
                Anuncios de Venta
            </h2>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>
                {announcements.length} {announcements.length === 1 ? 'anuncio disponible' : 'anuncios disponibles'}
            </p>
            </div>

            <button 
            onClick={() => navigate('/dashboard/create-announcement')}
            style={{
                background: '#f59e0b',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
            }}
            >
            <span style={{ fontSize: '1.2rem' }}>+</span>
            Crear Anuncio
            </button>
        </div>

        {/* Tabs para alternar entre mercado y mis anuncios */}
        <div style={{ 
            display: 'flex', 
            marginBottom: '2rem',
            borderBottom: '2px solid #e5e7eb'
        }}>
            <button
            onClick={() => setActiveTab('market')}
            style={{
                background: 'none',
                border: 'none',
                padding: '1rem 1.5rem',
                cursor: 'pointer',
                fontWeight: '600',
                borderBottom: activeTab === 'market' ? '2px solid #f59e0b' : '2px solid transparent',
                color: activeTab === 'market' ? '#f59e0b' : '#6b7280'
            }}
            >
            🛒 Mercado P2P
            </button>
            <button
            onClick={() => setActiveTab('mine')}
            style={{
                background: 'none',
                border: 'none',
                padding: '1rem 1.5rem',
                cursor: 'pointer',
                fontWeight: '600',
                borderBottom: activeTab === 'mine' ? '2px solid #f59e0b' : '2px solid transparent',
                color: activeTab === 'mine' ? '#f59e0b' : '#6b7280'
            }}
            >
            📋 Mis Anuncios
            </button>
        </div>

        {error && (
            <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '1rem',
            borderRadius: '8px',
            margin: '1rem 0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
            }}>
            <span>⚠️</span> {error}
            </div>
        )}

        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '1.5rem'
        }}>
            {announcements.length > 0 ? (
            announcements.map((announcement) => (
                <div key={announcement.id} style={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s'
                }}>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '1rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '6px',
                        fontWeight: 'bold',
                        fontSize: '0.9rem'
                    }}>
                        {announcement.moneda?.simbolo || 'N/A'}
                    </span>
                    <span style={{ fontWeight: '600', color: '#1f2937' }}>
                        {announcement.moneda?.nombre || 'Moneda desconocida'}
                    </span>
                    </div>
                    <span style={{
                    background: announcement.tipo === 'venta' ? '#dcfce7' : '#dbeafe',
                    color: announcement.tipo === 'venta' ? '#15803d' : '#1d4ed8',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: '500'
                    }}>
                    {announcement.tipo === 'venta' ? '💰 Venta' : '🛒 Compra'}
                    </span>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <div style={{ marginBottom: '0.5rem' }}>
                    <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Precio por unidad:</span>
                    <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#1f2937' }}>
                        {formatPrice(announcement.precio_unitario)}
                    </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
                    <div>
                        <span style={{ color: '#6b7280' }}>Disponible:</span>
                        <div style={{ fontWeight: '600', color: '#1f2937' }}>
                        {formatCrypto(announcement.cantidad_disponible, announcement.moneda?.simbolo)}
                        </div>
                    </div>
                    <div>
                        <span style={{ color: '#6b7280' }}>Límites:</span>
                        <div style={{ fontWeight: '600', color: '#1f2937' }}>
                        {parseFloat(announcement.cantidad_minima).toFixed(4)} - {parseFloat(announcement.cantidad_maxima).toFixed(4)}
                        </div>
                    </div>
                    </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <div style={{ color: '#6b7280', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                    Método de pago:
                    </div>
                    <div style={{ 
                    fontSize: '0.9rem', 
                    color: '#374151',
                    padding: '0.5rem',
                    background: '#f9fafb',
                    borderRadius: '6px',
                    maxHeight: '60px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                    }}>
                    {announcement.descripcion_pago || 'No especificado'}
                    </div>
                </div>

                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '1rem',
                    borderTop: '1px solid #e5e7eb'
                }}>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                    {activeTab === 'market' ? (
                        <span>👤 {announcement.usuario?.nombre || 'Usuario'}</span>
                    ) : (
                        <span>📅 {new Date(announcement.created_at).toLocaleDateString()}</span>
                    )}
                    </div>
                    
                    {activeTab === 'market' ? (
                    <button style={{
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '500'
                    }}>
                        💬 Contactar
                    </button>
                    ) : (
                    <button style={{
                        background: '#6b7280',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '500'
                    }}>
                        ⚙️ Gestionar
                    </button>
                    )}
                </div>
                </div>
            ))
            ) : (
            <div style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '3rem',
                background: '#f9fafb',
                border: '2px dashed #d1d5db',
                borderRadius: '12px'
            }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                {activeTab === 'market' ? '🛒' : '📋'}
                </div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#374151' }}>
                {activeTab === 'market' ? 'No hay anuncios en el mercado' : 'No tienes anuncios'}
                </h3>
                <p style={{ margin: '0 0 1.5rem 0', color: '#6b7280' }}>
                {activeTab === 'market' 
                    ? 'No se encontraron anuncios de venta disponibles'
                    : 'Crea tu primer anuncio para comenzar a vender'
                }
                </p>
                {activeTab === 'mine' && (
                <button 
                    onClick={() => navigate('/dashboard/create-announcement')}
                    style={{
                    background: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    padding: '1rem 2rem',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                    }}
                >
                    <span style={{ fontSize: '1.2rem' }}>+</span>
                    Crear Mi Primer Anuncio
                </button>
                )}
            </div>
            )}
        </div>
        </div>
    );
    };

    export default AnnouncementsList;