"use client";
import { useAuth } from "@/context/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { BsGraphUpArrow } from "react-icons/bs";
import { FaWrench } from "react-icons/fa";

export default function Training() {
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
            <h1 className="text-5xl font-semibold text-center">Welcome to Training!</h1>
            <div className="flex justify-around items-center h-1/2 w-full">
                <Link href="/training/new" className="flex flex-col justify-center items-center h-full w-2/5 p-12 border rounded-2xl shadow-lg hover:scale-105">
                    <h1 className="text-3xl font-medium text-center mt-16 mb-4">New Session</h1>
                    <h2 className="text-xl text-[var(--muted)] text-center">Combine your saved drills to begin a custom training session!</h2>
                    <FaWrench className="text-8xl mt-8"/>
                </Link>
                <Link href="/training/review" className="flex flex-col justify-center items-center h-full w-2/5 p-12 border rounded-2xl shadow-lg hover:scale-105">
                    <h1 className="text-3xl font-medium text-center mt-16 mb-4">Review Sessions</h1>
                    <h2 className="text-xl text-[var(--muted)] text-center">Review notes and footage from previous sessions to learn and improve!</h2>
                    <BsGraphUpArrow className="text-8xl mt-8"/>
                </Link>
            </div>
        </main>
    )
}