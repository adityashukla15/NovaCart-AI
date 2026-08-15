import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

// Public / Main pages
import Home from "../components/home/Home";
import Shop from "../pages/Shop";
import About from "../pages/About";
import Contact from "../pages/Contact";
import ProductDetail from "../components/product/ProductDetail";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import MyOrders from "../components/MyOrders";
import OrderDetails from "../components/OrderDetails";
import Wishlist from "../components/Wishlist";
import Profile from "../components/Profile";
import ForgotPassword from "../pages/ForgotPassword";

// Admin
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminLayout from "../components/admin/AdminLayout";
import AdminProducts from "../components/admin/AdminProducts";
import AdminCategories from "../components/admin/AdminCategories";
import AdminUsers from "../components/admin/AdminUsers";
import AdminCoupons from "../components/admin/AdminCoupons";
import AdminOrders from "../components/admin/AdminOrders";
import AdminAnalytics from "../components/admin/AdminAnalytics";
import AdminReturns from "../components/admin/AdminReturns";

// AI
import AiLayout from "../components/ai/AiLayout";
import AiHome from "../components/ai/AiHome";
import AIChat from "../components/ai/AIChat";
import SmartSearch from "../components/ai/SmartSearch";
import CompareProducts from "../components/ai/CompareProducts";
import ProductSummary from "../components/ai/ProductSummary";
import OutfitRecommendation from "../components/ai/OutfitRecommendation";
import ImageSearch from "../components/ai/ImageSearch";

// Reviews
import ProductReviews from "../components/product/ProductReview";

import { useAuth } from "../context/AuthContext";


// ======================================================
// PUBLIC ROUTE
// ======================================================

const PublicRoute = ({ children }) => {

    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                Loading...
            </div>
        );
    }

    if (user) {
        return <Navigate to="/" replace />;
    }

    return children;
};


// ======================================================
// PROTECTED ROUTE
// ======================================================

const ProtectedRoute = ({ children }) => {

    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                Loading...
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};


// ======================================================
// APP ROUTES
// ======================================================

const AppRoutes = () => {

    return (

        <Routes>

            {/* ==================================================
                AUTH
            ================================================== */}

            <Route element={<AuthLayout />}>

                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />

                <Route
                    path="/register"
                    element={
                        <PublicRoute>
                            <Register />
                        </PublicRoute>
                    }
                />

                <Route
    path="/forgot-password"
    element={<ForgotPassword />}
/>

            </Route>


            {/* ==================================================
                HOME
            ================================================== */}

            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <Home />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />


            {/* ==================================================
                SHOP
            ================================================== */}

            <Route
                path="/shop"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <Shop />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />


            {/* ==================================================
                PRODUCT
            ================================================== */}

            <Route
                path="/products/:id"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <ProductDetail />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* ==================================================
                CART
            ================================================== */}

            <Route
                path="/cart"
                element={<Cart />}
            />


            {/* ==================================================
                CHECKOUT
            ================================================== */}

            <Route
                path="/checkout"
                element={<Checkout />}
            />


            {/* ==================================================
                MY ORDERS
            ================================================== */}

            <Route
                path="/my-orders"
                element={<MyOrders />}
            />


            {/* ==================================================
                ORDER DETAILS
            ================================================== */}

            <Route
                path="/orders/:id"
                element={<OrderDetails />}
            />


            {/* ==================================================
                WISHLIST
            ================================================== */}

            <Route
                path="/wishlist"
                element={<Wishlist />}
            />


            {/* ==================================================
                PROFILE
            ================================================== */}

            <Route
                path="/profile"
                element={<Profile />}
            />


            {/* ==================================================
                ADMIN ROUTES
            ================================================== */}

            <Route
                path="/admin"
                element={<AdminLayout />}
            >

                {/* /admin */}

                <Route
                    index
                    element={<AdminDashboard />}
                />


                {/* /admin/products */}

                <Route
                    path="products"
                    element={<AdminProducts />}
                />


                {/* /admin/categories */}

                <Route
                    path="categories"
                    element={<AdminCategories />}
                />


                {/* /admin/orders */}

                <Route
                    path="orders"
                    element={<AdminOrders />}
                />


                {/* /admin/returns */}

                <Route
                    path="returns"
                    element={<AdminReturns />}
                />


                {/* /admin/users */}

                <Route
                    path="users"
                    element={<AdminUsers />}
                />


                {/* /admin/coupons */}

                <Route
                    path="coupons"
                    element={<AdminCoupons />}
                />


                {/* /admin/analytics */}

                <Route
                    path="analytics"
                    element={<AdminAnalytics />}
                />

            </Route>


            {/* ==================================================
                AI ROUTES
            ================================================== */}

            <Route
                path="/ai"
                element={<AiLayout />}
            >

                {/* /ai */}

                <Route
                    index
                    element={<AiHome />}
                />


                {/* /ai/chat */}

                <Route
                    path="chat"
                    element={<AIChat />}
                />


                {/* /ai/search */}

                <Route
                    path="search"
                    element={<SmartSearch />}
                />


                {/* /ai/compare */}

                <Route
                    path="compare"
                    element={<CompareProducts />}
                />


                {/* /ai/summary */}

                <Route
                    path="summary"
                    element={<ProductSummary />}
                />


                {/* /ai/outfit */}

                <Route
                    path="outfit"
                    element={<OutfitRecommendation />}
                />


                {/* /ai/image-search */}

                <Route
                    path="image-search"
                    element={<ImageSearch />}
                />

            </Route>


            {/* ==================================================
                PRODUCT REVIEWS
            ================================================== */}

            <Route
                path="/products/:id/reviews"
                element={<ProductReviews />}
            />


            {/* ==================================================
                UNKNOWN ROUTE
            ================================================== */}

            <Route
                path="*"
                element={
                    <Navigate
                        to="/login"
                        replace
                    />
                }
            />

        </Routes>

    );

};


export default AppRoutes;