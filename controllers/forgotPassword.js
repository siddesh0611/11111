const User = require('../models/user');
const bcrypt = require('bcrypt');
const Sbi = require('sib-api-v3-sdk');
const uuid = require('uuid');


require('dotenv').config()

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { emailId: email } });

        if (user) {
            const id = uuid.v4();
            await user.createForgotPassword({ id, isActive: true });

            const client = Sbi.ApiClient.instance;
            const apiKey = client.authentications['api-key'];
            apiKey.apiKey = process.env.API_KEY;

            const tranEmailApi = new Sbi.TransactionalEmailsApi();

            const sender = {
                email: 'animemhub0611@gmail.com',
            };

            const receiver = [{
                email: email,
            }];

            await tranEmailApi.sendTransacEmail({
                sender,
                to: receiver,
                subject: 'Forgot Password',
                textContent: `You have requested a password reset.`,
                html: `<h1>Click <a href="http://localhost:3000/password/resetpassword/${id}">here</a> to reset your password</h1>`
            });

            return res.status(200).json({ message: 'Password reset email sent' });
        }

        return res.status(404).json({ message: 'User not found' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error in forgotPassword', error: err.message });  // Corrected usage
    }
};

exports.getPassword = async (req, res) => {
    try {
        const id = req.params.id;
        const forgotpasswordRequest = ForgotPassword.findOne({ where: { id } });
        if (forgotpasswordRequest) {
            forgotpasswordrequest.update({ active: false });
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>
                                    <form action="/password/updatepassword/${id}" method="post">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
            )
            res.end()

        }

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

exports.updatePassword = async (erq, res) => {
    const t = seq.transaction();
    try {
        const newPassword = req.query;
        const resetPasswordId = req.params;

        const user = await ForgotPassword.findOne({ where: { id: resetPasswordId } }, { transaction: t });

        if (user) {
            const saltRouts = 5;
            bcrypt.hash(password, saltRouts, async (err, hash) => {
                if (err) {
                    // console.log(err);
                    throw new Error(err);
                }
                await user.update({ password: hash }, { transaction: t });
                await t.commit();
                res.status(200).json({ message: 'User signed up successfully' });

            });
        }

    } catch (err) {
        await t.rollback();
        res.status(500).json({ err });
    }
}


