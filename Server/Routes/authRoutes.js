const router = require('express').Router();
const controller = require('../Controllers/authController');
const authenticate = require('../Middlewares/auth');

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/me', authenticate, controller.me);

module.exports = router;
