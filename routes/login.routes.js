const express = require('express');
const router = express.Router();

const loginController = require('../controllers/login.controller');

router.post('/login', loginController.login);
router.get('/verify', loginController.verify);
router.get('/getusers', loginController.getUsers);

module.exports = router;