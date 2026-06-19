const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const dbReady = require('./Config/db');
const errorHandler = require('./Middlewares/errorHandler');
const authRoute = require('./Routes/auth/authRoute');
const adminRoute = require('./Routes/admin/admin');
const productRoute = require('./Routes/api/productRoute');
const orderRoute = require('./Routes/api/orderRoute');
const userRoute = require('./Routes/api/userRoute');
const cartRoute = require('./Routes/api/cartRoute');
const categoryRoute = require('./Routes/admin/categoryRoute');
const cookieParser = require('cookie-parser');
const Category = require('./Models/categoryModel');
const { DEFAULT_CATEGORIES } = require('./Utils/categoryConstants');

const PORT = process.env.PORT || 8080;

// Initialize default categories after DB is connected
const initializeCategories = async () => {
  try {
    await dbReady;
    const categoriesCount = await Category.countDocuments();
    
    // Only seed categories if the collection is empty
    if (categoriesCount === 0) {
      await Category.insertMany(DEFAULT_CATEGORIES);
      console.log('Default categories initialized successfully');
    }
  } catch (error) {
    console.error('Error initializing categories:', error);
  }
};

// Call initialization function
initializeCategories();

app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }));
app.use(cookieParser());
app.get("/", (req,res)=>{
    res.send("API Running");
});
app.use('/auth', authRoute);
app.use('/admin', adminRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/products', productRoute);
app.use('/api/orders', orderRoute);
app.use('/api/users', userRoute);
app.use('/api/cart', cartRoute);


app.use(errorHandler);

app.listen(PORT, ()=>{
    console.log(`Server started at port ${PORT}`);
})