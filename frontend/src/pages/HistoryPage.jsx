import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ingredientService } from '../services/api';
import { useToast } from '../context/ToastContext';

const HistoryPage = () => {
    const [scans, setScans] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const res = await ingredientService.getScanHistory();
            setScans(res.data);
        } catch (err) {
            toast.error('Erro ao carregar histórico.');
        } finally {
            setLoading(false);
        }
    };

    const parseJSON = (val) => {
        if (!val) return [];
        if (Array.isArray(val)) return val;
        try { return JSON.parse(val); } catch { return []; }
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('pt-MZ', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="page-enter">
                <div className="page-header">
                    <h1>📜 Histórico de Scans</h1>
                    <p>Os seus scans anteriores</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} className="card skeleton-card" style={{ height: 100 }}>
                            <div className="skeleton-line" style={{ width: '40%', height: 16 }} />
                            <div className="skeleton-line" style={{ width: '100%', height: 12, marginTop: 12 }} />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="page-enter">
            <div className="page-header">
                <h1>📜 Histórico de Scans</h1>
                <p>{scans.length} {scans.length === 1 ? 'scan realizado' : 'scans realizados'}</p>
            </div>

            {scans.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📸</div>
                    <h3>Sem histórico ainda</h3>
                    <p>Faça o seu primeiro scan para começar</p>
                    <Link to="/scan" className="btn btn-primary">📸 Escanear Agora</Link>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {scans.map(scan => {
                        const detected = parseJSON(scan.detected_ingredients);
                        const confirmed = parseJSON(scan.confirmed_ingredients);

                        return (
                            <div key={scan.id} className="card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span style={{ fontSize: '1.3rem' }}>
                                            {scan.scan_type === 'geladeira' ? '🧊' : scan.scan_type === 'despensa' ? '🗄️' : scan.scan_type === 'IA Scan' ? '🤖' : '🛒'}
                                        </span>
                                        <div>
                                            <h3 style={{ fontSize: '.95rem', fontWeight: 700 }}>
                                                {scan.scan_type === 'geladeira' ? 'Scan Geladeira' : scan.scan_type === 'despensa' ? 'Scan Despensa' : scan.scan_type === 'IA Scan' ? 'Scan IA' : 'Scan Mercado'}
                                            </h3>
                                            <p style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>
                                                {formatDate(scan.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span className="info-pill">{detected.length} detectados</span>
                                    </div>
                                </div>

                                {/* Detected ingredients */}
                                <div style={{ marginBottom: 8 }}>
                                    <p style={{ fontSize: '.7rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6 }}>
                                        PRODUTOS CONFIRMADOS ({confirmed.length})
                                    </p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                        {(typeof confirmed[0] === 'string' ? confirmed : confirmed.map(c => c.name || c)).map((name, j) => (
                                            <span key={j} style={{
                                                fontSize: '.75rem', padding: '3px 8px',
                                                background: 'rgba(52,211,153,0.1)', color: '#6ee7b7',
                                                borderRadius: 4
                                            }}>
                                                {name}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {detected.length > confirmed.length && (
                                    <p style={{ fontSize: '.72rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                        +{detected.length - confirmed.length} produtos não confirmados
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default HistoryPage;
