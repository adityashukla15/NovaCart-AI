const express=require('express')

const authController=require('../controllers/auth.controller')
const authMiddleware=require('../middlewares/auth.middleware')

const router=express.Router()



router.post('/register',authController.register)
router.post('/login',authController.login)
router.post('/logout',authController.logout)
router.get('/me',authMiddleware,authController.me)
router.post('/forgot-password',authController.forgotPassword)
router.post('/verify-otp',authController.verifyForgotPasswordOTP)
router.post('/reset-password',authController.resetPassword)
router.put(
    "/profile",
    authMiddleware,
    authController.updateProfile
);
module.exports=router