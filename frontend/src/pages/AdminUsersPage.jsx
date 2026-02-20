import { useEffect, useState } from 'react';
import { adminService } from '../services/api';

const planOptions = ['free', 'basic', 'pro', 'premium'];
const roleOptions = ['user', 'admin'];

const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState(null);
    const [message, setMessage] = useState('');

    const loadUsers = async () => {
        setLoading(true);
        try {
            const res = await adminService.getUsers();
            setUsers(res.data || []);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Erro ao carregar utilizadores.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const updateLocalUser = (id, key, value) => {
        setUsers(prev => prev.map(u => (u.id === id ? { ...u, [key]: value } : u)));
    };

    const saveAccess = async (user) => {
        setSavingId(user.id);
        setMessage('');
        try {
            await adminService.updateUserAccess(user.id, {
                plan: user.plan,
                role: user.role
            });
            setMessage(`Acesso atualizado para ${user.name}.`);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Erro ao atualizar acesso.');
        } finally {
            setSavingId(null);
        }
    };

    if (loading) {
        return (
            <div className="spinner-container">
                <div className="spinner"></div>
                <span className="spinner-text">Carregando utilizadores...</span>
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <h1>Admin: Utilizadores</h1>
                <p>Gerencie perfis, planos e niveis de acesso.</p>
            </div>

            {message && (
                <div className={`alert ${message.toLowerCase().includes('erro') ? 'alert-error' : 'alert-success'}`}>
                    {message}
                </div>
            )}

            <div className="card" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '10px 8px' }}>Nome</th>
                            <th style={{ padding: '10px 8px' }}>Email</th>
                            <th style={{ padding: '10px 8px' }}>Plano</th>
                            <th style={{ padding: '10px 8px' }}>Role</th>
                            <th style={{ padding: '10px 8px' }}>Acao</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '10px 8px' }}>{user.name}</td>
                                <td style={{ padding: '10px 8px' }}>{user.email}</td>
                                <td style={{ padding: '10px 8px' }}>
                                    <select
                                        className="form-control"
                                        value={user.plan || 'free'}
                                        onChange={e => updateLocalUser(user.id, 'plan', e.target.value)}
                                        style={{ minHeight: 36 }}
                                    >
                                        {planOptions.map(p => (
                                            <option key={p} value={p}>{p}</option>
                                        ))}
                                    </select>
                                </td>
                                <td style={{ padding: '10px 8px' }}>
                                    <select
                                        className="form-control"
                                        value={user.role || 'user'}
                                        onChange={e => updateLocalUser(user.id, 'role', e.target.value)}
                                        style={{ minHeight: 36 }}
                                    >
                                        {roleOptions.map(r => (
                                            <option key={r} value={r}>{r}</option>
                                        ))}
                                    </select>
                                </td>
                                <td style={{ padding: '10px 8px' }}>
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => saveAccess(user)}
                                        disabled={savingId === user.id}
                                    >
                                        {savingId === user.id ? 'Salvando...' : 'Salvar'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsersPage;
