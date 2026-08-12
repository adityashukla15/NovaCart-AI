import api from "./axios";

export const getProductReviews = (productId) => {
    return api.get(`/reviews/${productId}`);
};

export const createReview = (productId, data) => {
    return api.post(`/reviews/${productId}`, data);
};

export const updateReview = (reviewId, data) => {
    return api.patch(`/reviews/${reviewId}`, data);
};

export const deleteReview = (reviewId) => {
    return api.delete(`/reviews/${reviewId}`);
};