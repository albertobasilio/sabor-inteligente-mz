# 🇲🇿 Sabor Inteligente MZ

Sistema inteligente de nutrição e receitas moçambicanas com IA.

## 📋 Funcionalidades

- 📸 **Scan de Ingredientes** — Fotografe os seus ingredientes e a IA identifica-os
- 🍲 **Receitas com IA** — Gera receitas tradicionais moçambicanas com o que tem disponível
- 📅 **Plano Alimentar** — Organize as refeições da semana
- 🛒 **Lista de Compras** — Gerada automaticamente a partir do plano alimentar
- 📊 **Acompanhamento Nutricional** — Registre e acompanhe a sua nutrição diária
- ❤️ **Favoritos** — Guarde as suas receitas preferidas
- 📤 **Partilha** — Partilhe receitas via WhatsApp

## 🛠️ Tecnologias

| Camada    | Tecnologia              |
|-----------|-------------------------|
| Frontend  | React 18 + Vite         |
| Backend   | Node.js + Express 5     |
| Base de Dados | MySQL 8 (utf8mb4)   |
| IA        | Groq (Llama)            |
| Deploy    | Docker + Docker Compose |

## 🚀 Setup Rápido

### Pré-requisitos
- Node.js 18+
- MySQL 8+
- Chave API do [Groq](https://console.groq.com/)

### 1. Clonar e instalar

```bash
git clone <url-do-repositorio>
cd sabor-inteligente

# Backend
cd backend
cp .env.example .env   # Editar com as suas credenciais
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configurar `.env`

Edite `backend/.env` com:
- Credenciais do MySQL
- JWT_SECRET (gerar com: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`)
- GROQ_API_KEY

### 3. Criar base de dados

```bash
mysql -u root -p < database/schema.sql
```

### 4. Iniciar

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

O frontend estará em `http://localhost:5173` e a API em `http://localhost:5000`.

## 🐳 Docker

```bash
# Configurar environment
export GROQ_API_KEY=sua_chave_aqui
export JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")

# Iniciar
docker-compose up -d

# Verificar
curl http://localhost:5000/api/health
```

## 📁 Estrutura

```
sabor-inteligente/
├── backend/
│   ├── config/          # Conexão com MySQL
│   ├── controllers/     # Lógica dos endpoints
│   ├── middleware/       # Auth, validação, error handler
│   ├── routes/          # Definição de rotas
│   ├── services/        # Serviço de IA (Groq)
│   ├── utils/           # Logger (Winston)
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Navbar, Layout, Toast
│   │   ├── context/     # Auth + Toast providers
│   │   ├── pages/       # Páginas da aplicação
│   │   └── services/    # API client (Axios)
│   └── index.html
├── database/
│   └── schema.sql       # Schema + seed data
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## 📄 Licença

Projecto privado.
