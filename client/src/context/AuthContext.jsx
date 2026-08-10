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

  // GET CURRENT USER
  const fetchUser = async () => {

    try {

        const response = await getCurrentUser();

        setUser(response.data?.data);

    } catch (error) {

        if (error.response?.status === 401) {
            setUser(null);
        } else {
            console.error("Failed to fetch current user:", error);
        }

    } finally {

        setLoading(false);

    }
};

  // LOGOUT
  const logout = async () => {

    try {

      await logoutUser();

      setUser(null);

    } catch (error) {

      console.error("Logout failed:", error);

    }

  };

  // Check logged-in user when app starts
  useEffect(() => {

    fetchUser();

  }, []);

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

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);