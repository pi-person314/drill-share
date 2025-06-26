"use client";
import Header from "@/components/Header";
import Link from "next/link";
import { useState } from "react";

export default function Login() {
    const [ userInfo, setUserInfo ] = useState({ username: "", password: "" });
    const [ error, setError ] = useState("");

    const handleLogin = async () => {
        const res = await fetch("http://localhost:5000/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userInfo)
        });
        if (res.ok) {
            setError("");
            setUserInfo({ username: "", password: "" });
            window.location.href = "/dashboard";
        } else {
            const data = await res.json();
            setError(data.message);
        }
    }

    return (
        <div className="flex flex-col w-screen h-screen">
            <Header />
            <main className="flex-1 flex justify-center items-center">
                <div className="flex flex-col w-1/2 items-center space-y-5 bg-[var(--primary)] rounded-3xl shadow-lg p-16">
                    <h1 className="text-5xl mb-10 font-medium">Login</h1>
                    <input 
                        placeholder="Username" 
                        value={userInfo.username} 
                        onChange={e => setUserInfo({...userInfo, username: e.target.value})} 
                        className={`w-2/3 bg-[var(--secondary)] rounded-lg p-3 border ${error && !userInfo.username ? "border-[var(--danger)]" : ""}`}
                    />
                    <input 
                        placeholder="Password" 
                        type="password" 
                        value={userInfo.password} 
                        onChange={e => setUserInfo({...userInfo, password: e.target.value})}
                        className={`w-2/3 bg-[var(--secondary)] rounded-lg p-3 border ${error && !userInfo.password ? "border-[var(--danger)]" : ""}`}
                    />
                    <button onClick={handleLogin} className="bg-[var(--accent)] hover:scale-105 rounded-lg p-3 mt-5">Sign In</button>
                    {error && <p className="text-center text-[var(--danger)]">
                        {error}<br/>If this is your first time here, 
                        <Link href="/register" className="text-[var(--link)]"> <u>create an account!</u></Link>
                    </p>}
                </div>
            </main>
        </div>
    )
}