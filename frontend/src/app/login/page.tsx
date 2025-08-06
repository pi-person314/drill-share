"use client";
import { useAuth } from "@/hooks/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Login() {
    const [ userInfo, setUserInfo ] = useState({ username: "", password: "" });
    const [ error, setError ] = useState("");
    const { user, login } = useAuth();
    const [ fetching, setFetching ] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (user) router.replace("/dashboard");
    }, [user]);

    const handleLogin = async () => {
        setFetching(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/users/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userInfo)
        });
        
        const data = await res.json();
        if (res.ok) {
            login(data.data._id);
            router.push("/dashboard");
        } else {
            setError(data.message);
        }
        setFetching(false);
    }
    
    if (user || fetching) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-3xl text-[var(--muted)] animate-pulse">Loading...</p>
            </div>
        )
    }

    return (
        <main className="flex-1 flex justify-center items-center p-10">
            <form className="flex flex-col w-1/2 min-w-76 max-w-[40rem] items-center space-y-5 bg-[var(--primary)] rounded-3xl shadow-lg p-16"
                onSubmit={e => {
                    e.preventDefault(); 
                    handleLogin();
                }}
            >
                <h1 className="text-5xl mb-10 font-medium">Login</h1>
                <input 
                    placeholder="Username" 
                    value={userInfo.username} 
                    onChange={e => setUserInfo({...userInfo, username: e.target.value})}
                    className={`w-5/6 min-w-60 bg-[var(--secondary)] rounded-lg p-3 border ${error && !userInfo.username ? "border-[var(--danger)]" : ""}`}
                />
                <input 
                    placeholder="Password" 
                    type="password" 
                    value={userInfo.password} 
                    onChange={e => setUserInfo({...userInfo, password: e.target.value})}
                    className={`w-5/6 min-w-60 bg-[var(--secondary)] rounded-lg p-3 border ${error && !userInfo.password ? "border-[var(--danger)]" : ""}`}
                />
                <button className="bg-[var(--accent)] duration-300 hover:scale-110 rounded-lg cursor-pointer p-3 mt-5">Sign In</button>
                {error && <p className="text-center text-[var(--danger)]">
                    {error}<br/>If this is your first time here, 
                    <Link href="/register" className="text-[var(--link)]"> <u>create an account!</u></Link>
                </p>}
            </form>
        </main>
    )
}