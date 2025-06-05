    import React, { useState, useEffect } from 'react';
    import { useNavigate } from 'react-router-dom';
    import walletService from '../../services/walletService';
    import currencyService from '../../services/currencyService';
    import '../../styles/CreateWallet.css';

    const CreateWallet = () => {
    const navigate = useNavigate();
    const [currencies, setCurrencies] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState('');
    const [saldoInicial, setSaldoInicial] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingCurrencies, setLoadingCurrencies] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchCurrencies();
    }, []);

    const fetchCurrencies = async () => {
        setLoadingCurrencies(true);
        try {
        const result = await currencyService.getAvailableCurrencies();
        if (result.success) {
            const activeCurrencies = result.data.filter(currency => currency.activo);
            setCurrencies(activeCurrencies);
        } else {
            setError('Error al cargar las monedas disponibles');
        }
        } catch (error) {
        console.error('Error fetching currencies:', error);
        setError('Error de conexión al cargar monedas');
        } finally {
        setLoadingCurrencies(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedCurrency) {
        setError('Por favor selecciona una moneda');
        return;
        }

        // Validar saldo inicial
        const saldo = parseFloat(saldoInicial) || 0;
        if (saldo < 0) {
        setError('El saldo inicial no puede ser negativo');
        return;
        }

        setLoading(true);
        setError('');

        try {
        const result = await walletService.createWallet(selectedCurrency, saldo);
        if (result.success) {
            setSuccess('¡Billetera creada exitosamente!');
            setTimeout(() => {
            navigate('/dashboard/wallets');
            }, 2000);
        } else {
            setError(result.error || 'Error al crear la billetera');
        }
        } catch (error) {
        console.error('Error creating wallet:', error);
        setError('Error de conexión al crear billetera');
        } finally {
        setLoading(false);
        }
    };

    const getSelectedCurrencyInfo = () => {
        if (!selectedCurrency) return null;
        return currencies.find(currency => currency.id === parseInt(selectedCurrency));
    };

    const selectedCurrencyData = getSelectedCurrencyInfo();

    return (
        <div className="create-wallet-container">
        <div className="create-wallet-header">
            <button 
            onClick={() => navigate('/dashboard/wallets')} 
            className="back-button"
            disabled={loading}
            >
            ← Volver a Billeteras
            </button>
            <h2>Crear Nueva Billetera</h2>
            <p className="subtitle">Selecciona una moneda para crear tu billetera</p>
        </div>

        <div className="create-wallet-form">
            <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="currency" className="form-label">
                Seleccionar Moneda:
                </label>
                
                {loadingCurrencies ? (
                <div className="loading-select">
                    <span>Cargando monedas disponibles...</span>
                </div>
                ) : (
                <select
                    id="currency"
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    disabled={loading}
                    required
                    className="currency-select"
                >
                    <option value="">-- Selecciona una moneda --</option>
                    {currencies.map((currency) => (
                    <option key={currency.id} value={currency.id}>
                        {currency.nombre}
                    </option>
                    ))}
                </select>
                )}
            </div>

            {/* Campo para saldo inicial */}
            <div className="form-group">
                <label htmlFor="saldoInicial" className="form-label">
                Saldo Inicial (opcional):
                </label>
                <input
                type="number"
                id="saldoInicial"
                value={saldoInicial}
                onChange={(e) => setSaldoInicial(e.target.value)}
                disabled={loading}
                min="0"
                step="0.01"
                className="saldo-input"
                placeholder="0.00"
                />
                <small className="form-help">
                Deja en blanco o ingresa 0 para crear billetera sin saldo inicial
                </small>
            </div>

            {/* Mostrar información de la moneda seleccionada */}
            {selectedCurrencyData && (
                <div className="selected-currency-info">
                <h4>Información de la moneda:</h4>
                <div className="currency-details">
                    <span className="currency-symbol">{selectedCurrencyData.simbolo}</span>
                    <span className="currency-name">{selectedCurrencyData.nombre}</span>
                    <span className="currency-value">
                    Valor: ${parseFloat(selectedCurrencyData.valor_en_sus).toLocaleString()} USD
                    </span>
                </div>
                {saldoInicial && parseFloat(saldoInicial) > 0 && (
                    <div className="saldo-preview">
                    <strong>Saldo inicial: {parseFloat(saldoInicial).toLocaleString()} {selectedCurrencyData.simbolo}</strong>
                    </div>
                )}
                </div>
            )}

            {error && (
                <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
                </div>
            )}
            
            {success && (
                <div className="success-message">
                <span className="success-icon">✅</span>
                {success}
                </div>
            )}

            <div className="form-actions">
                <button 
                type="button" 
                onClick={() => navigate('/dashboard/wallets')}
                className="cancel-button"
                disabled={loading}
                >
                Cancelar
                </button>
                <button 
                type="submit" 
                className="submit-button"
                disabled={loading || !selectedCurrency || loadingCurrencies}
                >
                {loading ? 'Creando billetera...' : 'Crear Billetera'}
                </button>
            </div>
            </form>
        </div>
        </div>
    );
    };

    export default CreateWallet;