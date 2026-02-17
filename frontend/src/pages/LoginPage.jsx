import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao fazer login.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">
                    <span className="logo-emoji">🇲🇿</span>
                    <h1>Sabor Inteligente</h1>
                    <p>Nutricionista de Geladeira Inteligente</p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <div className="input-with-icon">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                            <span className="input-icon"><Mail size={18} /></span>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Senha</label>
                        <div className="input-with-icon">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                            <span className="input-icon"><Lock size={18} /></span>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                        {loading ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span className="spinner" style={{ width: 18, height: 18 }} /> Entrando...
                            </span>
                        ) : (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <LogIn size={18} /> Entrar
                            </span>
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    Não tem conta? <Link to="/register">Criar conta grátis</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
