"use client";
import DrillCard from "@/components/DrillCard";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) router.replace("/");
    }, []);
    
    if (!user) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-3xl text-[var(--muted)]">Loading...</p>
            </div>
        )
    }

    return (
        <div className="p-10">
            <p>dashboard</p>
        </div>
    )
}