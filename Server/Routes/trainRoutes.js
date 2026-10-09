const router = require('express').Router();
const authenticate = require('../Middlewares/auth');
const controller = require('../Controllers/trainController');

router.get('/:number', authenticate, controller.getTrainDetails);

module.exports = router;
