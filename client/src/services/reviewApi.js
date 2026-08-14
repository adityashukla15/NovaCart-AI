import api from "./axios";

export const getProductReviews = (productId) => {
    return api.get(`/reviews/${productId}`);
};

export const createReview = (productId, reviewData) => {
    return api.post(`/reviews/${productId}`, reviewData);
};

export const updateReview = (reviewId, reviewData) => {
    return api.patch(`/reviews/${reviewId}`, reviewData);
};

export const deleteReview = (reviewId) => {
    return api.delete(`/reviews/${reviewId}`);
};