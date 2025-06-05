import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/Authcontext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard/Dashboard';
import Overview from './components/Dashboard/Overview';
import WalletsList from './components/Wallets/WalletsList';
import CreateWallet from './components/Wallets/CreateWallet';
import CreateAnnouncement from './components/Announcements/CreateAnnouncement';
import AnnouncementsList from './components/Announcements/AnnouncementsList';
import AdminDashboard from './components/Admin/AdminDashboard';
import AdminOverview from './components/Admin/AdminOverview';

// Componentes temporales para las rutas que faltan
const TransactionsList = () => <div>Transacciones - Próximamente</div>;
const Market = () => <div>Mercado - Próximamente</div>;
const Profile = () => <div>Perfil - Próximamente</div>;

function App() {
  const { user, loading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  console.log('App render - User:', user, 'Loading:', loading);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Cargando...
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        {user ? (
          // Verificar si es admin para redirigir
          user.es_admin ? (
            // Usuario ADMIN - Mostrar Panel de Administrador
            <Routes>
              <Route path="/admin" element={<AdminDashboard />}>
                <Route index element={<AdminOverview />} />
                {/* Aquí puedes agregar más rutas de admin en el futuro */}
              </Route>
              {/* Redireccionar cualquier ruta no encontrada al panel admin */}
              <Route path="*" element={<Navigate to="/admin" />} />
            </Routes>
          ) : (
            // Usuario NORMAL - Mostrar Dashboard normal
            <Routes>
              <Route path="/dashboard" element={<Dashboard />}>
                <Route index element={<Overview />} />
                <Route path="wallets" element={<WalletsList />} />
                <Route path="create-wallet" element={<CreateWallet />} />
                <Route path="create-announcement" element={<CreateAnnouncement />} />
                <Route path="transactions" element={<TransactionsList />} />
                <Route path="announcements" element={<AnnouncementsList />} />
                <Route path="market" element={<Market />} />
                <Route path="profile" element={<Profile />} />
              </Route>
              {/* Redireccionar cualquier ruta no encontrada al dashboard */}
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          )
        ) : (
          // Usuario no autenticado - Mostrar Login/Register
          <Routes>
            <Route 
              path="*" 
              element={
                showRegister ? (
                  <Register onSwitchToLogin={() => setShowRegister(false)} />
                ) : (
                  <Login onSwitchToRegister={() => setShowRegister(true)} />
                )
              } 
            />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;