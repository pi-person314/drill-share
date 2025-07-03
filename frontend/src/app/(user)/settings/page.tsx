"use client";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Settings() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user && !loading) router.replace("/");
    }, [user]);
        
    if (!user) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-3xl text-[var(--muted)]">Loading...</p>
            </div>
        )
    }

    return (
        <div className="">
            <p>settings</p>
        </div>
    )
}