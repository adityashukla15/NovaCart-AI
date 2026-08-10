import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

import Home from "../components/home/Home";
import Shop from "../pages/Shop";
import ProductDetail from "../components/product/ProductDetail";

import Login from "../pages/Login";
import Register from "../pages/Register";

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

        </Routes>

    );

};

export default AppRoutes;