const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

const errorHandler = require("./middlewares/errorHandler.js");

const authRoutes = require("./routes/auth.routes.js");
const productRoutes = require("./routes/product.routes.js");
const categoryRoutes = require("./routes/category.routes.js");
const wishlistRoutes = require("./routes/wishlist.routes.js");
const cartRoutes = require("./routes/cart.routes.js");
const addressRoutes = require("./routes/address.routes.js");
const orderRoutes = require("./routes/order.routes.js");
const reviewRoutes = require("./routes/review.routes.js");
const aiRoutes = require("./routes/ai.routes.js");
const adminRoutes = require("./routes/admin.routes.js");
const notificationRoutes = require("./routes/notificaton.routes.js");
const contactRoutes = require("./routes/contact.routes");

// ======================================
// CORS
// ======================================

const allowedOrigins = (
    process.env.ALLOWED_ORIGINS ||
    "http://localhost:5173"
)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {

            if (!origin) {
                return callback(null, true);
            }

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(
                new Error("Not allowed by CORS")
            );
        },

        credentials: true,
    })
);

// ======================================
// BODY PARSERS
// ======================================

app.use(express.json({ limit: "10mb" }));

app.use(
    express.urlencoded({
        extended: true,
        limit: "10mb",
    })
);

app.use(cookieParser());

// ======================================
// HEALTH CHECK
// ======================================

app.get("/api/health", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "NovaCart AI Backend Running 🚀",
    });
});

// ======================================
// ROUTES
// ======================================

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/contact", contactRoutes);

// ======================================
// ERROR HANDLER
// ======================================

app.use(errorHandler);

module.exports = app;