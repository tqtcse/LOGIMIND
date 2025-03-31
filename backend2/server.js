const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const packagesRoutes = require('./routes/packagesRoutes')
const accountRoutes = require('./routes/accountRoutes')
const fileRoutes = require('./routes/fileRoutes')
const imgRoutes = require('./routes/imageRoutes')
const paymentRoutes = require('./routes/paymentRoutes')
const modelRoutes = require('./routes/modelRoutes')


require('./services/websocketService');

const { SERVER_PORT } = require('./config/env');


const app = express();
app.use(cors());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/order', orderRoutes);
app.use('/packages', packagesRoutes)
app.use('/account', accountRoutes)
app.use('/file', fileRoutes)
app.use('/image', imgRoutes)
app.use('/payment', paymentRoutes)
app.use('/model', modelRoutes)


app.listen(SERVER_PORT, () => {
    console.log(`Server chạy trên cổng ${SERVER_PORT}`);
});