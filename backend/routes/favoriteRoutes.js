const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const auth = require('../middleware/auth');

router.post('/', auth, favoriteController.add);
router.delete('/:recipeId', auth, favoriteController.remove);
router.get('/', auth, favoriteController.getAll);
router.get('/check/:recipeId', auth, favoriteController.check);

module.exports = router;
