    import React, { useState, useEffect } from 'react';
    import { useNavigate, useSearchParams } from 'react-router-dom';
    import walletService from '../../services/walletService';
    import announcementService from '../../services/announcementService';

    const CreateAnnouncement = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const walletId = searchParams.get('wallet');

    const [wallets, setWallets] = useState([]);
    const [selectedWallet, setSelectedWallet] = useState(walletId || '');
    const [formData, setFormData] = useState({
        precio_unitario: '',
        cantidad_disponible: '',
        cantidad_minima: '',
        cantidad_maxima: '',
        descripcion_pago: ''
    });
    const [loading, setLoading] = useState(false);
    const [loadingWallets, setLoadingWallets] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchUserWallets();
    }, []);

    // Auto-calcular cantidad_maxima cuando cambia cantidad_disponible
    useEffect(() => {
        if (formData.cantidad_disponible) {
        setFormData(prev => ({
            ...prev,
            cantidad_maxima: prev.cantidad_disponible
        }));
        }
    }, [formData.cantidad_disponible]);

    const fetchUserWallets = async () => {
        try {
        const result = await walletService.getUserWallets();
        if (result.success) {
            // Solo billeteras con saldo > 0
            const walletsWithBalance = result.data.filter(wallet => parseFloat(wallet.saldo) > 0);
            setWallets(walletsWithBalance);
        } else {
            setError('Error al cargar billeteras');
        }
        } catch (error) {
        setError('Error de conexión');
        } finally {
        setLoadingWallets(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedWallet) {
        setError('Selecciona una billetera');
        return;
        }

        const selectedWalletData = wallets.find(w => w.id === parseInt(selectedWallet));
        if (!selectedWalletData) {
        setError('Billetera no encontrada');
        return;
        }

        const cantidadDisponible = parseFloat(formData.cantidad_disponible);
        const cantidadMinima = parseFloat(formData.cantidad_minima);
        const cantidadMaxima = parseFloat(formData.cantidad_maxima);
        const saldoWallet = parseFloat(selectedWalletData.saldo);

        // Validaciones
        if (cantidadDisponible <= 0 || cantidadMinima <= 0 || cantidadMaxima <= 0) {
        setError('Todas las cantidades deben ser mayores a 0');
        return;
        }

        if (cantidadDisponible > saldoWallet) {
        setError(`No tienes suficiente saldo. Disponible: ${saldoWallet} ${selectedWalletData.moneda?.simbolo}`);
        return;
        }

        if (cantidadMinima > cantidadMaxima) {
        setError('La cantidad mínima no puede ser mayor a la máxima');
        return;
        }

        if (cantidadMaxima > cantidadDisponible) {
        setError('La cantidad máxima no puede ser mayor a la disponible');
        return;
        }

        if (parseFloat(formData.precio_unitario) <= 0) {
        setError('El precio unitario debe ser mayor a 0');
        return;
        }

        setLoading(true);
        setError('');

        try {
        const user = JSON.parse(localStorage.getItem('user'));
        
        const announcementData = {
            usuario_id: user.id,
            moneda_id: selectedWalletData.moneda.id,
            tipo: "venta",
            precio_unitario: parseFloat(formData.precio_unitario),
            cantidad_disponible: cantidadDisponible,
            cantidad_minima: cantidadMinima,
            cantidad_maxima: cantidadMaxima,
            descripcion_pago: formData.descripcion_pago
        };

        console.log('Enviando datos del anuncio:', announcementData);

        const result = await announcementService.createAnnouncement(announcementData);
        
        if (result.success) {
            setSuccess('¡Anuncio de venta creado exitosamente!');
            setTimeout(() => {
            navigate('/dashboard/announcements');
            }, 2000);
        } else {
            setError(result.error || 'Error al crear anuncio');
        }
        } catch (error) {
        setError('Error de conexión');
        } finally {
        setLoading(false);
        }
    };

    const getSelectedWalletInfo = () => {
        if (!selectedWallet) return null;
        return wallets.find(wallet => wallet.id === parseInt(selectedWallet));
    };

    const selectedWalletData = getSelectedWalletInfo();
    const totalPotencial = formData.cantidad_disponible && formData.precio_unitario ? 
        (parseFloat(formData.cantidad_disponible) * parseFloat(formData.precio_unitario)).toFixed(2) : 0;

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
            <button 
            onClick={() => navigate('/dashboard/wallets')} 
            style={{
                background: 'none',
                border: 'none',
                color: '#6b7280',
                cursor: 'pointer',
                marginBottom: '1rem'
            }}
            disabled={loading}
            >
            ← Volver a Billeteras
            </button>
            <h2 style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>Crear Anuncio de Venta</h2>
            <p style={{ margin: 0, color: '#6b7280' }}>Pon en venta tus criptomonedas</p>
        </div>

        <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Seleccionar Billetera</h3>
            
            {loadingWallets ? (
                <div style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>
                Cargando billeteras...
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {wallets.map((wallet) => (
                    <label 
                    key={wallet.id} 
                    style={{
                        display: 'flex',
                        padding: '1rem',
                        border: selectedWallet == wallet.id ? '2px solid #f59e0b' : '2px solid #e5e7eb',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        backgroundColor: selectedWallet == wallet.id ? '#fef3c7' : 'white'
                    }}
                    >
                    <input
                        type="radio"
                        name="wallet"
                        value={wallet.id}
                        checked={selectedWallet == wallet.id}
                        onChange={(e) => setSelectedWallet(e.target.value)}
                        disabled={loading}
                        style={{ marginRight: '1rem' }}
                    />
                    <div>
                        <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                        <span style={{ 
                            background: '#f59e0b', 
                            color: 'white', 
                            padding: '0.25rem 0.5rem', 
                            borderRadius: '4px', 
                            marginRight: '0.5rem' 
                        }}>
                            {wallet.moneda?.simbolo}
                        </span>
                        {wallet.moneda?.nombre}
                        </div>
                        <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                        Disponible: <strong>{parseFloat(wallet.saldo).toLocaleString()} {wallet.moneda?.simbolo}</strong>
                        </div>
                    </div>
                    </label>
                ))}
                </div>
            )}
            </div>

            {selectedWalletData && (
            <>
                <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Configuración de Venta</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Precio por unidad (USD)
                    </label>
                    <input
                        type="number"
                        value={formData.precio_unitario}
                        onChange={(e) => setFormData({...formData, precio_unitario: e.target.value})}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        required
                        disabled={loading}
                        style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '8px'
                        }}
                    />
                    <small style={{ color: '#6b7280' }}>
                        Precio de mercado: ${parseFloat(selectedWalletData.moneda?.valor_en_sus).toLocaleString()}
                    </small>
                    </div>

                    <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Cantidad disponible
                    </label>
                    <input
                        type="number"
                        value={formData.cantidad_disponible}
                        onChange={(e) => setFormData({...formData, cantidad_disponible: e.target.value})}
                        placeholder="0.00"
                        min="0"
                        step="0.00000001"
                        max={selectedWalletData.saldo}
                        required
                        disabled={loading}
                        style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '8px'
                        }}
                    />
                    <small style={{ color: '#6b7280' }}>
                        Máximo: {parseFloat(selectedWalletData.saldo).toLocaleString()} {selectedWalletData.moneda?.simbolo}
                    </small>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Cantidad mínima por transacción
                    </label>
                    <input
                        type="number"
                        value={formData.cantidad_minima}
                        onChange={(e) => setFormData({...formData, cantidad_minima: e.target.value})}
                        placeholder="0.00"
                        min="0"
                        step="0.00000001"
                        max={formData.cantidad_disponible}
                        required
                        disabled={loading}
                        style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '8px'
                        }}
                    />
                    </div>

                    <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Cantidad máxima por transacción
                    </label>
                    <input
                        type="number"
                        value={formData.cantidad_maxima}
                        onChange={(e) => setFormData({...formData, cantidad_maxima: e.target.value})}
                        placeholder="0.00"
                        min="0"
                        step="0.00000001"
                        max={formData.cantidad_disponible}
                        required
                        disabled={loading}
                        style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '8px'
                        }}
                    />
                    </div>
                </div>

                {totalPotencial > 0 && (
                    <div style={{
                    background: '#ecfdf5',
                    border: '1px solid #bbf7d0',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginTop: '1rem'
                    }}>
                    <strong>Valor total potencial: ${parseFloat(totalPotencial).toLocaleString()} USD</strong>
                    </div>
                )}
                </div>

                <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Información de Pago</h3>
                
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Descripción del método de pago
                    </label>
                    <textarea
                    value={formData.descripcion_pago}
                    onChange={(e) => setFormData({...formData, descripcion_pago: e.target.value})}
                    placeholder="Ej: Transferencia bancaria, Banco Nacional, Cuenta: 123456789, A nombre de: Juan Pérez"
                    rows="3"
                    required
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '8px',
                        resize: 'vertical'
                    }}
                    />
                    <small style={{ color: '#6b7280' }}>
                    Proporciona información clara sobre cómo el comprador debe realizar el pago
                    </small>
                </div>
                </div>
            </>
            )}

            {error && (
            <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1rem'
            }}>
                <span>⚠️</span> {error}
            </div>
            )}

            {success && (
            <div style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                color: '#15803d',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1rem'
            }}>
                <span>✅</span> {success}
            </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button 
                type="button" 
                onClick={() => navigate('/dashboard/wallets')}
                disabled={loading}
                style={{
                background: '#f3f4f6',
                color: '#374151',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer'
                }}
            >
                Cancelar
            </button>
            <button 
                type="submit" 
                disabled={loading || !selectedWallet || loadingWallets}
                style={{
                background: loading ? '#9ca3af' : '#f59e0b',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer'
                }}
            >
                {loading ? 'Creando anuncio...' : 'Crear Anuncio de Venta'}
            </button>
            </div>
        </form>
        </div>
    );
    };

    export default CreateAnnouncement;