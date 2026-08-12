import api from "./axios";

// ======================================
// GET ALL CATEGORIES
// ======================================

export const getAllCategories = () => {
    return api.get("/categories");
};


// ======================================
// GET CATEGORY BY ID
// ======================================

export const getCategoryById = (id) => {
    return api.get(`/categories/${id}`);
};


// ======================================
// CREATE CATEGORY
// ======================================

export const createCategory = (data) => {
    return api.post(
        "/categories/create-category",
        data
    );
};


// ======================================
// UPDATE CATEGORY
// ======================================

export const updateCategory = (id, data) => {
    return api.patch(
        `/categories/update-category/${id}`,
        data
    );
};


// ======================================
// DELETE CATEGORY
// ======================================

export const deleteCategory = (id) => {
    return api.delete(
        `/categories/delete-category/${id}`
    );
};