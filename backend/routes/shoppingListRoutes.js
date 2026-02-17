const express = require('express');
const router = express.Router();
const shoppingListController = require('../controllers/shoppingListController');
const auth = require('../middleware/auth');

router.post('/', auth, shoppingListController.create);
router.get('/', auth, shoppingListController.getAll);
router.put('/item/:itemId/toggle', auth, shoppingListController.toggleItem);
router.delete('/:id', auth, shoppingListController.delete);
router.post('/generate', auth, shoppingListController.generateFromMealPlan);

module.exports = router;
