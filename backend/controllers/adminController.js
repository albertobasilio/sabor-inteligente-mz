const db = require('../config/database');
const asyncHandler = require('../middleware/asyncHandler');
const { AppError } = require('../middleware/errorHandler');
const { PLAN_ORDER } = require('../config/accessLevels');

const VALID_ROLES = ['user', 'admin'];

exports.getUsers = asyncHandler(async (req, res) => {
    const [users] = await db.query(
        `SELECT id, name, email, phone, region, plan, role, scan_count, last_scan_date, created_at
         FROM users
         ORDER BY created_at DESC`
    );

    res.json(users);
});

exports.updateUserAccess = asyncHandler(async (req, res) => {
    const { plan, role } = req.body;
    const userId = Number(req.params.id);

    if (!userId) {
        throw new AppError('ID de utilizador invalido.', 400);
    }

    if (plan && !PLAN_ORDER.includes(plan)) {
        throw new AppError('Plano invalido.', 400);
    }

    if (role && !VALID_ROLES.includes(role)) {
        throw new AppError('Role invalida.', 400);
    }

    const [existing] = await db.query('SELECT id, role FROM users WHERE id = ? LIMIT 1', [userId]);
    if (existing.length === 0) {
        throw new AppError('Utilizador nao encontrado.', 404);
    }

    const fields = [];
    const params = [];

    if (plan) {
        fields.push('plan = ?');
        params.push(plan);
    }
    if (role) {
        fields.push('role = ?');
        params.push(role);
    }

    if (fields.length === 0) {
        throw new AppError('Nada para atualizar.', 400);
    }

    params.push(userId);
    await db.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, params);

    const [updated] = await db.query(
        'SELECT id, name, email, plan, role, created_at FROM users WHERE id = ? LIMIT 1',
        [userId]
    );

    res.json({
        message: 'Acesso do utilizador atualizado com sucesso.',
        user: updated[0]
    });
});
