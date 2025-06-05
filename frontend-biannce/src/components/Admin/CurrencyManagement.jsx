    import React, { useState, useEffect } from 'react';
    import adminService from '../../services/adminService';

    const CurrencyManagement = () => {
    const [currencies, setCurrencies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ nombre: '', simbolo: '', valor_en_sus: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        loadCurrencies();
    }, []);

    const loadCurrencies = async () => {
        const result = await adminService.getAllCurrencies();
        if (result.success) {
        setCurrencies(result.data);
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await adminService.createCurrency(formData);
        
        if (result.success) {
        setSuccess('Moneda creada exitosamente');
        setFormData({ nombre: '', simbolo: '', valor_en_sus: '' });
        setShowForm(false);
        loadCurrencies();
        } else {
        setError(result.error);
        }
    };

    const deleteCurrency = async (id) => {
        if (window.confirm('¿Eliminar esta moneda?')) {
        const result = await adminService.deleteCurrency(id);
        if (result.success) {
            loadCurrencies();
        }
        }
    };

    if (loading) return <div>Cargando...</div>;

    return (
        <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2>Gestión de Monedas</h2>
            <button 
            onClick={() => setShowForm(!showForm)}
            style={{ background: '#27ae60', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px' }}
            >
            {showForm ? 'Cancelar' : 'Agregar Moneda'}
            </button>
        </div>

        {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>{error}</div>}
        {success && <div style={{ background: '#e8f5e8', color: '#2e7d32', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>{success}</div>}

        {showForm && (
            <form onSubmit={handleSubmit} style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', marginBottom: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <input
                type="text"
                placeholder="Nombre (ej: Bitcoin)"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
                required
                />
                <input
                type="text"
                placeholder="Símbolo (ej: BTC)"
                value={formData.simbolo}
                onChange={(e) => setFormData({...formData, simbolo: e.target.value})}
                style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
                required
                />
                <input
                type="number"
                placeholder="Valor USD"
                value={formData.valor_en_sus}
                onChange={(e) => setFormData({...formData, valor_en_sus: e.target.value})}
                style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
                required
                />
            </div>
            <button type="submit" style={{ background: '#3498db', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', marginTop: '1rem' }}>
                Crear Moneda
            </button>
            </form>
        )}

        {/* Tabla simple */}
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
            <thead>
            <tr style={{ background: '#f8f9fa' }}>
                <th style={{ padding: '1rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Nombre</th>
                <th style={{ padding: '1rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Símbolo</th>
                <th style={{ padding: '1rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Valor USD</th>
                <th style={{ padding: '1rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Acciones</th>
            </tr>
            </thead>
            <tbody>
            {currencies.map((currency) => (
                <tr key={currency.id}>
                <td style={{ padding: '1rem', border: '1px solid #dee2e6' }}>{currency.nombre}</td>
                <td style={{ padding: '1rem', border: '1px solid #dee2e6' }}>{currency.simbolo}</td>
                <td style={{ padding: '1rem', border: '1px solid #dee2e6' }}>${currency.valor_en_sus}</td>
                <td style={{ padding: '1rem', border: '1px solid #dee2e6' }}>
                    <button 
                    onClick={() => deleteCurrency(currency.id)}
                    style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '0.25rem 0.5rem', borderRadius: '4px' }}
                    >
                    Eliminar
                    </button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
    };

    export default CurrencyManagement;