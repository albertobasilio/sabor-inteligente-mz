import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';

const dietaryOptions = [
    { key: 'gluten_free', label: 'Sem Glúten', emoji: '🌾' },
    { key: 'vegan', label: 'Vegano', emoji: '🌱' },
    { key: 'vegetarian', label: 'Vegetariano', emoji: '🥬' },
    { key: 'low_sugar', label: 'Baixo Açúcar', emoji: '🍬' },
    { key: 'diabetic', label: 'Diabético', emoji: '💉' },
    { key: 'child_diet', label: 'Criança', emoji: '👶' },
    { key: 'athlete', label: 'Atleta', emoji: '🏃' },
    { key: 'elderly', label: 'Idoso', emoji: '👴' },
    { key: 'pregnant', label: 'Gestante', emoji: '🤰' },
];

const regions = ['Maputo', 'Gaza', 'Inhambane', 'Sofala', 'Manica', 'Tete', 'Zambézia', 'Nampula', 'Cabo Delgado', 'Niassa'];

const ProfilePage = () => {
    const { user, updateUser } = useAuth();
    const [profile, setProfile] = useState({ name: '', phone: '', region: 'Maputo' });
    const [dietary, setDietary] = useState({});
    const [allergies, setAllergies] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const res = await authService.getProfile();
            const userData = res.data.user;
            const dp = res.data.dietaryProfile || {};
            setProfile({ name: userData.name, phone: userData.phone || '', region: userData.region || 'Maputo' });
            setDietary(dp);
            setAllergies(dp.allergies || '');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleDietary = (key) => {
        setDietary(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage('');
        try {
            await authService.updateProfile(profile);
            await authService.updateDietaryProfile({
                ...dietary,
                allergies,
            });
            updateUser({ ...user, ...profile });
            setMessage('Perfil atualizado com sucesso! ✅');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage('Erro ao salvar perfil. ❌');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="spinner-container">
                <div className="spinner"></div>
                <span className="spinner-text">Carregando perfil...</span>
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <h1>👤 Meu Perfil</h1>
                <p>Configure suas preferências e restrições alimentares</p>
            </div>

            {message && (
                <div className={`alert ${message.includes('sucesso') ? 'alert-success' : 'alert-error'}`}>
                    {message}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24 }}>
                {/* Personal Info */}
                <div className="card">
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 20 }}>📋 Informações Pessoais</h2>

                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                        <div style={{
                            width: 80, height: 80, borderRadius: '50%', margin: '0 auto 12px',
                            background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '2rem', fontWeight: 800, color: 'white'
                        }}>
                            {profile.name?.[0] || 'U'}
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{user?.email}</p>
                        <span style={{
                            display: 'inline-block', marginTop: 6, padding: '4px 12px',
                            background: user?.plan === 'premium' ? 'rgba(245, 166, 35, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                            color: user?.plan === 'premium' ? 'var(--color-accent)' : 'var(--text-muted)',
                            borderRadius: 'var(--radius-xl)', fontSize: '0.8rem', fontWeight: 600
                        }}>
                            {user?.plan === 'premium' ? '⭐ Premium' : '🆓 Plano Gratuito'}
                        </span>
                    </div>

                    <div className="form-group">
                        <label>Nome</label>
                        <input type="text" className="form-control" value={profile.name}
                            onChange={e => setProfile({ ...profile, name: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Telefone</label>
                        <input type="tel" className="form-control" placeholder="+258 84 xxx xxxx" value={profile.phone}
                            onChange={e => setProfile({ ...profile, phone: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Região</label>
                        <select className="form-control" value={profile.region}
                            onChange={e => setProfile({ ...profile, region: e.target.value })}>
                            {regions.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                </div>

                {/* Dietary Profile */}
                <div className="card">
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 20 }}>🥗 Perfil Alimentar</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 16 }}>
                        Selecione suas restrições e preferências para receitas personalizadas.
                    </p>

                    <div className="toggle-group" style={{ marginBottom: 20 }}>
                        {dietaryOptions.map(opt => (
                            <div
                                key={opt.key}
                                className={`toggle-chip ${dietary[opt.key] ? 'active' : ''}`}
                                onClick={() => toggleDietary(opt.key)}
                            >
                                {opt.emoji} {opt.label}
                            </div>
                        ))}
                    </div>

                    <div className="form-group">
                        <label>Alergias (opcional)</label>
                        <textarea
                            className="form-control"
                            placeholder="Descreva alergias alimentares..."
                            value={allergies}
                            onChange={e => setAllergies(e.target.value)}
                            rows={3}
                        />
                    </div>
                </div>
            </div>

            {/* Save button */}
            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary btn-lg" onClick={handleSave} disabled={saving}>
                    {saving ? '⏳ Salvando...' : '💾 Salvar Perfil'}
                </button>
            </div>
        </div>
    );
};

export default ProfilePage;
