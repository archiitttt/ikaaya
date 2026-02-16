const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
require('./Config/db');
const errorHandler = require('./Middlewares/errorHandler');
const authRoute = require('./Routes/auth/authRoute');
const adminRoute = require('./Routes/admin/admin');
const productRoute = require('./Routes/api/productRoute');
const orderRoute = require('./Routes/api/orderRoute');
const userRoute = require('./Routes/api/userRoute');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 8080;
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(cors({
    origin: process.end.CLIENT_URL,
    credentials: true,
  }));
app.use(cookieParser());
app.get("/", (req,res)=>{
    res.send("API Running");
});
app.use('/auth', authRoute);
app.use('/admin', adminRoute);
app.use('/api/products', productRoute);
app.use('/api/orders', orderRoute);
app.use('/api/users', userRoute);


app.use(errorHandler);

app.listen(PORT, ()=>{
    console.log(`Server started at port ${PORT}`);
})