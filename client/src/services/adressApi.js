import api from "./axios";

// Get all addresses
export const getAddresses = () => {
    return api.get("/addresses/get-addresses");
};

// Get single address
export const getAddressById = (id) => {
    return api.get(`/addresses/get-address/${id}`);
};

// Add address
export const addAddress = (data) => {
    return api.post("/addresses/add", data);
};

// Update address
export const updateAddress = (id, data) => {
    return api.patch(`/addresses/update/${id}`, data);
};

// Delete address
export const deleteAddress = (id) => {
    return api.delete(`/addresses/delete/${id}`);
};

// Set default address
export const setDefaultAddress = (id) => {
    return api.put(`/addresses/set-default/${id}`);
};