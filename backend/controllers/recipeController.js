const db = require('../config/database');
const aiService = require('../services/aiService');
const asyncHandler = require('../middleware/asyncHandler');
const { AppError } = require('../middleware/errorHandler');

// Get all recipes with optional filters (improved with advanced search)
exports.getAll = asyncHandler(async (req, res) => {
    const { region, difficulty, search, tags, max_time, max_calories, max_cost } = req.query;
    let query = 'SELECT * FROM recipes';
    const params = [];
    const conditions = [];

    if (region) {
        conditions.push('region = ?');
        params.push(region);
    }
    if (difficulty) {
        conditions.push('difficulty = ?');
        params.push(difficulty);
    }
    if (search) {
        conditions.push('(title LIKE ? OR description LIKE ?)');
        params.push(`%${search}%`, `%${search}%`);
    }
    if (max_time) {
        conditions.push('(prep_time_min + cook_time_min) <= ?');
        params.push(parseInt(max_time));
    }
    if (max_calories) {
        conditions.push('calories <= ?');
        params.push(parseFloat(max_calories));
    }
    if (max_cost) {
        conditions.push('estimated_cost_mt <= ?');
        params.push(parseFloat(max_cost));
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';
    const [rows] = await db.query(query, params);
    res.json(rows);
});

// Get recipe by ID with ingredients
exports.getById = asyncHandler(async (req, res) => {
    const [recipes] = await db.query('SELECT * FROM recipes WHERE id = ?', [req.params.id]);
    if (recipes.length === 0) {
        throw new AppError('Receita não encontrada.', 404);
    }

    const [ingredients] = await db.query(
        `SELECT ri.*, i.emoji, i.calories_per_100g 
       FROM recipe_ingredients ri 
       LEFT JOIN ingredients i ON ri.ingredient_id = i.id 
       WHERE ri.recipe_id = ?`,
        [req.params.id]
    );

    res.json({ ...recipes[0], ingredients });
});

// Get PUBLIC recipe by ID (for sharing - no auth required)
exports.getPublicById = asyncHandler(async (req, res) => {
    const [recipes] = await db.query(
        'SELECT id, title, description, instructions, prep_time_min, cook_time_min, servings, difficulty, region, calories, protein, carbs, fat, fiber, iron, image_url, tags FROM recipes WHERE id = ?',
        [req.params.id]
    );
    if (recipes.length === 0) {
        throw new AppError('Receita não encontrada.', 404);
    }

    const [ingredients] = await db.query(
        `SELECT ri.ingredient_name, ri.quantity, ri.unit, ri.is_optional, i.emoji
       FROM recipe_ingredients ri 
       LEFT JOIN ingredients i ON ri.ingredient_id = i.id 
       WHERE ri.recipe_id = ?`,
        [req.params.id]
    );

    res.json({ ...recipes[0], ingredients });
});

// Generate recipes from ingredients using AI
exports.generateFromIngredients = asyncHandler(async (req, res) => {
    const { ingredients, dietary_profile } = req.body;

    if (!ingredients || ingredients.length === 0) {
        throw new AppError('Forneça pelo menos um ingrediente.', 400);
    }

    const recipes = await aiService.generateRecipes(ingredients, dietary_profile);

    res.json({
        message: 'Receitas geradas com sucesso!',
        recipes
    });
});

// Get recipes matching user's available ingredients
exports.getMatchingRecipes = asyncHandler(async (req, res) => {
    const { ingredientIds } = req.body;

    if (!ingredientIds || ingredientIds.length === 0) {
        throw new AppError('Forneça ingredientes.', 400);
    }

    const placeholders = ingredientIds.map(() => '?').join(',');

    const [rows] = await db.query(
        `SELECT r.*, COUNT(ri.id) as matched_ingredients,
       (SELECT COUNT(*) FROM recipe_ingredients WHERE recipe_id = r.id) as total_ingredients
       FROM recipes r
       JOIN recipe_ingredients ri ON r.id = ri.recipe_id
       WHERE ri.ingredient_id IN (${placeholders})
       GROUP BY r.id
       ORDER BY matched_ingredients DESC
       LIMIT 10`,
        ingredientIds
    );

    res.json(rows);
});

// Save AI generated recipe to database (batch insert for ingredients)
exports.saveRecipe = asyncHandler(async (req, res) => {
    const {
        title, description, instructions, prep_time_min, cook_time_min,
        servings, difficulty, region, estimated_cost_mt, calories,
        protein, carbs, fat, fiber, iron, tags, ingredients
    } = req.body;

    const [result] = await db.query(
        `INSERT INTO recipes (title, description, instructions, prep_time_min, cook_time_min,
       servings, difficulty, region, estimated_cost_mt, is_ai_generated, calories,
       protein, carbs, fat, fiber, iron, tags) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE, ?, ?, ?, ?, ?, ?, ?)`,
        [title, description, instructions, prep_time_min, cook_time_min,
            servings, difficulty, region, estimated_cost_mt, calories,
            protein, carbs, fat, fiber, iron, JSON.stringify(tags)]
    );

    // Batch insert recipe ingredients
    if (ingredients && ingredients.length > 0) {
        const values = ingredients.map(ing => [
            result.insertId, ing.name, ing.quantity, ing.unit, ing.is_optional || false, ing.substitute || null
        ]);
        const placeholders = values.map(() => '(?, ?, ?, ?, ?, ?)').join(', ');
        const flat = values.flat();

        await db.query(
            `INSERT INTO recipe_ingredients (recipe_id, ingredient_name, quantity, unit, is_optional, substitute)
           VALUES ${placeholders}`,
            flat
        );
    }

    res.status(201).json({ message: 'Receita guardada!', recipeId: result.insertId });
});
