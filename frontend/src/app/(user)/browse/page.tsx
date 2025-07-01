"use client";
import { useAuth } from "@/context/auth";

export default function Browse() {
    const { user } = useAuth();
    
    if (!user) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-3xl text-[var(--muted)]">Loading...</p>
            </div>
        )
    }

    return (
        <p>browse</p>
    )
}