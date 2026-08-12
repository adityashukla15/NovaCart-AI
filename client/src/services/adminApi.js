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

export const getAdminUsers = () => {
    return api.get("/admin/users");
};


// UPDATE USER ROLE

export const updateUserRole = (
    userId,
    role
) => {
    return api.put(
        `/admin/update-role/${userId}`,
        {
            role,
        }
    );
};


// BLOCK / UNBLOCK USER

export const toggleUserStatus = (
    userId
) => {
    return api.put(
        `/admin/toggle-status/${userId}`
    );
};;


// ======================================
// ORDERS
// ======================================



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

// ======================================
// COUPONS
// ======================================

export const getAdminCoupons = () => {
    return api.get("/admin/coupons/get-all");
};


export const createAdminCoupon = (data) => {
    return api.post("/admin/coupons/create", data);
};


export const updateAdminCoupon = (id, data) => {
    return api.put(`/admin/coupons/update/${id}`, data);
};


export const deleteAdminCoupon = (id) => {
    return api.delete(`/admin/coupons/delete/${id}`);
};


export const toggleAdminCoupon = (id) => {
    return api.patch(`/admin/coupons/${id}/toggle`);
};

export const getAdminOrders = () => {
    return api.get("/admin/orders");
};


// ===============================
// UPDATE ORDER STATUS
// ===============================

export const updateOrderStatus = (orderId, status) => {
    return api.put(
        `/admin/update-order/${orderId}/status`,
        {
            status,
        }
    );
};


// ===============================
// UPDATE PAYMENT STATUS
// ===============================

export const updatePaymentStatus = (
    orderId,
    paymentStatus
) => {
    return api.put(
        `/admin/update-order/${orderId}/payment`,
        {
            paymentStatus,
        }
    );
};