const express = require('express');
const router = express.Router();
const ingredientController = require('../controllers/ingredientController');
const auth = require('../middleware/auth');

// Static routes MUST come before parameterized routes
router.get('/history/scans', auth, ingredientController.getScanHistory);
router.post('/scan', auth, ingredientController.saveScanResults);
router.get('/', ingredientController.getAll);
router.get('/:id', ingredientController.getById);

module.exports = router;
