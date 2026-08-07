const express=require('express')
const authMiddleware=require('../middlewares/auth.middleware')
const router=express.Router()

const adminMiddleware=require('../middlewares/admin.middleware')

const {getDashboard,getMonthlySales,getOrderStatusAnalytics,getCategorySales,getAllUsers,updateUserRole,toggleUserStatus,getAllOrders,updateOrderStatus,getAdminProducts,toggleFeaturedProduct,restoreProduct}=require('../controllers/admin.controller')


router.get('/dashboard',authMiddleware,adminMiddleware,getDashboard)
router.get('/monthly-sales',authMiddleware,adminMiddleware,getMonthlySales)
router.get('/order-analytics',authMiddleware,adminMiddleware,getOrderStatusAnalytics)
router.get('/category-sales',authMiddleware,adminMiddleware,getCategorySales)
router.get('/users',authMiddleware,adminMiddleware,getAllUsers)
router.put('/update-role/:userId',authMiddleware,adminMiddleware,updateUserRole)
router.put('/toggle-status/:userId',authMiddleware,adminMiddleware,toggleUserStatus)
router.get('/orders',authMiddleware,adminMiddleware,getAllOrders)
router.put('/update-order/:id/status',authMiddleware,adminMiddleware,updateOrderStatus)
router.get('/products',authMiddleware,adminMiddleware,getAdminProducts)
router.put('/products/:id/featured',authMiddleware,adminMiddleware,toggleFeaturedProduct)
router.patch('/products/:id/restore',authMiddleware,adminMiddleware,restoreProduct)

module.exports=router
