import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Phone, MapPin, UserPlus } from 'lucide-react';

const regions = ['Maputo', 'Gaza', 'Inhambane', 'Sofala', 'Manica', 'Tete', 'Zambézia', 'Nampula', 'Cabo Delgado', 'Niassa'];

const RegisterPage = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', region: 'Maputo' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (form.password.length < 6) {
            return setError('A senha deve ter pelo menos 6 caracteres.');
        }
        setLoading(true);
        try {
            await register(form);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao criar conta.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">
                    <span className="logo-emoji">🇲🇿</span>
                    <h1>Criar Conta</h1>
                    <p>Junte-se ao Sabor Inteligente MZ</p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nome completo</label>
                        <div className="input-with-icon">
                            <input type="text" name="name" className="form-control" placeholder="Seu nome" value={form.name} onChange={handleChange} required />
                            <span className="input-icon"><User size={18} /></span>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <div className="input-with-icon">
                            <input type="email" name="email" className="form-control" placeholder="seu@email.com" value={form.email} onChange={handleChange} required />
                            <span className="input-icon"><Mail size={18} /></span>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Senha</label>
                        <div className="input-with-icon">
                            <input type="password" name="password" className="form-control" placeholder="Mínimo 6 caracteres" value={form.password} onChange={handleChange} required />
                            <span className="input-icon"><Lock size={18} /></span>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Telefone (opcional)</label>
                        <div className="input-with-icon">
                            <input type="tel" name="phone" className="form-control" placeholder="+258 84 xxx xxxx" value={form.phone} onChange={handleChange} />
                            <span className="input-icon"><Phone size={18} /></span>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Região</label>
                        <div className="input-with-icon">
                            <select name="region" className="form-control" value={form.region} onChange={handleChange} style={{ paddingLeft: 44 }}>
                                {regions.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                            <span className="input-icon"><MapPin size={18} /></span>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                        {loading ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span className="spinner" style={{ width: 18, height: 18 }} /> Criando...
                            </span>
                        ) : (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <UserPlus size={18} /> Criar Conta
                            </span>
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    Já tem conta? <Link to="/login">Entrar</Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
