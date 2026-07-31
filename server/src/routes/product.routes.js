const express=require('express')

const router=express.Router()

const authMiddleware=require('../middlewares/auth.middleware')
const adminMiddleware=require('../middlewares/admin.middleware')

const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} = require("../controllers/product.controller");

router.post(
    "/create-product",
    authMiddleware,
    adminMiddleware,
    createProduct
);

router.get("/get-products", getAllProducts);

router.get("/:id", getProductById);

router.patch(
    "/:id",
    authMiddleware,
    adminMiddleware,
    updateProduct
);

router.delete(
    "/delete-product/:id",
    authMiddleware,
    adminMiddleware,
    deleteProduct
);

module.exports = router;