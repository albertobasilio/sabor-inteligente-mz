const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/access');
const adminController = require('../controllers/adminController');

router.get('/users', auth, requireRole('admin'), adminController.getUsers);
router.put('/users/:id/access', auth, requireRole('admin'), adminController.updateUserAccess);

module.exports = router;
