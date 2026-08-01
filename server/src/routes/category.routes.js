const express=require('express')

const router=express.Router()

const {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
} = require("../controllers/category.controller");

const authMiddleware = require('../middlewares/auth.middleware')
const adminMiddleware = require("../middlewares/admin.middleware");

router.get("/", getAllCategories);
router.get("/:id", getCategoryById);

router.post(
    "/create-category",
    authMiddleware,
    adminMiddleware,
    createCategory
);

router.patch(
    "/update-category/:id",
    authMiddleware,
    adminMiddleware,
    updateCategory
);

router.delete(
    "/delete-category/:id",
    authMiddleware,
    adminMiddleware,
    deleteCategory
);

module.exports = router;