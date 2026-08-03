const express=require('express')

const router=express.Router()
const { createAddress,  getAllAddresses, getAddressById,updateAddress,deleteAddress,setDefaultAddress} = require('../controllers/address.controller.js')
const authMiddleware=require('../middlewares/auth.middleware.js')

router.post('/add',authMiddleware,createAddress)
router.get('/get-addresses',authMiddleware,getAllAddresses)
router.get('/get-address/:id',authMiddleware,getAddressById)
router.patch('/update/:id',authMiddleware,updateAddress)
router.delete('/delete/:id',authMiddleware,deleteAddress)
router.put('/set-default/:id',authMiddleware,setDefaultAddress)


module.exports=router