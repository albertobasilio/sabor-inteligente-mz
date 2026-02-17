import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ScanPage from './pages/ScanPage';
import RecipesPage from './pages/RecipesPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import MealPlanPage from './pages/MealPlanPage';
import ShoppingListPage from './pages/ShoppingListPage';
import NutritionPage from './pages/NutritionPage';
import ProfilePage from './pages/ProfilePage';
import FavoritesPage from './pages/FavoritesPage';
import HistoryPage from './pages/HistoryPage';
import NotFoundPage from './pages/NotFoundPage';

const ProtectedRoute = () => {
    const { user, loading } = useAuth();
    if (loading) {
        return (
            <div className="spinner-container">
                <div className="spinner"></div>
                <span className="spinner-text">Carregando...</span>
            </div>
        );
    }
    return user ? <Outlet /> : <Navigate to="/login" />;
};

const AppRoutes = () => {
    const { user } = useAuth();

    return (
        <Routes>
            <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
            <Route path="/register" element={user ? <Navigate to="/" /> : <RegisterPage />} />

            {/* Protected routes with shared layout */}
            <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/scan" element={<ScanPage />} />
                    <Route path="/recipes" element={<RecipesPage />} />
                    <Route path="/recipes/:id" element={<RecipeDetailPage />} />
                    <Route path="/meal-plan" element={<MealPlanPage />} />
                    <Route path="/shopping-list" element={<ShoppingListPage />} />
                    <Route path="/nutrition" element={<NutritionPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                    <Route path="/history" element={<HistoryPage />} />
                </Route>
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <ToastProvider>
                    <AppRoutes />
                </ToastProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
