import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Home, ScanLine, ChefHat, Heart, History,
    CalendarDays, BarChart3, User, LogOut, ChevronDown, ChevronUp, Menu, X
} from 'lucide-react';
import './Navbar.css';

const navItems = [
    { path: '/', icon: Home, label: 'Início' },
    { path: '/scan', icon: ScanLine, label: 'Escanear' },
    { path: '/recipes', icon: ChefHat, label: 'Receitas' },
    { path: '/favorites', icon: Heart, label: 'Favoritos' },
    { path: '/history', icon: History, label: 'Histórico' },
    { path: '/meal-plan', icon: CalendarDays, label: 'Plano' },
    { path: '/nutrition', icon: BarChart3, label: 'Nutrição' },
];

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getPageTitle = () => {
        const item = navItems.find(n => n.path === location.pathname);
        return item ? item.label : 'Sabor Inteligente';
    };

    return (
        <>
            {/* Desktop Top Bar */}
            <div className="topbar hide-mobile">
                <div className="topbar-left">
                    <h2 className="topbar-title">{getPageTitle()}</h2>
                </div>
                <div className="topbar-right">
                    <div className="topbar-profile" onClick={() => setProfileOpen(!profileOpen)}>
                        <div className="topbar-avatar">
                            {user?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <span className="topbar-name">{user?.name?.split(' ')[0] || 'User'}</span>
                        {profileOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>

                    {profileOpen && (
                        <>
                            <div className="dropdown-overlay" onClick={() => setProfileOpen(false)} />
                            <div className="profile-dropdown animate-dropdown">
                                <div className="dropdown-header">
                                    <div className="dropdown-avatar">{user?.name?.[0]?.toUpperCase() || 'U'}</div>
                                    <div>
                                        <div className="dropdown-name">{user?.name || 'Utilizador'}</div>
                                        <div className="dropdown-email">{user?.email || ''}</div>
                                    </div>
                                </div>
                                <div className="dropdown-divider" />
                                <NavLink to="/profile" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                                    <User size={16} /> Meu Perfil
                                </NavLink>
                                <button className="dropdown-item dropdown-logout" onClick={handleLogout}>
                                    <LogOut size={16} /> Sair
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Mobile top bar */}
            <div className="mobile-topbar show-mobile">
                <button className="hamburger" onClick={() => setMobileOpen(!mobileOpen)}>
                    {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
                <span className="mobile-logo">🇲🇿 Sabor Inteligente</span>
                <NavLink to="/profile" className="mobile-avatar-link">
                    <div className="mobile-avatar">{user?.name?.[0] || 'U'}</div>
                </NavLink>
            </div>

            {/* Sidebar */}
            <nav className={`sidebar ${mobileOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo-container">
                        <span className="logo-flag">🇲🇿</span>
                        <div>
                            <h2 className="logo-text">Sabor</h2>
                            <h2 className="logo-text accent">Inteligente</h2>
                        </div>
                    </div>
                </div>

                <div className="sidebar-nav">
                    {navItems.map(item => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === '/'}
                                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                                onClick={() => setMobileOpen(false)}
                            >
                                <span className="nav-icon"><Icon size={20} /></span>
                                <span className="nav-label">{item.label}</span>
                            </NavLink>
                        );
                    })}
                </div>

                <div className="sidebar-footer">
                    <div className="user-info">
                        <div className="user-avatar">{user?.name?.[0] || 'U'}</div>
                        <div className="user-details">
                            <span className="user-name">{user?.name || 'Utilizador'}</span>
                            <span className="user-plan">{user?.plan === 'premium' ? '⭐ Premium' : 'Gratuito'}</span>
                        </div>
                    </div>
                    <button className="btn-logout" onClick={handleLogout} title="Sair">
                        <LogOut size={18} />
                    </button>
                </div>
            </nav>

            {/* Mobile overlay */}
            {mobileOpen && <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />}

            {/* Mobile bottom nav */}
            <div className="mobile-bottom-nav show-mobile">
                {navItems.slice(0, 5).map(item => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/'}
                            className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
                        >
                            <Icon size={20} />
                            <small>{item.label}</small>
                        </NavLink>
                    );
                })}
            </div>
        </>
    );
};

export default Navbar;
