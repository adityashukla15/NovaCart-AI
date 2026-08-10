import api from "./axios";

export const getAllProducts = (params = {}) => {
    return api.get("/products", {
        params,
    });
};

export const getProductById = (id) => {
    return api.get(`/products/${id}`);
};