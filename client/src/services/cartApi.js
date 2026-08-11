import api from "./axios";

// Add product to cart
export const addToCart = (productId) => {
    return api.post(`/cart/add/${productId}`);
};

// Get user's cart
export const getCart = () => {
    return api.get("/cart/get-cart");
};

// Update quantity
export const updateCartQuantity = (productId, quantity) => {
    return api.put(`/cart/update/${productId}`, {
        quantity,
    });
};

// Remove product
export const removeFromCart = (productId) => {
    return api.delete(`/cart/remove/${productId}`);
};

// Clear cart
export const clearCart = () => {
    return api.delete("/cart/clear");
};