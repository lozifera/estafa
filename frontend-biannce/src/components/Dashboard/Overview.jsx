    import React, { useState, useEffect } from 'react';
    import { useAuth } from '../../context/Authcontext';

    const Overview = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalBalance: 0,
        totalTransactions: 0,
        activeAnnouncements: 0,
        totalWallets: 0
    });

    useEffect(() => {
        // Aquí cargarías los datos reales desde la API
        loadUserStats();
    }, []);

    const loadUserStats = async () => {
        // Simular carga de datos - después conectar con API real
        setTimeout(() => {
        setStats({
            totalBalance: 2485.32,
            totalTransactions: 12,
            activeAnnouncements: 3,
            totalWallets: 4
        });
        }, 1000);
    };

    return (
        <div className="overview-container">
        <div className="welcome-card">
            <h2 className="welcome-title">¡Bienvenido, {user?.nombre}!</h2>
            <p className="welcome-text">Gestiona tus criptomonedas y realiza transacciones P2P</p>
        </div>

        <div className="stats-grid">
            <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
                <h4>Balance Total</h4>
                <p className="stat-value">${stats.totalBalance.toFixed(2)}</p>
                <span className="stat-change positive">+5.2%</span>
            </div>
            </div>

            <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-content">
                <h4>Transacciones</h4>
                <p className="stat-value">{stats.totalTransactions}</p>
                <span className="stat-change">Este mes</span>
            </div>
            </div>

            <div className="stat-card">
            <div className="stat-icon">📢</div>
            <div className="stat-content">
                <h4>Anuncios Activos</h4>
                <p className="stat-value">{stats.activeAnnouncements}</p>
                <span className="stat-change">Compra y venta</span>
            </div>
            </div>

            <div className="stat-card">
            <div className="stat-icon">💳</div>
            <div className="stat-content">
                <h4>Billeteras</h4>
                <p className="stat-value">{stats.totalWallets}</p>
                <span className="stat-change">Activas</span>
            </div>
            </div>
        </div>

        <div className="recent-activity">
            <h3>Actividad Reciente</h3>
            <div className="activity-list">
            <div className="activity-item">
                <div className="activity-icon">💰</div>
                <div className="activity-content">
                <p><strong>Billetera BTC creada</strong></p>
                <span className="activity-time">Hace 2 horas</span>
                </div>
            </div>
            <div className="activity-item">
                <div className="activity-icon">📝</div>
                <div className="activity-content">
                <p><strong>Transacción completada</strong></p>
                <span className="activity-time">Hace 5 horas</span>
                </div>
            </div>
            <div className="activity-item">
                <div className="activity-icon">📢</div>
                <div className="activity-content">
                <p><strong>Anuncio publicado</strong></p>
                <span className="activity-time">Hace 1 día</span>
                </div>
            </div>
            </div>
        </div>
        </div>
    );
    };

    export default Overview;