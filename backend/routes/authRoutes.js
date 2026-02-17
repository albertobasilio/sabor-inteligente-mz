const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const { validateRegister, validateLogin, validateProfile } = require('../middleware/validate');

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.get('/profile', auth, authController.getProfile);
router.put('/profile', auth, validateProfile, authController.updateProfile);
router.put('/dietary-profile', auth, authController.updateDietaryProfile);

module.exports = router;
