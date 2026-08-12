import api from "./axios";


// ======================================
// DASHBOARD
// ======================================

export const getAdminDashboard = () => {
    return api.get("/admin/dashboard");
};


// ======================================
// MONTHLY SALES
// ======================================

export const getMonthlySales = () => {
    return api.get("/admin/monthly-sales");
};


// ======================================
// ORDER ANALYTICS
// ======================================

export const getOrderAnalytics = () => {
    return api.get("/admin/order-analytics");
};


// ======================================
// CATEGORY SALES
// ======================================

export const getCategorySales = () => {
    return api.get("/admin/category-sales");
};


// ======================================
// PRODUCTS
// ======================================

export const getAdminProducts = () => {
    return api.get("/admin/products");
};

// Create Product
export const createAdminProduct = (formData) => {
    return api.post(
        "/products/create-product",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
};

export const updateAdminProduct = (id, formData) => {
    return api.patch(
        `/products/${id}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
};
// Delete Product
export const deleteAdminProduct = (id) => {
    return api.delete(
        `/products/delete-product/${id}`
    );
};

export const toggleFeaturedProduct = (id) => {
    return api.put(`/admin/products/${id}/featured`);
};


export const restoreProduct = (id) => {
    return api.patch(`/admin/products/${id}/restore`);
};


// ======================================
// USERS
// ======================================

export const getAllUsers = () => {
    return api.get("/admin/users");
};


export const updateUserRole = (userId, role) => {
    return api.put(`/admin/update-role/${userId}`, {
        role,
    });
};


export const toggleUserStatus = (userId) => {
    return api.put(`/admin/toggle-status/${userId}`);
};


// ======================================
// ORDERS
// ======================================

export const getAllOrders = () => {
    return api.get("/admin/orders");
};


export const updateOrderStatus = (id, status) => {
    return api.put(`/admin/update-order/${id}/status`, {
        status,
    });
};


// ======================================
// COUPONS
// ======================================

export const createCoupon = (data) => {
    return api.post("/admin/coupons/create", data);
};


export const getAllCoupons = () => {
    return api.get("/admin/coupons/get-all");
};


export const updateCoupon = (id, data) => {
    return api.put(`/admin/coupons/update/${id}`, data);
};


export const deleteCoupon = (id) => {
    return api.delete(`/admin/coupons/delete/${id}`);
};


// ======================================
// RETURNS / REFUNDS
// ======================================

export const updateReturnStatus = (id, returnStatus) => {
    return api.patch(`/admin/orders/${id}/return`, {
        returnStatus,
    });
};


export const processRefund = (id) => {
    return api.patch(`/admin/orders/${id}/refund`);
};

export const getAdminCategories = () => {
    return api.get("/categories");
};

export const createAdminCategory = (data) => {
    return api.post(
        "/categories/create-category",
        data
    );
};

export const updateAdminCategory = (id, data) => {
    return api.patch(
        `/categories/update-category/${id}`,
        data
    );
};

export const deleteAdminCategory = (id) => {
    return api.delete(
        `/categories/delete-category/${id}`
    );
};