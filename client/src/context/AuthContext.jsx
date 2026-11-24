import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        function syncSession() {
            const storedToken = localStorage.getItem("token");
            const storedUser = localStorage.getItem("user");
            try {
                const parsedUser = storedToken && storedUser ? JSON.parse(storedUser) : null;
                setUser(parsedUser);
                setToken(parsedUser ? storedToken : null);
            } catch {
                setUser(null);
                setToken(null);
            }
            setLoading(false);
        }
        function onStorage(event) {
            if (event.storageArea === localStorage && [null, "token", "user"].includes(event.key)) {
                syncSession();
            }
        }
        window.addEventListener("storage", onStorage);
        window.addEventListener("pageshow", syncSession);
        syncSession();
        return () => {
            window.removeEventListener("storage", onStorage);
            window.removeEventListener("pageshow", syncSession);
        };
    }, []);

    const login = (userData, jwtToken) => {
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("user", JSON.stringify(userData));

        setToken(jwtToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                logout,
                isAuthenticated: !!token,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
