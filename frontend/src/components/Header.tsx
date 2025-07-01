"use client";
import { useAuth } from "@/context/auth";
import Link from "next/link";

export default function Header() {
    const { user, logout } = useAuth();

    return (
        <header className={`h-36 p-5 pr-7 ${user ? "bg-[var(--secondary)]" : ""}`}>
            {!user && <div className="flex justify-between h-full">
                <Link href="/" className="h-full hover:scale-105"><img src="/images/logo.png" alt="Logo" className="h-full"/></Link>
                <div className="flex items-center space-x-5 h-full">
                    <Link href="/login" className="bg-[var(--primary)] hover:scale-105 p-5 rounded-xl text-2xl">Login</Link>
                    <Link href="/register" className="bg-[var(--primary)] hover:scale-105 p-5 rounded-xl text-2xl">Register</Link>
                </div>
            </div>}

            {user && <div className="flex justify-between h-full">
                <Link href="/dashboard" className="h-full hover:scale-105"><img src="/images/logo.png" alt="Logo" className="h-full"/></Link>
                <div className="flex items-center space-x-5 h-full">
                    <Link href="/settings" className="bg-[var(--primary)] hover:scale-105 p-5 rounded-xl text-2xl">Settings</Link>
                    <Link href="/" onClick={logout} className="bg-[var(--primary)] hover:scale-105 p-5 rounded-xl text-2xl cursor-pointer">Logout</Link>
                </div>
            </div>}
        </header>
    )
}