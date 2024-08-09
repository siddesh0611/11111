const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expenseSchema = new Schema({
    expenseName: {
        type: String,
        required: true
    },
    expenseAmount: {
        type: Number,
        required: true
    }
});

const orderSchema = new mongoose.Schema({
    paymentid: { type: String, required: true },
    orderid: { type: String, required: true },
    status: { type: String, required: true }
});

const forgotPasswordSchema = new mongoose.Schema({
    id: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    expiresIn: { type: Date, required: true }
});

const fileLinkSchema = new mongoose.Schema({
    fileURL: { type: String, required: true }
});

const userSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    emailId: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isPremium: {
        type: Boolean,
        default: 0
    },
    totalExpense: {
        type: Number,
        default: 0
    },
    expense: [expenseSchema],
    orders: [orderSchema],
    forgotPassword: [forgotPasswordSchema],
    fileLink: [fileLinkSchema]

});

module.exports = mongoose.model('User', userSchema);

