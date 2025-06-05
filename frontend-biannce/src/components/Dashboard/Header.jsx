    import React from 'react';
    import { useAuth } from '../../context/Authcontext';

    const Header = ({ sidebarOpen, setSidebarOpen }) => {
    const { user, logout } = useAuth();

    return (
        <header className="dashboard-header">
        <div className="header-left">
            <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            >
            ☰
            </button>
            <div className="header-logo">
            <div className="header-logo-icon">₿</div>
            <h1 className="header-title">Binance P2P</h1>
            </div>
        </div>
        
        <div className="header-user-info">
            <span className="user-greeting">Hola, {user?.nombre}</span>
            <button onClick={logout} className="logout-button">
            <span>🚪</span>
            <span>Salir</span>
            </button>
        </div>
        </header>
    );
    };

    export default Header;