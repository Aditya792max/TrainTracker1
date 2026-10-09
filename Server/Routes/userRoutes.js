const router = require('express').Router();
const controller = require('../Controllers/userController');
const authenticate = require('../Middlewares/auth');

router.use(authenticate);
router.get('/', controller.getUsers);
router.get('/:id', controller.getUser);
router.patch('/:id', controller.updateUser);
router.delete('/:id', controller.deleteUser);

module.exports = router;
