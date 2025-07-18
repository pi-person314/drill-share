"use client";
import { useAuth } from "@/hooks/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ReviewSessions() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user && !loading) router.replace("/");
    }, [user, loading]);
        
    if (!user || loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-3xl text-[var(--muted)]">Loading...</p>
            </div>
        )
    }

    return (
        <main className="flex-1 flex flex-col justify-center items-center space-y-16 p-16">
            <p>review sessions</p>
        </main>
    )
}