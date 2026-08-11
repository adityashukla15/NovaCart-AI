import api from "./axios";

// ======================================
// GET WISHLIST
// ======================================

export const getWishlist = () => {
    return api.get("/wishlist/all-wishlist");
};


// ======================================
// ADD TO WISHLIST
// ======================================

export const addToWishlist = (productId) => {
    return api.post(`/wishlist/add/${productId}`);
};


// ======================================
// REMOVE FROM WISHLIST
// ======================================

export const removeFromWishlist = (productId) => {
    return api.delete(`/wishlist/delete/${productId}`);
};


// ======================================
// CLEAR WISHLIST
// ======================================

export const clearWishlist = () => {
    return api.delete("/wishlist/delete-all");
};