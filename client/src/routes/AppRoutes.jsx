import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

import Home from "../components/home/Home";
import Shop from "../pages/Shop";
import ProductDetail from "../components/product/ProductDetail";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import MyOrders from "../components/MyOrders"
import OrderDetails from "../components/OrderDetails";
import Wishlist from "../components/Wishlist"
import Profile from "../components/Profile";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminLayout from "../components/admin/AdminLayout";
import AdminProducts from "../components/admin/AdminProducts";
import AdminCategories from "../components/admin/AdminCategories";
import AdminUsers from "../components/admin/AdminUsers";
import AdminCoupons from "../components/admin/AdminCoupons";
import AdminOrders from "../components/admin/AdminOrders";
import AdminAnalytics from "../components/admin/AdminAnalytics";
import AiLayout from "../components/ai/AiLayout";
import AiHome from "../components/ai/AiHome";

import { useAuth } from "../context/AuthContext";


const PublicRoute = ({ children }) => {

    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }

    if (user) {
        return <Navigate to="/" replace />;
    }

    return children;
};


const ProtectedRoute = ({ children }) => {

    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};


const AppRoutes = () => {

    return (

        <Routes>

            {/* AUTH */}

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

            </Route>


            {/* HOME */}

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


            {/* SHOP */}

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


            {/* PRODUCT */}

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


            {/* UNKNOWN */}

            <Route
                path="*"
                element={<Navigate to="/login" replace />}
            />
            {/* CART */}
            <Route
    path="/cart"
    element={<Cart />}
/>
<Route
    path="/checkout"
    element={<Checkout />}
/>

<Route
    path="/my-orders"
    element={<MyOrders />}
/>

<Route
    path="/orders/:id"
    element={<OrderDetails />}
/>
<Route
    path="/wishlist"
    element={<Wishlist />}
/>
<Route
    path="/profile"
    element={<Profile />}
/>
<Route
    path="/admin"
    element={<AdminLayout />}
>
    <Route
        index
        element={<AdminDashboard />}
    />
    <Route
        path="products"
        element={<AdminProducts />}
    />
    <Route
        path="users"
        element={<AdminUsers />}
    />
    <Route path="categories" element={<AdminCategories />} />
    <Route
    path="/admin/coupons"
    element={<AdminCoupons />}
/>
<Route
    path="/admin/orders"
    element={<AdminOrders />}
/>
<Route
    path="/admin/analytics"
    element={
        <AdminAnalytics />
    }
/>
</Route>
   <Route path="/ai" element={<AiLayout />}>
    <Route index element={<AiHome />} />

   </Route>
        </Routes>

    );

};

export default AppRoutes;