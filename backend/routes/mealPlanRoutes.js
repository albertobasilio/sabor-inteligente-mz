const express = require('express');
const router = express.Router();
const mealPlanController = require('../controllers/mealPlanController');
const auth = require('../middleware/auth');
const { validateMealPlan } = require('../middleware/validate');

router.post('/', auth, validateMealPlan, mealPlanController.create);
router.get('/', auth, mealPlanController.getAll);
router.get('/:id', auth, mealPlanController.getById);
router.delete('/:id', auth, mealPlanController.delete);

module.exports = router;
