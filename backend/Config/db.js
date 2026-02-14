const mongoose = require('mongoose');
const mongoURL = process.env.MONGO_CONN;

mongoose.connect(mongoURL)
.then(()=>{
    console.log('Connected to database sucessfully');
})
.catch((err)=>{
    console.log('Failed to connect to database: ',err);
})