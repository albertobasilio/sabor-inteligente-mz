const db = require('../config/database');
const asyncHandler = require('../middleware/asyncHandler');

// Add recipe to favorites
exports.add = asyncHandler(async (req, res) => {
    const { recipe_id } = req.body;

    // Check if already favorited
    const [existing] = await db.query(
        'SELECT id FROM user_favorites WHERE user_id = ? AND recipe_id = ?',
        [req.user.id, recipe_id]
    );

    if (existing.length > 0) {
        return res.status(400).json({ message: 'Receita já está nos favoritos.' });
    }

    await db.query(
        'INSERT INTO user_favorites (user_id, recipe_id) VALUES (?, ?)',
        [req.user.id, recipe_id]
    );

    res.status(201).json({ message: 'Adicionada aos favoritos! ❤️' });
});

// Remove recipe from favorites
exports.remove = asyncHandler(async (req, res) => {
    await db.query(
        'DELETE FROM user_favorites WHERE user_id = ? AND recipe_id = ?',
        [req.user.id, req.params.recipeId]
    );

    res.json({ message: 'Removida dos favoritos.' });
});

// Get all user favorites
exports.getAll = asyncHandler(async (req, res) => {
    const [rows] = await db.query(
        `SELECT r.*, uf.created_at as favorited_at
       FROM user_favorites uf
       JOIN recipes r ON uf.recipe_id = r.id
       WHERE uf.user_id = ?
       ORDER BY uf.created_at DESC`,
        [req.user.id]
    );

    res.json(rows);
});

// Check if recipe is favorited
exports.check = asyncHandler(async (req, res) => {
    const [rows] = await db.query(
        'SELECT id FROM user_favorites WHERE user_id = ? AND recipe_id = ?',
        [req.user.id, req.params.recipeId]
    );

    res.json({ is_favorite: rows.length > 0 });
});
