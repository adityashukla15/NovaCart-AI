const express=require('express')

const router=express.Router()


const {createOrder,getMyOrders,getOrderById,updateOrderStatus,deleteOrder}=require('../controllers/order.controller')

const authMiddleware=require('../middlewares/auth.middleware.js')


router.post('/create',authMiddleware,createOrder)
router.get('/my-orders',authMiddleware,getMyOrders)
router.get('/:id',authMiddleware,getOrderById)  
router.put('/status/:id',authMiddleware,updateOrderStatus)
router.delete('/:id',authMiddleware,deleteOrder)

module.exports=router