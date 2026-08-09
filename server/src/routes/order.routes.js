const express=require('express')

const router=express.Router()


const {createOrder,getMyOrders,getOrderById,updateOrderStatus,deleteOrder,cancelOrder,requestReturn}=require('../controllers/order.controller')
const {applyCoupon}=require('../controllers/coupon.controller')
const authMiddleware=require('../middlewares/auth.middleware.js')


router.post('/create',authMiddleware,createOrder)
router.get('/my-orders',authMiddleware,getMyOrders)
router.get('/:id',authMiddleware,getOrderById)  
router.put('/status/:id',authMiddleware,updateOrderStatus)
router.delete('/:id',authMiddleware,deleteOrder)
router.put('/cancel/:id',authMiddleware,cancelOrder)
router.post('/coupons/apply-coupon',authMiddleware,applyCoupon)
router.post(
    "/:id/return",
    authMiddleware,
    requestReturn
);

module.exports=router