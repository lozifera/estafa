import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ sidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      id: 'overview',
      label: 'Resumen',
      icon: '📊',
      path: '/dashboard'
    },
    {
      id: 'wallets',
      label: 'Mis Billeteras',
      icon: '💰',
      path: '/dashboard/wallets'
    },
    {
      id: 'create-wallet',
      label: 'Crear Billetera',
      icon: '➕',
      path: '/dashboard/create-wallet'
    },
    {
      id: 'transactions',
      label: 'Transacciones',
      icon: '📝',
      path: '/dashboard/transactions'
    },
    {
      id: 'announcements',
      label: 'Anuncios',
      icon: '📢',
      path: '/dashboard/announcements'
    }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <nav className="sidebar-nav">
        <div className="nav-section">
          <h4 className="nav-section-title">Principal</h4>
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${isActive(item.path) ? 'nav-item-active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className="nav-item-icon">{item.icon}</span>
              <span className="nav-item-text">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;