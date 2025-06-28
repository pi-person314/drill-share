"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type AuthContextType = {
    user: string | null;
    login: (uid: string) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("user");
            if (storedUser) setUser(storedUser);
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
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
}