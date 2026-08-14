import api from "./axios";

// Create order
export const createOrder = (data = {}) => {
    return api.post("/orders/create", data);
};

// Get my orders
export const getMyOrders = () => {
    return api.get("/orders/my-orders");
};

// Get single order
export const getOrderById = (id) => {
    return api.get(`/orders/${id}`);
};

// Cancel order
export const cancelOrder = (id) => {
    return api.put(`/orders/cancel/${id}`);
};

// Request return
// ======================================
// REQUEST RETURN / EXCHANGE
// ======================================

export const requestReturn = (
    id,
    data
) => {
    return api.post(
        `/orders/${id}/return`,
        data
    );
};

export const applyCoupon = (data) => {
    return api.post("/orders/apply-coupon", data);
};