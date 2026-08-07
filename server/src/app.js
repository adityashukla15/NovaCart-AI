const express=require('express')
const cors=require('cors')
const cookieParser=require('cookie-parser')

const app=express()

const errrorHandler=require('./middlewares/errorHandler.js')
const authRoutes=require('../src/routes/auth.routes.js')
const productRoutes=require('../src/routes/product.routes.js')
const categoryRoutes=require('../src/routes/category.routes.js')
const wishlistRoutes=require('../src/routes/wishlist.routes.js')
const cartRoutes=require('../src/routes/cart.routes.js')
const addressRoutes=require('../src/routes/address.routes.js')
const orderRoutes=require('../src/routes/order.routes.js')
const reviewRoutes=require('../src/routes/review.routes.js')
const aiRoutes=require('../src/routes/ai.routes.js')
const adminRoutes=require('./routes/admin.routes.js')

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
app.use('/api/categories',categoryRoutes)
app.use('/api/wishlist',wishlistRoutes)
app.use('/api/cart',cartRoutes)
app.use('/api/address',addressRoutes)
app.use('/api/orders',orderRoutes)
app.use('/api/reviews',reviewRoutes)
app.use('/api/ai',aiRoutes)
app.use('/api/admin',adminRoutes)

app.use(errrorHandler)



module.exports = app;