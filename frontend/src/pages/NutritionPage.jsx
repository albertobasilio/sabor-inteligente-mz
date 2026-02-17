import { useState, useEffect } from 'react';
import { nutritionService } from '../services/api';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale, LinearScale, BarElement,
    ArcElement, Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const NutritionPage = () => {
    const [dailySummary, setDailySummary] = useState(null);
    const [weeklyData, setWeeklyData] = useState([]);
    const [tips, setTips] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [selectedDate]);

    const loadData = async () => {
        try {
            const [dailyRes, weeklyRes, tipsRes] = await Promise.allSettled([
                nutritionService.getDaily(selectedDate),
                nutritionService.getWeekly(),
                nutritionService.getTips()
            ]);

            if (dailyRes.status === 'fulfilled') setDailySummary(dailyRes.value.data);
            if (weeklyRes.status === 'fulfilled') setWeeklyData(weeklyRes.value.data);
            if (tipsRes.status === 'fulfilled') setTips(tipsRes.value.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const dailyGoals = {
        calories: 2000,
        protein: 50,
        carbs: 300,
        fat: 65,
        fiber: 25,
        iron: 8
    };

    const summary = dailySummary?.summary || {};

    const macroData = {
        labels: ['Proteínas', 'Carboidratos', 'Gordura', 'Fibra'],
        datasets: [{
            data: [
                summary.total_protein || 0,
                summary.total_carbs || 0,
                summary.total_fat || 0,
                summary.total_fiber || 0
            ],
            backgroundColor: ['#1B8C4E', '#F5A623', '#0A6E8A', '#8B5CF6'],
            borderWidth: 0
        }]
    };

    const weeklyChartData = {
        labels: weeklyData.map(d => {
            const date = new Date(d.log_date);
            return date.toLocaleDateString('pt-MZ', { weekday: 'short' });
        }),
        datasets: [{
            label: 'Calorias',
            data: weeklyData.map(d => d.total_calories || 0),
            backgroundColor: 'rgba(232, 98, 28, 0.6)',
            borderRadius: 6
        }]
    };

    if (loading) {
        return (
            <div className="spinner-container">
                <div className="spinner"></div>
                <span className="spinner-text">Carregando dados nutricionais...</span>
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <h1>📊 Controle Nutricional</h1>
                <p>Acompanhe sua alimentação e saúde</p>
            </div>

            {/* Date selector */}
            <div style={{ marginBottom: 24 }}>
                <input
                    type="date"
                    className="form-control"
                    style={{ maxWidth: 200 }}
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                />
            </div>

            {/* Daily Stats */}
            <div className="card-grid" style={{ marginBottom: 24 }}>
                {[
                    { label: 'Calorias', value: summary.total_calories || 0, goal: dailyGoals.calories, unit: 'kcal', color: '#E8621C', emoji: '🔥' },
                    { label: 'Proteínas', value: summary.total_protein || 0, goal: dailyGoals.protein, unit: 'g', color: '#1B8C4E', emoji: '💪' },
                    { label: 'Carboidratos', value: summary.total_carbs || 0, goal: dailyGoals.carbs, unit: 'g', color: '#F5A623', emoji: '🌾' },
                    { label: 'Refeições', value: summary.total_meals || 0, goal: 4, unit: '', color: '#0A6E8A', emoji: '🍽️' },
                ].map(stat => (
                    <div className="stat-card" key={stat.label}>
                        <div className="stat-icon" style={{ background: `${stat.color}20`, fontSize: '1.5rem' }}>
                            {stat.emoji}
                        </div>
                        <div className="stat-info" style={{ flex: 1 }}>
                            <h3 style={{ color: stat.color }}>{stat.value} <span style={{ fontSize: '0.8rem', fontWeight: 400 }}>{stat.unit}</span></h3>
                            <p>{stat.label}</p>
                            <div className="nutrition-bar" style={{ marginTop: 4 }}>
                                <div className="nutrition-bar-fill" style={{
                                    width: `${Math.min((stat.value / stat.goal) * 100, 100)}%`,
                                    background: stat.color
                                }} />
                            </div>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Meta: {stat.goal} {stat.unit}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 24, marginBottom: 24 }}>
                {/* Macros donut */}
                <div className="card">
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>🥗 Macronutrientes do Dia</h3>
                    <div style={{ maxWidth: 280, margin: '0 auto' }}>
                        <Doughnut data={macroData} options={{
                            responsive: true,
                            plugins: {
                                legend: { position: 'bottom', labels: { color: '#9BA1B0', padding: 16 } }
                            },
                            cutout: '65%'
                        }} />
                    </div>
                </div>

                {/* Weekly bar chart */}
                <div className="card">
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>📈 Calorias da Semana</h3>
                    {weeklyData.length > 0 ? (
                        <Bar data={weeklyChartData} options={{
                            responsive: true,
                            plugins: {
                                legend: { display: false },
                            },
                            scales: {
                                x: { ticks: { color: '#9BA1B0' }, grid: { display: false } },
                                y: { ticks: { color: '#9BA1B0' }, grid: { color: 'rgba(255,255,255,0.05)' } }
                            }
                        }} />
                    ) : (
                        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                            <p>Sem dados esta semana. Registe suas refeições!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Detailed nutrition bars */}
            <div className="card" style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>📋 Detalhes Nutricionais</h3>
                {[
                    { label: 'Calorias', value: summary.total_calories || 0, goal: dailyGoals.calories, unit: 'kcal', color: '#E8621C' },
                    { label: 'Proteínas', value: summary.total_protein || 0, goal: dailyGoals.protein, unit: 'g', color: '#1B8C4E' },
                    { label: 'Carboidratos', value: summary.total_carbs || 0, goal: dailyGoals.carbs, unit: 'g', color: '#F5A623' },
                    { label: 'Gordura', value: summary.total_fat || 0, goal: dailyGoals.fat, unit: 'g', color: '#0A6E8A' },
                    { label: 'Fibra', value: summary.total_fiber || 0, goal: dailyGoals.fiber, unit: 'g', color: '#8B5CF6' },
                    { label: 'Ferro', value: summary.total_iron || 0, goal: dailyGoals.iron, unit: 'mg', color: '#EC4899' },
                ].map(n => (
                    <div key={n.label} style={{ marginBottom: 14 }}>
                        <div className="nutrition-label">
                            <span>{n.label}</span>
                            <span style={{ color: n.color }}>{n.value} / {n.goal} {n.unit}</span>
                        </div>
                        <div className="nutrition-bar" style={{ height: 10 }}>
                            <div className="nutrition-bar-fill" style={{
                                width: `${Math.min((n.value / n.goal) * 100, 100)}%`,
                                background: `linear-gradient(90deg, ${n.color}, ${n.color}88)`,
                                borderRadius: 5
                            }} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Tips */}
            <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>💡 Dicas de Nutrição</h3>
                {tips.map((tip, i) => (
                    <div className="tip-card" key={i}>
                        <div className="tip-icon">{tip.icon}</div>
                        <div className="tip-content">
                            <h4>{tip.title}</h4>
                            <p>{tip.text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NutritionPage;
