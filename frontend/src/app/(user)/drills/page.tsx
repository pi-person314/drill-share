"use client";
import { useAuth } from "@/context/auth";

export default function Drills() {
    const { user } = useAuth();
        
    if (!user) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-3xl text-[var(--muted)]">Loading...</p>
            </div>
        )
    }

    return (
        <div className="">
            <p>drills</p>
        </div>
    )
}