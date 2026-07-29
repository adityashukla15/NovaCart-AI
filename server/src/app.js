const express=require('express')
const cors=require('cors')
const cookieParser=require('cookie-parser')

const app=express()

const errrorHandler=require('./middlewares/errorHandler.js')
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser())
app.use(errrorHandler)

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "NovaCart AI Backend Running 🚀",
    });
});

module.exports = app;