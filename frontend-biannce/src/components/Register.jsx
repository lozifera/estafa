    import React, { useState } from 'react';
    import { useAuth } from '../context/Authcontext';
    import '../styles/Register.css';

    const Register = ({ onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await register(formData.nombre, formData.email, formData.password);
        
        if (result.success) {
        alert('Usuario registrado exitosamente. Ahora puedes iniciar sesión.');
        onSwitchToLogin();
        } else {
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
        <div className="register-container">
        <div className="register-card">
            <div className="register-header">
            <div className="register-logo">
                <span className="logo-icon">₿</span>
            </div>
            <h1 className="register-title">Binance P2P</h1>
            <p className="register-subtitle">Crea tu cuenta nueva</p>
            </div>

            <form onSubmit={handleSubmit} className="register-form">
            <div className="input-group">
                <label className="input-label">Nombre completo</label>
                <div className="input-container">
                <span className="input-icon">👤</span>
                <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Tu nombre completo"
                    required
                    disabled={loading}
                />
                </div>
            </div>

            <div className="input-group">
                <label className="input-label">Email</label>
                <div className="input-container">
                <span className="input-icon">📧</span>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="tu@email.com"
                    required
                    disabled={loading}
                />
                </div>
            </div>

            <div className="input-group">
                <label className="input-label">Contraseña</label>
                <div className="input-container">
                <span className="input-icon">🔒</span>
                <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field input-password"
                    placeholder="••••••••"
                    required
                    disabled={loading}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="eye-button"
                    disabled={loading}
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
                {loading ? 'Registrando...' : 'Registrarse'}
            </button>
            </form>

            <div className="register-footer">
            <p className="footer-text">
                ¿Ya tienes cuenta?
                <button
                onClick={onSwitchToLogin}
                className="switch-button"
                disabled={loading}
                >
                Inicia sesión
                </button>
            </p>
            </div>
        </div>
        </div>
    );
    };

    export default Register;