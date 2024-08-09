//imp requires
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');

//importing database
const mongoose = require('mongoose');
const User = require('./models/user');
// const Expense = require('./models/expense');
// const Order = require('./models/orders');
// const ForgotPassword = require('./models/forgotPassword');

//routes for user
const userLogin = require('./routes/user');
const userExpence = require('./routes/expense');
// const purchaseRoute = require('./routes/purchase');
// const premiunRoute = require('./routes/premium');
// const forgotpasswordRoute = require('./routes/forgotPassword');

// const { default: orders } = require('razorpay/dist/types/orders');

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('combined', { stream: accessLogStream }));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


// app.use('/password', forgotpasswordRoute);
// app.use('/premium', premiunRoute);
// app.use('/purchase', purchaseRoute);
app.use('/user', userLogin);
app.use('/user', userExpence);

mongoose.connect('mongodb+srv://siddesh:AxdfMslSyIpgBlKr@cluster0.9f5ry.mongodb.net/expense?retryWrites=true&w=majority&appName=Cluster0')
    .then(result => {
        console.log('connected');
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    })

