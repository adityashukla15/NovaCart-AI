import api from "./axios";

// ======================================
// GET USER RETURNS
// ======================================

export const getMyReturns = () => {
    return api.get("/orders/my-orders");
};


// ======================================
// GET ADMIN RETURNS
// ======================================

export const getAdminReturns = () => {
    return api.get("/admin/returns");
};


// ======================================
// UPDATE RETURN STATUS
// ======================================

export const updateReturnStatus = (
    orderId,
    status
) => {

    return api.patch(
        `/admin/returns/${orderId}/status`,
        {
            status,
        }
    );

};