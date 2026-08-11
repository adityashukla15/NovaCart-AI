import api from "./axios";


// ======================================
// GET MY PROFILE
// ======================================

export const getProfile = () => {

    return api.get("/auth/me");

};


// ======================================
// UPDATE PROFILE
// ======================================

export const updateProfile = (data) => {

    return api.put(
        "/auth/profile",
        data
    );

};