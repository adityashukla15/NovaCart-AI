const express=require('express')
const cors=require('cors')
const cookieParser=require('cookie-parser')

const app=express()

const errrorHandler=require('./middlewares/errorHandler.js')
const authRoutes=require('../src/routes/auth.routes.js')
const productRoutes=require('../src/routes/product.routes.js')
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser())

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "NovaCart AI Backend Running 🚀",
    });
});

app.use('/api/auth',authRoutes)
app.use('/api/products',productRoutes)

app.use(errrorHandler)



module.exports = app;