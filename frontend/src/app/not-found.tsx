"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";

export default function NotFound() {
    const { user } = useAuth();
    const router = useRouter();
    
    useEffect(() => {
        if (user) router.replace("/dashboard");
        else router.replace("/");
    }, [user]);

    return null;
}