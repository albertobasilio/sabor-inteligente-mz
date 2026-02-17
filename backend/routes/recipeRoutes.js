const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const auth = require('../middleware/auth');
const { validateRecipeGenerate } = require('../middleware/validate');

router.get('/', recipeController.getAll);
router.get('/public/:id', recipeController.getPublicById);
router.get('/:id', recipeController.getById);
router.post('/generate', auth, validateRecipeGenerate, recipeController.generateFromIngredients);
router.post('/match', auth, recipeController.getMatchingRecipes);
router.post('/save', auth, recipeController.saveRecipe);

module.exports = router;
