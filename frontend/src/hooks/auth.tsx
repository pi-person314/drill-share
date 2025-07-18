"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type AuthContextType = {
    user: string | null;
    username: string;
    loading: boolean;
    login: (uid: string) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    username: "Deleted User",
    loading: true,
    login: () => {},
    logout: () => {}
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<string | null>(null);
    const [username, setUsername] = useState<string>("Deleted User");
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("user");
            if (storedUser) setUser(storedUser);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const getUsername = async () => {
            if (!user) return;
            const res = await fetch(`http://localhost:5000/api/users/${user}`);
            if (res.ok) {
                const data = await res.json();
                setUsername(data.data.username);
            } else {
                setUsername("Deleted User");
            }
        }
        getUsername();
    }, [user]);

    const login = (uid: string) => {
        setUser(uid);
        if (typeof window !== "undefined") localStorage.setItem("user", uid);
    }
    const logout = () => {
        setUser(null);
        if (typeof window !== "undefined") localStorage.removeItem("user");
    }

    return (
        <AuthContext.Provider value={{ user, username, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}