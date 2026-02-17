import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth
export const authService = {
    login: (data) => api.post('/auth/login', data),
    register: (data) => api.post('/auth/register', data),
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (data) => api.put('/auth/profile', data),
    updateDietaryProfile: (data) => api.put('/auth/dietary-profile', data),
};

// Ingredients
export const ingredientService = {
    getAll: (params) => api.get('/ingredients', { params }),
    getById: (id) => api.get(`/ingredients/${id}`),
    saveScan: (data) => api.post('/ingredients/scan', data),
    getScanHistory: () => api.get('/ingredients/history/scans'),
};

// Recipes
export const recipeService = {
    getAll: (params) => api.get('/recipes', { params }),
    getById: (id) => api.get(`/recipes/${id}`),
    getPublic: (id) => api.get(`/recipes/public/${id}`),
    generate: (data) => api.post('/recipes/generate', data),
    match: (data) => api.post('/recipes/match', data),
    save: (data) => api.post('/recipes/save', data),
};

// Meal Plans
export const mealPlanService = {
    getAll: () => api.get('/meal-plans'),
    getById: (id) => api.get(`/meal-plans/${id}`),
    create: (data) => api.post('/meal-plans', data),
    delete: (id) => api.delete(`/meal-plans/${id}`),
};

// Shopping Lists
export const shoppingListService = {
    getAll: () => api.get('/shopping-lists'),
    create: (data) => api.post('/shopping-lists', data),
    toggleItem: (itemId) => api.put(`/shopping-lists/item/${itemId}/toggle`),
    delete: (id) => api.delete(`/shopping-lists/${id}`),
    generate: (data) => api.post('/shopping-lists/generate', data),
};

// Nutrition
export const nutritionService = {
    logMeal: (data) => api.post('/nutrition/log', data),
    getDaily: (date) => api.get('/nutrition/daily', { params: { date } }),
    getWeekly: () => api.get('/nutrition/weekly'),
    getTips: () => api.get('/nutrition/tips'),
};

// AI
export const aiService = {
    analyzeImage: (formData) => api.post('/ai/analyze-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    analyzeImageBase64: (image) => api.post('/ai/analyze-image', { image }),
    generateRecipes: (data) => api.post('/ai/generate-recipes', data),
};

// Favorites
export const favoriteService = {
    getAll: () => api.get('/favorites'),
    add: (recipeId) => api.post('/favorites', { recipe_id: recipeId }),
    remove: (recipeId) => api.delete(`/favorites/${recipeId}`),
    check: (recipeId) => api.get(`/favorites/check/${recipeId}`),
};

export default api;
