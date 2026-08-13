import api from "./axios";

// ==========================================
// SMART SEARCH
// ==========================================

export const smartSearch = (data) => {
    return api.post("/ai/search", data);
};


// ==========================================
// AI CHAT
// ==========================================

export const chatWithAI = (message) => {
    return api.post("/ai/chat", {
        message,
    });
};


// ==========================================
// CHAT HISTORY
// ==========================================

export const getChatHistory = () => {
    return api.get("/ai/history");
};


// ==========================================
// CLEAR CHAT
// ==========================================

export const clearChat = () => {
    return api.delete("/ai/clear");
};


// ==========================================
// COMPARE PRODUCTS
// ==========================================

export const compareProducts = (data) => {
    return api.post("/ai/compare", data);
};


// ==========================================
// PRODUCT SUMMARY
// ==========================================

export const productSummary = (data) => {
    return api.post("/ai/summary", data);
};


// ==========================================
// OUTFIT RECOMMENDATION
// ==========================================

export const outfitRecommendation = (data) => {
    return api.post(
        "/ai/outfit-recommendation",
        data
    );
};


// ==========================================
// IMAGE SEARCH
// ==========================================

export const imageSearch = (data) => {
    return api.post(
        "/ai/image-search",
        data
    );
};