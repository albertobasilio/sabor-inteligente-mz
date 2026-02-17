import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="not-found-page">
            <div className="not-found-content">
                <span className="not-found-emoji">🍽️</span>
                <h1>404</h1>
                <h2>Página não encontrada</h2>
                <p>A página que procura não existe ou foi movida.</p>
                <Link to="/" className="btn-back-home">
                    🏠 Voltar ao Início
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;
