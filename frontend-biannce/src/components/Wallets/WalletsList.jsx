    import React, { useState, useEffect } from 'react';
    import { useNavigate } from 'react-router-dom';
    import walletService from '../../services/walletService';
    import '../../styles/WalletsList.css';

    const WalletsList = () => {
    const navigate = useNavigate();
    const [wallets, setWallets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchWallets();
    }, []);

    const fetchWallets = async () => {
        try {
        const result = await walletService.getUserWallets();
        if (result.success) {
            setWallets(result.data);
        } else {
            setError(result.error);
        }
        } catch (error) {
        console.error('Error fetching wallets:', error);
        setError('Error al cargar billeteras');
        } finally {
        setLoading(false);
        }
    };

    const formatBalance = (saldo) => {
        return parseFloat(saldo).toLocaleString('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 8
        });
    };

    const calculateUSDValue = (saldo, valorEnUsd) => {
        const value = parseFloat(saldo) * parseFloat(valorEnUsd);
        return value.toLocaleString('es-ES', {
        style: 'currency',
        currency: 'USD'
        });
    };

    if (loading) {
        return (
        <div className="wallets-loading">
            <div className="loading-spinner"></div>
            <p>Cargando tus billeteras...</p>
        </div>
        );
    }

    return (
        <div className="wallets-container">
        <div className="wallets-header">
            <div className="header-info">
            <h2>Mis Billeteras</h2>
            <p className="wallets-count">
                {wallets.length} {wallets.length === 1 ? 'billetera' : 'billeteras'}
            </p>
            </div>
            <button 
            onClick={() => navigate('/dashboard/create-wallet')}
            className="create-wallet-btn"
            >
            <span className="btn-icon">+</span>
            Crear Billetera
            </button>
        </div>

        {error && (
            <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
            </div>
        )}

        <div className="wallets-grid">
            {wallets.length > 0 ? (
            wallets.map((wallet) => (
                <div key={wallet.id} className="wallet-card">
                <div className="wallet-icon">
                    <span className="currency-symbol">{wallet.moneda?.simbolo}</span>
                </div>
                
                <div className="wallet-info">
                    <h3 className="currency-name">{wallet.moneda?.nombre}</h3>
                    <p className="wallet-symbol">{wallet.moneda?.simbolo}</p>
                </div>

                <div className="wallet-balance">
                    <div className="balance-main">
                    <span className="balance-amount">{formatBalance(wallet.saldo)}</span>
                    <span className="balance-currency">{wallet.moneda?.simbolo}</span>
                    </div>
                    <div className="balance-usd">
                    {calculateUSDValue(wallet.saldo, wallet.moneda?.valor_en_sus)}
                    </div>
                </div>

                    <div className="wallet-actions">
                    <button 
                        className="action-btn primary"
                        onClick={() => navigate(`/dashboard/create-announcement?wallet=${wallet.id}&currency=${wallet.moneda?.simbolo}`)}
                    >
                        💰 Vender
                    </button>
                    <button 
                        className="action-btn secondary"
                        onClick={() => console.log('Ver detalles wallet:', wallet.id)}
                    >
                        👁️ Detalles
                    </button>
                    </div>
                </div>
            ))
            ) : (
            <div className="no-wallets">
                <div className="no-wallets-icon">💳</div>
                <h3>No tienes billeteras</h3>
                <p>Crea tu primera billetera para comenzar a gestionar tus criptomonedas</p>
                <button 
                onClick={() => navigate('/dashboard/create-wallet')}
                className="create-first-wallet-btn"
                >
                <span className="btn-icon">+</span>
                Crear Primera Billetera
                </button>
            </div>
            )}
        </div>
        </div>
    );
    };

    export default WalletsList;