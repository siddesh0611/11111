const express = require('express');

const userControler = require('../controllers/user');

const router = express.Router();
const authenticate = require('../autentication/userAutentication');

router.get('/checkPremium', authenticate, userControler.checkPremiumStatus);
router.post('/login', userControler.login);
router.post('/signup', userControler.signup);
router.get('/report', authenticate, userControler.downloadExpense);

module.exports = router;

