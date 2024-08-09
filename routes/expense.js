const express = require('express');

const userExpenceControler = require('../controllers/expense');
const authenticate = require('../autentication/userAutentication');

const router = express.Router();

router.post('/expense', authenticate, userExpenceControler.postExpense);

router.get('/expenses', authenticate, userExpenceControler.getExpense);

router.delete('/expense/:id', authenticate, userExpenceControler.deleteExpense);

module.exports = router;
