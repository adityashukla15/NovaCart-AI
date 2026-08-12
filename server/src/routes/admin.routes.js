const express=require('express')
const authMiddleware=require('../middlewares/auth.middleware')
const router=express.Router()

const adminMiddleware=require('../middlewares/admin.middleware')

const {getDashboard,getMonthlySales,getOrderStatusAnalytics,getCategorySales,getAllUsers,updateUserRole,toggleUserStatus,getAllOrders,updateOrderStatus,getAdminProducts,toggleFeaturedProduct,restoreProduct,updateReturnStatus,processRefund}=require('../controllers/admin.controller')
const {createCoupon,getAllCoupons,updateCoupon,deleteCoupon}=require('../controllers/coupon.controller')


router.get('/dashboard',authMiddleware,adminMiddleware,getDashboard)
router.get('/monthly-sales',authMiddleware,adminMiddleware,getMonthlySales)
router.get('/order-analytics',authMiddleware,adminMiddleware,getOrderStatusAnalytics)
router.get('/category-sales',authMiddleware,adminMiddleware,getCategorySales)
router.get('/users',authMiddleware,adminMiddleware,getAllUsers)
router.put('/update-role/:userId',authMiddleware,adminMiddleware,updateUserRole)
router.put('/toggle-status/:id',authMiddleware,adminMiddleware,toggleUserStatus)
router.get('/orders',authMiddleware,adminMiddleware,getAllOrders)
router.put('/update-order/:id/status',authMiddleware,adminMiddleware,updateOrderStatus)
router.get('/products',authMiddleware,adminMiddleware,getAdminProducts)
router.put('/products/:id/featured',authMiddleware,adminMiddleware,toggleFeaturedProduct)
router.patch('/products/:id/restore',authMiddleware,adminMiddleware,restoreProduct)

router.post('/coupons/create',authMiddleware,adminMiddleware,createCoupon)
router.get('/coupons/get-all',authMiddleware,adminMiddleware,getAllCoupons)
router.put('/coupons/update/:id',authMiddleware,adminMiddleware,updateCoupon)
router.delete('/coupons/delete/:id',authMiddleware,adminMiddleware,deleteCoupon)


router.patch(
    "/orders/:id/return",
    authMiddleware,
    adminMiddleware,
    updateReturnStatus
);

router.patch(
    "/orders/:id/refund",
    authMiddleware,
    adminMiddleware,
    processRefund
);

module.exports=router
