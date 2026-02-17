import { useState, useEffect } from 'react';
import { shoppingListService } from '../services/api';

const ShoppingListPage = () => {
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [newItem, setNewItem] = useState({ item_name: '', quantity: '', unit: '', estimated_price_mt: '' });
    const [newListItems, setNewListItems] = useState([]);
    const [listTitle, setListTitle] = useState('Lista de Compras');

    useEffect(() => {
        loadLists();
    }, []);

    const loadLists = async () => {
        try {
            const res = await shoppingListService.getAll();
            setLists(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const addItem = () => {
        if (!newItem.item_name.trim()) return;
        setNewListItems(prev => [...prev, { ...newItem, id: Date.now() }]);
        setNewItem({ item_name: '', quantity: '', unit: '', estimated_price_mt: '' });
    };

    const removeItem = (id) => {
        setNewListItems(prev => prev.filter(i => i.id !== id));
    };

    const handleCreate = async () => {
        if (newListItems.length === 0) return;
        try {
            await shoppingListService.create({
                title: listTitle,
                items: newListItems
            });
            setShowCreate(false);
            setNewListItems([]);
            setListTitle('Lista de Compras');
            loadLists();
        } catch (err) {
            console.error(err);
        }
    };

    const handleToggle = async (itemId) => {
        try {
            await shoppingListService.toggleItem(itemId);
            loadLists();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Remover esta lista?')) return;
        try {
            await shoppingListService.delete(id);
            loadLists();
        } catch (err) {
            console.error(err);
        }
    };

    const totalCost = (items) => items.reduce((sum, i) => sum + parseFloat(i.estimated_price_mt || 0), 0);

    if (loading) {
        return (
            <div className="spinner-container">
                <div className="spinner"></div>
                <span className="spinner-text">Carregando listas...</span>
            </div>
        );
    }

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <h1>🛒 Lista de Compras</h1>
                    <p>Organize suas compras de forma inteligente</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowCreate(!showCreate)}>
                    {showCreate ? '✕ Cancelar' : '+ Nova Lista'}
                </button>
            </div>

            {/* Create new list */}
            {showCreate && (
                <div className="card" style={{ marginBottom: 24 }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>📝 Nova Lista</h2>

                    <div className="form-group">
                        <label>Título da lista</label>
                        <input type="text" className="form-control" value={listTitle} onChange={e => setListTitle(e.target.value)} />
                    </div>

                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                        <input type="text" className="form-control" style={{ flex: '1 1 200px' }}
                            placeholder="Nome do item" value={newItem.item_name}
                            onChange={e => setNewItem({ ...newItem, item_name: e.target.value })}
                            onKeyDown={e => e.key === 'Enter' && addItem()}
                        />
                        <input type="text" className="form-control" style={{ flex: '0 1 80px' }}
                            placeholder="Qtd" value={newItem.quantity}
                            onChange={e => setNewItem({ ...newItem, quantity: e.target.value })}
                        />
                        <input type="text" className="form-control" style={{ flex: '0 1 80px' }}
                            placeholder="Unid." value={newItem.unit}
                            onChange={e => setNewItem({ ...newItem, unit: e.target.value })}
                        />
                        <input type="number" className="form-control" style={{ flex: '0 1 100px' }}
                            placeholder="Preço MT" value={newItem.estimated_price_mt}
                            onChange={e => setNewItem({ ...newItem, estimated_price_mt: e.target.value })}
                        />
                        <button className="btn btn-success" onClick={addItem}>+</button>
                    </div>

                    {newListItems.length > 0 && (
                        <>
                            {newListItems.map(item => (
                                <div className="shopping-item" key={item.id}>
                                    <span className="item-name">{item.item_name}</span>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        {item.quantity} {item.unit}
                                    </span>
                                    {item.estimated_price_mt && <span className="item-price">{item.estimated_price_mt} MT</span>}
                                    <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', color: '#ff4757', cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
                                </div>
                            ))}

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-color)' }}>
                                <span style={{ fontWeight: 700 }}>
                                    Total estimado: <span style={{ color: 'var(--color-accent)' }}>{totalCost(newListItems).toFixed(0)} MT</span>
                                </span>
                                <button className="btn btn-success" onClick={handleCreate}>
                                    ✅ Criar Lista ({newListItems.length} itens)
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Existing lists */}
            {lists.length > 0 ? (
                lists.map(list => (
                    <div className="card" key={list.id} style={{ marginBottom: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <div>
                                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{list.title}</h3>
                                <div style={{ display: 'flex', gap: 16, fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
                                    <span>📅 {new Date(list.created_at).toLocaleDateString('pt-MZ')}</span>
                                    <span>💰 Total: <strong style={{ color: 'var(--color-accent)' }}>{list.total_estimated_cost_mt} MT</strong></span>
                                    <span>✅ {(list.items || []).filter(i => i.is_purchased).length}/{(list.items || []).length}</span>
                                </div>
                            </div>
                            <button className="btn btn-sm btn-secondary" onClick={() => handleDelete(list.id)} style={{ color: '#ff4757' }}>
                                🗑️
                            </button>
                        </div>

                        {(list.items || []).map(item => (
                            <div className={`shopping-item ${item.is_purchased ? 'purchased' : ''}`} key={item.id}>
                                <div
                                    className={`shopping-checkbox ${item.is_purchased ? 'checked' : ''}`}
                                    onClick={() => handleToggle(item.id)}
                                >
                                    {item.is_purchased && '✓'}
                                </div>
                                <span className="item-name">{item.item_name}</span>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                    {item.quantity} {item.unit}
                                </span>
                                {item.estimated_price_mt > 0 && (
                                    <span className="item-price">{item.estimated_price_mt} MT</span>
                                )}
                            </div>
                        ))}
                    </div>
                ))
            ) : !showCreate && (
                <div className="empty-state">
                    <div className="empty-icon">🛒</div>
                    <h3>Nenhuma lista de compras</h3>
                    <p>Crie uma lista para organizar suas compras e controlar gastos.</p>
                    <button className="btn btn-primary" onClick={() => setShowCreate(true)}>+ Criar Lista</button>
                </div>
            )}
        </div>
    );
};

export default ShoppingListPage;
