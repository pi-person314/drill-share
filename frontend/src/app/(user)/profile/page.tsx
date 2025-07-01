"use client";
import { useAuth } from "@/context/auth";

export default function Profile() {
    const { user } = useAuth();
        
    if (!user) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-3xl text-[var(--muted)]">Loading...</p>
            </div>
        )
    }

    return (
        <p>profile</p>
    )
}