const Razorpay = require('razorpay');
const Order = require('../models/orders');
const User = require('../models/user');
require('dotenv').config();

// function generateAccessToken(id, name, ispremiumuser) {
//     return jwt.sign({ userId: id, name: name, ispremiumuser: ispremiumuser }, process.env.TOKEN)

// }

exports.purchasePremium = async (req, res) => {
    try {
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        const amount = 2500;

        await rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
            if (err) {
                console.log(err);
            }
            req.user.createOrder({ orderid: order.id, status: 'PENDING' }).then(() => {
                return res.status(201).json({ order, key_id: rzp.key_id });
            }).catch((err) => console.log(err));

        });


    } catch (err) {
        console.error('Error in purchasePremium:', err);
        res.status(403).json({ message: 'Something went wrong', error: err.message });
    }
};
// exports.updatePremium = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const { payment_id, order_id } = req.body;

//         if (!payment_id || !order_id) {
//             throw new Error("Payment ID or Order ID not provided in the request body.");
//         }

//         const order = await Order.findOne({ where: { orderid: order_id } });

//         if (!order) {
//             throw new Error("Order not found.");
//         }

//         await order.update({ payment_id: payment_id, status: 'SUCCESSFUL' });

//         await req.user.update({ ispremiumuser: true }).then(() => {
//             return res.status(202).json({
//                 success: true, message: "Transaction Successful"
//             })
//         }).catch((err) => {
//             throw new Error(err);
//         })

//         return res.status(202).json({ success: true, message: "Transaction Successful" });
//     } catch (err) {
//         console.error('Error in updatePremium:', err);
//         res.status(400).json({ success: false, message: "Error processing request", error: err.message });
//     }
// };
exports.updatePremium = async (req, res) => {
    try {
        const userId = req.user.id;
        const { payment_id, order_id } = req.body;

        if (!payment_id || !order_id) {
            return res.status(400).json({ success: false, message: "Payment ID or Order ID not provided in the request body." });
        }

        const order = await Order.findOne({ where: { orderid: order_id } });

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found." });
        }

        await order.update({ payment_id: payment_id, status: 'SUCCESSFUL' });

        try {
            await req.user.update({ ispremiumuser: true });
            return res.status(202).json({ success: true, message: "Transaction Successful" });
        } catch (updateError) {
            console.error('Error updating user:', updateError);
            return res.status(500).json({ success: false, message: "Error updating user information.", error: updateError.message });
        }
    } catch (err) {
        console.error('Error in updatePremium:', err);
        return res.status(400).json({ success: false, message: "Error processing request", error: err.message });
    }
};
