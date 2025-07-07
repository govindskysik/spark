const express=require('express');
const app=express();
require('dotenv').config();
const {connectDb}=require('./db/connect');

const userRouter=require('./routes/user')

app.use(express.json());

app.use('/user',userRouter);
// app.get('/addData')
app.use('/app',require('./routes/index'));


const start=async()=>{
    try {
        await connectDb(process.env.MONGO_URI);;
        app.listen(3000,()=>{
            console.log("server is running on port 3000");
        })

    } catch (error) {
        console.llog(`Error connecting to the database: ${error.message}`);
    }
}

start();

