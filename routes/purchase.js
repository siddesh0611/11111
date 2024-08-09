const express = require('express');

const purchaseControler = require('../controllers/purchase');
const authenticate = require('../autentication/userAutentication');

const router = express.Router();

router.get('/preminummembership', authenticate, purchaseControler.purchasePremium);

router.post('/updatetransactionstatus', authenticate, purchaseControler.updatePremium);


module.exports = router;