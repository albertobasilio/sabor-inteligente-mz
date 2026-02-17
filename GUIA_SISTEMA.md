# 🇲🇿 Guia do Sistema Sabor Inteligente

Bem-vindo à documentação oficial do **Sabor Inteligente**, o seu assistente inteligente de nutrição e receitas tradicionais moçambicanas.

---

## 📌 1. Visão Geral
O Sabor Inteligente é uma plataforma web que combina a culinária tradicional moçambicana com Inteligência Artificial avançada. O sistema permite que utilizadores identifiquem produtos através de fotografias, gerem receitas personalizadas, planeiem as suas refeições semanais e acompanhem a sua nutrição.

---

## 🏗️ 2. Arquitetura do Sistema

O sistema segue uma arquitetura moderna de aplicação web desacoplada (Client-Server):

### Frontend
- **Framework**: React 18 + Vite.
- **Estilização**: CSS Nativo moderno (Custom Properties).
- **Ícones**: Lucide React & React Icons.
- **Gráficos**: Chart.js (para acompanhamento nutricional).
- **Estado**: Context API (Auth & Toasts).

### Backend
- **Runtime**: Node.js + Express 5.
- **Base de Dados**: MySQL 8.0.
- **Autenticação**: JWT (JSON Web Tokens) & BcryptJS.
- **Gestão de Ficheiros**: Multer & Sharp (processamento de imagem).
- **IA**: Groq SDK (Llama models).

---

## 🤖 3. Integração com Inteligência Artificial

A IA é o motor central da aplicação, utilizando modelos de última geração via Groq:

- **Scan de Produtos**: Utiliza o modelo `llama-4-scout` (vision) para identificar alimentos em fotografias da geleira ou despensa.
- **Geração de Receitas**: Utiliza o modelo `llama-3.3-70b` para criar receitas tradicionais moçambicanas baseadas nos ingredientes disponíveis e no perfil dietético do utilizador.

---

## 📱 4. Funcionalidades Principais

### 📸 AI Product Scanner
Permite tirar uma foto ou carregar uma imagem de produtos. O sistema utiliza o modelo **Llama 4 Scout (multimodal)** do Groq para identificar itens automaticamente, garantindo compatibilidade com os padrões mais recentes de IA. O processamento utiliza o **JSON Mode** nativo para máxima precisão estrutural e um sistema robusto de fallback para garantir uma resposta sempre válida.

### 🍲 Receitas Inteligentes
Gera sugestões de pratos (Ex: Matapa, Caril de Frango, Xiguinha) baseadas no que o utilizador tem em casa, respeitando restrições alimentares (vegano, sem glúten, etc.). O sistema integra **imagens reais de alta qualidade** em todas as interfaces (Dashboard, Lista de Receitas e Detalhes) para uma experiência visual profissional e autêntica.

### 📅 Plano Alimentar & Lista de Compras
Criação de calendários semanais de refeições. A lista de compras é gerada automaticamente com base nos ingredientes em falta para o plano definido.

### 📊 Diário Nutricional
Registo automático de calorias e macros (proteínas, carbohidratos, gorduras) ao consumir receitas, com visualização em gráficos semanais.

---

## 🔌 5. Referência da API (Endpoints)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/register` | Registo de novo utilizador |
| POST | `/api/auth/login` | Login e obtenção de token JWT |
| GET | `/api/auth/profile` | Obter perfil e perfil dietético |
| POST | `/api/ai/analyze` | Analisar imagem (AI Scan) |
| POST | `/api/recipes/generate` | Gerar receitas via IA |
| GET | `/api/recipes` | Listar receitas (com filtros) |
| GET | `/api/meal-plan` | Obter plano alimentar semanal |
| GET | `/api/shopping-list` | Obter lista de compras |
| GET | `/api/nutrition/logs` | Obter registos nutricionais |

---

## 🗄️ 6. Estrutura da Base de Dados

O banco de dados `sabor_inteligente` contém as seguintes tabelas principais:
- `users`: Dados de conta e autenticação.
- `dietary_profiles`: Preferências e restrições alimentares.
- `ingredients`: Catálogo mestre de ingredientes e valores nutricionais.
- `recipes`: Banco de receitas (integra tradicionais e geradas por IA).
- `meal_plans`: Gestão de planos semanais.
- `scan_history`: Histórico de scans realizados.

---

## 🛠️ 7. Instalação e Configuração

### Pré-requisitos
- Node.js v18 ou superior.
- MySQL v8.0.
- Groq API Key.

### Configuração do Ambiente (`.env`)
No diretório `backend/`, crie um ficheiro `.env` com:
```env
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASS=sua_senha
DB_NAME=sabor_inteligente
JWT_SECRET=seu_segredo_jwt
GROQ_API_KEY=sua_chave_groq
```

### Comandos de Início
```bash
# Instalar dependências (fazer no backend/ e frontend/)
npm install

# Iniciar Backend
cd backend
npm run dev

# Iniciar Frontend
cd frontend
npm run dev
```

---

## 📝 8. Convenções de Código
- **Frontend**: Componentes funcionais com Hooks.
- **Backend**: Padrão Controller-Service com `asyncHandler` para erros.
- **Estilo**: Nomes em CamelCase para Javascript e snake_case para Base de Dados.

---
*Desenvolvido para promover a saúde e a cultura gastronómica de Moçambique.*
