const User = require('../models/user');
const mongoose = require('mongoose');


exports.postExpense = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { expenseName, expenseAmount } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId).session(session);

        const totalExpense = Number(expenseAmount) + Number(req.user.totalExpense)
        const newExpense = { expenseName, expenseAmount };
        user.expense.push(newExpense);
        user.totalExpense = totalExpense;

        await user.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ newExpense });

    } catch (err) {
        console.log('transaction failed', err)
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ error: err.message });
    }
};
exports.getExpense = async (req, res) => {
    try {
        const page = +req.query.page || 1;
        const NUMBER_OF_EXPENSE_PER_PAGE = +req.query.rows || 2;

        const userId = req.user._id;
        const user = await User.findById(userId);

        const expenses = user.expense
            .slice((page - 1) * NUMBER_OF_EXPENSE_PER_PAGE,
                page * NUMBER_OF_EXPENSE_PER_PAGE);

        const totalItems = user.expense.length;
        const pagination = {
            currentPage: page,
            hasNextPage: NUMBER_OF_EXPENSE_PER_PAGE * page < totalItems,
            nextPage: page + 1,
            hasPrevPage: page > 1,
            prevPage: page - 1,
            lastPage: Math.ceil(totalItems / NUMBER_OF_EXPENSE_PER_PAGE),
        };

        res.status(200).json({ expenses, pagination, success: true });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error inside getExpense', err, success: false });
    }
};


exports.deleteExpense = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const expenseId = req.params.id;
        const userId = req.user._id;

        const user = await User.findById(userId).session(session);
        if (!user) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'User not found' });
        }

        const expenseIndex = user.expense.findIndex(exp => exp._id.toString() === expenseId);
        if (expenseIndex === -1) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Expense not found' });
        }

        const expenseAmount = user.expense[expenseIndex].expenseAmount;

        user.expense.splice(expenseIndex, 1);

        user.totalExpense = (user.totalExpense || 0) - expenseAmount;

        await user.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(204).json({ message: 'Expense deleted' });

    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ error: err.message });
    }
};