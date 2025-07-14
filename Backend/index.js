const express=require('express');
const app=express();
require('dotenv').config();
const {connectDb}=require('./db/connect');
const cors=require('cors')

const userRouter=require('./routes/user')

app.use(cors({
  origin: 'http://localhost:5173 ' || 'https://spark-seven-chi.vercel.app/', // your frontend URL
  credentials: true
}));
app.use(express.json());

app.use('/user',userRouter);
// app.get('/addData')
app.use('/app',require('./routes/index'));


const PORT=process.env.PORT||3000
const start=async()=>{
    try {
        await connectDb(process.env.MONGO_URI);;
        app.listen(PORT,()=>{
            console.log(`server is running on port ${PORT}`);
        })

    } catch (error) {
        console.log(`Error connecting to the database: ${error.message}`);
    }
}

start();

