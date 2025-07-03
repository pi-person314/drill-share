"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type AuthContextType = {
    user: string | null;
    loading: boolean;
    login: (uid: string) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: () => {},
    logout: () => {}
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<string | null>(null);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("user");
            if (storedUser) setUser(storedUser);
            setLoading(false);
        }
    }, []);

    const login = (uid: string) => {
        setUser(uid);
        if (typeof window !== "undefined") localStorage.setItem("user", uid);
    }
    const logout = () => {
        setUser(null);
        if (typeof window !== "undefined") localStorage.removeItem("user");
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}