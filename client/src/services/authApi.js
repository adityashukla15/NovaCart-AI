import api from "./axios";

// ======================================
// REGISTER
// ======================================

export const registerUser = (data) => {

    return api.post("/auth/register", data);

};


// ======================================
// LOGIN
// ======================================

export const loginUser = (data) => {

    return api.post("/auth/login", data);

};


// ======================================
// LOGOUT
// ======================================

export const logoutUser = () => {

    return api.post("/auth/logout");

};


// ======================================
// GET CURRENT USER
// ======================================

export const getCurrentUser = () => {

    return api.get("/auth/me");

};


// ======================================
// FORGOT PASSWORD - SEND OTP
// ======================================

export const forgotPassword = (data) => {

    return api.post(
        "/auth/forgot-password",
        data
    );

};


// ======================================
// VERIFY FORGOT PASSWORD OTP
// ======================================

export const verifyForgotPasswordOTP = (data) => {

    return api.post(
        "/auth/verify-otp",
        data
    );

};


// ======================================
// RESET PASSWORD
// ======================================

export const resetPassword = (data) => {

    return api.post(
        "/auth/reset-password",
        data
    );

};