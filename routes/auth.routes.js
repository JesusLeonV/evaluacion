const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/session', authController.checkSession);
router.post('/register', authController.register);

module.exports = router;