const express=require('express')

const  router=express.Router()

const authMiddleware=require('../middlewares/auth.middleware')

const {

    addToWishlist,

    getWishlist,

    removeFromWishlist,

    clearWishlist,

} = require("../controllers/wishlist.controller");

router.post(

    "/addtowishlist/:productId",

    authMiddleware,

    addToWishlist

);

router.get(

    "/all-wishlist",

    authMiddleware,

    getWishlist

);

router.delete(

    "/delete-wishlist/:productId",

    authMiddleware,

    removeFromWishlist

);

router.delete(

    "/delete-all-wishlist",

    authMiddleware,

    clearWishlist

);

module.exports = router;