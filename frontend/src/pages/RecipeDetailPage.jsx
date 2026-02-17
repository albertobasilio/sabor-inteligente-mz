import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { recipeService, favoriteService } from '../services/api';
import { useToast } from '../context/ToastContext';

const RecipeDetailPage = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [favLoading, setFavLoading] = useState(false);
    const toast = useToast();

    useEffect(() => {
        loadRecipe();
    }, [id]);

    const loadRecipe = async () => {
        try {
            const [recipeRes, favRes] = await Promise.allSettled([
                recipeService.getById(id),
                favoriteService.check(id)
            ]);
            if (recipeRes.status === 'fulfilled') setRecipe(recipeRes.value.data);
            if (favRes.status === 'fulfilled') setIsFavorite(favRes.value.data?.is_favorite || false);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = async () => {
        setFavLoading(true);
        try {
            if (isFavorite) {
                await favoriteService.remove(id);
                setIsFavorite(false);
                toast.success('Removido dos favoritos');
            } else {
                await favoriteService.add(id);
                setIsFavorite(true);
                toast.success('Adicionado aos favoritos! ❤️');
            }
        } catch (err) {
            toast.error('Erro ao atualizar favorito');
        } finally {
            setFavLoading(false);
        }
    };

    const shareWhatsApp = () => {
        const url = `${window.location.origin}/recipes/public/${id}`;
        const text = `🍲 Confere esta receita moçambicana: *${recipe?.title}*\n\n${recipe?.description}\n\n👉 ${url}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    const copyLink = async () => {
        const url = `${window.location.origin}/recipes/public/${id}`;
        try {
            await navigator.clipboard.writeText(url);
            toast.success('Link copiado! 📋');
        } catch {
            toast.error('Erro ao copiar');
        }
    };

    if (loading) {
        return (
            <div className="spinner-container">
                <div className="spinner"></div>
                <span className="spinner-text">Carregando receita...</span>
            </div>
        );
    }

    if (!recipe) {
        return (
            <div className="empty-state">
                <div className="empty-icon">🍽️</div>
                <h3>Receita não encontrada</h3>
                <Link to="/recipes" className="btn btn-primary">← Voltar às Receitas</Link>
            </div>
        );
    }

    const tags = typeof recipe.tags === 'string' ? JSON.parse(recipe.tags || '[]') : (recipe.tags || []);

    return (
        <div className="page-enter">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Link to="/recipes" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    ← Voltar às receitas
                </Link>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button
                        className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                        onClick={toggleFavorite}
                        disabled={favLoading}
                        title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                    >
                        {isFavorite ? '❤️' : '🤍'}
                    </button>
                    <button className="share-btn whatsapp" onClick={shareWhatsApp} title="Partilhar no WhatsApp">
                        📱
                    </button>
                    <button className="share-btn" onClick={copyLink} title="Copiar link">
                        🔗
                    </button>
                </div>
            </div>

            {/* Header */}
            <div className="card" style={{ marginBottom: 24, overflow: 'hidden' }}>
                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                    <div style={{
                        width: 200, height: 200, borderRadius: 'var(--radius-lg)',
                        background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem',
                        flexShrink: 0, overflow: 'hidden'
                    }}>
                        {recipe.image_url ? (
                            <img
                                src={recipe.image_url}
                                alt={recipe.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '🍛'; }}
                            />
                        ) : '🍛'}
                    </div>

                    <div style={{ flex: 1, minWidth: 250 }}>
                        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 8 }}>{recipe.title}</h1>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.5 }}>{recipe.description}</p>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.9rem' }}>
                                <span>⏱</span>
                                <div>
                                    <div style={{ fontWeight: 600 }}>{(recipe.prep_time_min || 0) + (recipe.cook_time_min || 0)} min</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tempo total</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.9rem' }}>
                                <span>👥</span>
                                <div>
                                    <div style={{ fontWeight: 600 }}>{recipe.servings} porções</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rendimento</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.9rem' }}>
                                <span>📍</span>
                                <div>
                                    <div style={{ fontWeight: 600 }}>{recipe.region || 'Nacional'}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Região</div>
                                </div>
                            </div>
                        </div>

                        {tags.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                {tags.map((tag, i) => (
                                    <span key={i} style={{
                                        padding: '4px 12px', background: 'rgba(232, 98, 28, 0.1)',
                                        color: 'var(--color-primary-light)', borderRadius: 'var(--radius-xl)',
                                        fontSize: '0.75rem', fontWeight: 600
                                    }}>
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="recipe-detail-grid">
                {/* Left: Ingredients */}
                <div>
                    <div className="card">
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>🥘 Produtos Necessários</h2>
                        {(recipe.ingredients || []).length > 0 ? (
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {recipe.ingredients.map((ing, i) => (
                                    <li key={i} style={{
                                        display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0',
                                        borderBottom: '1px solid var(--border-color)'
                                    }}>
                                        <span>{ing.emoji || '🥄'}</span>
                                        <span style={{ flex: 1 }}>{ing.ingredient_name || ing.name}</span>
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                            {ing.quantity} {ing.unit}
                                        </span>
                                        {ing.is_optional && (
                                            <span style={{ fontSize: '0.7rem', color: 'var(--color-accent)', background: 'rgba(245,166,35,0.1)', padding: '2px 6px', borderRadius: 4 }}>
                                                opcional
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                Produtos não detalhados para esta receita.
                            </p>
                        )}
                    </div>
                </div>

                {/* Right: Nutrition */}
                <div>
                    <div className="card">
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>📊 Informação Nutricional</h2>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12 }}>Por porção</p>
                        {[
                            { label: 'Calorias', value: recipe.calories, unit: 'kcal', max: 600, color: '#E8621C' },
                            { label: 'Proteínas', value: recipe.protein, unit: 'g', max: 50, color: '#1B8C4E' },
                            { label: 'Carboidratos', value: recipe.carbs, unit: 'g', max: 80, color: '#F5A623' },
                            { label: 'Gordura', value: recipe.fat, unit: 'g', max: 40, color: '#0A6E8A' },
                            { label: 'Fibra', value: recipe.fiber, unit: 'g', max: 20, color: '#8B5CF6' },
                            { label: 'Ferro', value: recipe.iron, unit: 'mg', max: 10, color: '#EC4899' },
                        ].map(n => (
                            <div key={n.label} style={{ marginBottom: 10 }}>
                                <div className="nutrition-label">
                                    <span>{n.label}</span>
                                    <span style={{ color: n.color }}>{n.value || 0} {n.unit}</span>
                                </div>
                                <div className="nutrition-bar">
                                    <div className="nutrition-bar-fill" style={{
                                        width: `${Math.min(((n.value || 0) / n.max) * 100, 100)}%`,
                                        background: `linear-gradient(90deg, ${n.color}, ${n.color}88)`
                                    }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Instructions */}
            <div className="card" style={{ marginTop: 24 }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>👨‍🍳 Modo de Preparo</h2>
                <div style={{ fontSize: '0.9rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
                    {(recipe.instructions || '').split('\n').filter(s => s.trim()).map((step, i) => (
                        <div key={i} style={{
                            display: 'flex', gap: 12, marginBottom: 12, padding: '8px 12px',
                            background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                            borderRadius: 'var(--radius-sm)'
                        }}>
                            <span style={{
                                background: 'var(--color-primary)', color: 'white',
                                width: 24, height: 24, borderRadius: '50%', display: 'flex',
                                alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem',
                                fontWeight: 700, flexShrink: 0, marginTop: 2
                            }}>
                                {i + 1}
                            </span>
                            <span>{step.replace(/^\d+\.\s*/, '')}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RecipeDetailPage;
