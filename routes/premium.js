const express = require('express');
const router = express.Router();

const authenticate = require('../autentication/userAutentication');
const premiumController = require('../controllers/premium')

router.get('/showLeaderBoard', authenticate, premiumController.getPremium);
router.get('/report', authenticate, premiumController.report);

module.exports = router;
