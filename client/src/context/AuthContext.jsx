import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import {
    getCurrentUser,
    logoutUser,
} from "../services/authApi";


const AuthContext = createContext();


export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);


    // ======================================
    // CHECK CURRENT USER
    // ======================================

    useEffect(() => {

        let cancelled = false;

        const loadCurrentUser = async () => {

            try {

                const response =
                    await getCurrentUser();

                const currentUser =
                    response.data?.data || null;

                if (!cancelled) {

                    setUser(currentUser);

                }

            } catch (error) {

                if (
                    error.response?.status === 401
                ) {

                    if (!cancelled) {
                        setUser(null);
                    }

                } else {

                    console.error(
                        "Failed to fetch current user:",
                        error
                    );

                }

            } finally {

                if (!cancelled) {

                    setLoading(false);

                }

            }

        };

        loadCurrentUser();


        // Cleanup

        return () => {

            cancelled = true;

        };

    }, []);


    // ======================================
    // LOGOUT
    // ======================================

    const logout = async () => {

        try {

            await logoutUser();

            setUser(null);

        } catch (error) {

            console.error(
                "Logout failed:",
                error
            );

        }

    };


    // ======================================
    // CONTEXT VALUE
    // ======================================

    return (

        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                logout,
            }}
        >

            {children}

        </AuthContext.Provider>

    );

};


// ======================================
// USE AUTH HOOK
// ======================================

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () =>
    useContext(AuthContext);