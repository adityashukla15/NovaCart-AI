const express=require('express')

const router=express.Router()


const {addToCart,getCart,updateCartQuantity,removeFromCart,clearCart}=require('../controllers/cart.controller.js')
const authMiddleware=require('../middlewares/auth.middleware.js')

router.post('/add/:productId',authMiddleware,addToCart)
router.get('/get-cart',authMiddleware,getCart)
router.put('/update/:productId',authMiddleware,updateCartQuantity)
router.delete('/remove/:productId',authMiddleware,removeFromCart)
router.delete('/clear',authMiddleware,clearCart)




module.exports=router