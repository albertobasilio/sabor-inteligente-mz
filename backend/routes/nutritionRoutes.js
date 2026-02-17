const express = require('express');
const router = express.Router();
const nutritionController = require('../controllers/nutritionController');
const auth = require('../middleware/auth');
const { validateNutritionLog } = require('../middleware/validate');

router.post('/log', auth, validateNutritionLog, nutritionController.logMeal);
router.get('/daily', auth, nutritionController.getDailySummary);
router.get('/weekly', auth, nutritionController.getWeeklySummary);
router.get('/tips', auth, nutritionController.getTips);

module.exports = router;
