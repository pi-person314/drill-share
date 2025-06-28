"use client";
import { useAuth } from "@/context/auth";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
    const { user, logout } = useAuth();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);
    if (!mounted) return null;

    const handleLogout = () => {
        logout();
        window.location.href = "/";
    }

    return (
        <header className="h-30 p-5">
            {!user && <div className="flex justify-between h-full">
                <Link href="/" className="h-full hover:scale-105"><img src="./images/logo.png" alt="Logo" className="h-full"/></Link>
                <div className="flex items-center space-x-3 h-full">
                    <Link href="/login" className="bg-[var(--primary)] hover:scale-105 p-4 rounded-xl text-lg">Login</Link>
                    <Link href="/register" className="bg-[var(--primary)] hover:scale-105 p-4 rounded-xl text-lg">Register</Link>
                </div>
            </div>}

            {user && <div className="flex justify-between h-full">
                <Link href="/dashboard" className="h-full hover:scale-105"><img src="./images/logo.png" alt="Logo" className="h-full"/></Link>
                <div className="flex items-center space-x-3 h-full">
                    <Link href="/profile" className="bg-[var(--primary)] hover:scale-105 p-4 rounded-xl text-lg">Profile</Link>
                    <button onClick={handleLogout} className="bg-[var(--primary)] hover:scale-105 p-4 rounded-xl text-lg cursor-pointer">Logout</button>
                </div>
            </div>}
        </header>
    )
}