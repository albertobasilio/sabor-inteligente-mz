const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const asyncHandler = require('../middleware/asyncHandler');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');
require('dotenv').config();

// Register
exports.register = asyncHandler(async (req, res) => {
    const { name, email, password, phone, region } = req.body;

    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
        throw new AppError('Este email já está registado.', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
        'INSERT INTO users (name, email, password, phone, region) VALUES (?, ?, ?, ?, ?)',
        [name, email, hashedPassword, phone || null, region || 'Maputo']
    );

    // Create default dietary profile
    await db.query('INSERT INTO dietary_profiles (user_id) VALUES (?)', [result.insertId]);

    const token = jwt.sign(
        { id: result.insertId, email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    logger.info(`Novo utilizador registado: ${email}`);

    res.status(201).json({
        message: 'Conta criada com sucesso!',
        token,
        user: { id: result.insertId, name, email, region: region || 'Maputo' }
    });
});

// Login
exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
        throw new AppError('Email ou senha incorretos.', 401);
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new AppError('Email ou senha incorretos.', 401);
    }

    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    logger.info(`Login: ${email}`);

    res.json({
        message: 'Login bem-sucedido!',
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            region: user.region,
            plan: user.plan
        }
    });
});

// Get profile
exports.getProfile = asyncHandler(async (req, res) => {
    const [users] = await db.query(
        'SELECT id, name, email, phone, region, plan, created_at FROM users WHERE id = ?',
        [req.user.id]
    );
    if (users.length === 0) {
        throw new AppError('Utilizador não encontrado.', 404);
    }

    const [dietary] = await db.query(
        'SELECT * FROM dietary_profiles WHERE user_id = ?',
        [req.user.id]
    );

    res.json({ user: users[0], dietaryProfile: dietary[0] || null });
});

// Update profile
exports.updateProfile = asyncHandler(async (req, res) => {
    const { name, phone, region } = req.body;

    await db.query(
        'UPDATE users SET name = ?, phone = ?, region = ? WHERE id = ?',
        [name, phone, region, req.user.id]
    );

    res.json({ message: 'Perfil atualizado com sucesso!' });
});

// Update dietary profile
exports.updateDietaryProfile = asyncHandler(async (req, res) => {
    const {
        gluten_free, vegan, vegetarian, low_sugar,
        diabetic, child_diet, athlete, elderly, pregnant, allergies, notes
    } = req.body;

    const [existing] = await db.query('SELECT id FROM dietary_profiles WHERE user_id = ?', [req.user.id]);

    if (existing.length > 0) {
        await db.query(
            `UPDATE dietary_profiles SET 
         gluten_free=?, vegan=?, vegetarian=?, low_sugar=?, diabetic=?,
         child_diet=?, athlete=?, elderly=?, pregnant=?, allergies=?, notes=?
         WHERE user_id=?`,
            [gluten_free, vegan, vegetarian, low_sugar, diabetic,
                child_diet, athlete, elderly, pregnant, allergies, notes, req.user.id]
        );
    } else {
        await db.query(
            `INSERT INTO dietary_profiles 
         (user_id, gluten_free, vegan, vegetarian, low_sugar, diabetic, child_diet, athlete, elderly, pregnant, allergies, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [req.user.id, gluten_free, vegan, vegetarian, low_sugar, diabetic,
                child_diet, athlete, elderly, pregnant, allergies, notes]
        );
    }

    res.json({ message: 'Perfil alimentar atualizado com sucesso!' });
});
