    import React, { useState } from 'react';
    import { useAuth } from '../context/Authcontext';
    import '../styles/Login.css';

    const Login = ({ onSwitchToRegister }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(formData.email, formData.password);
        
        if (!result.success) {
        setError(result.error);
        }

        setLoading(false);
    };

    const handleChange = (e) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value
        });
    };

    return (
        <div className="login-container">
        <div className="login-card">
            <div className="login-header">
            <div className="login-logo">
                <span className="logo-icon">₿</span>
            </div>
            <h1 className="login-title">Binance P2P</h1>
            <p className="login-subtitle">Inicia sesión en tu cuenta</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
                <label className="input-label">Email</label>
                <div className="input-container">
                <span className="input-icon"></span>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="tu@email.com"
                    required
                />
                </div>
            </div>

            <div className="input-group">
                <label className="input-label">Contraseña</label>
                <div className="input-container">
                <span className="input-icon"></span>
                <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field input-password"
                    placeholder="••••••••"
                    required
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="eye-button"
                >
                    {showPassword ? '🙈' : '👁️'}
                </button>
                </div>
            </div>

            {error && (
                <div className="error-message">
                {error}
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="submit-button"
            >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
            </form>

            <div className="login-footer">
            <p className="footer-text">
                ¿No tienes cuenta?
                <button
                onClick={onSwitchToRegister}
                className="switch-button"
                >
                Regístrate
                </button>
            </p>
            </div>
        </div>
        </div>
    );
    };

    export default Login;