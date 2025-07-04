"use client";
import DrillCard from "@/components/DrillCard";
import { useAuth } from "@/context/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DrillModal from "@/components/DrillModal";
import { DrillType } from "@/types/drill";
import { useDrill } from "@/context/drill";

export default function Browse() {
    const { user, loading } = useAuth();
    const { drills, setDrills, usernames, setUsernames } = useDrill();
    const router = useRouter();

    useEffect(() => {
        if (!user && !loading) router.replace("/");

        const getUsername = async ( uid: string ) => {
            const res = await fetch(`http://localhost:5000/api/users/${uid}`);
            if (res.ok) {
                const data = await res.json();
                return data.data.username;
            } else {
                return "Deleted User";
            }
        }

        const fetchDrills = async () => {
            const res = await fetch("http://localhost:5000/api/drills/public");
            if (res.ok) {
                const data = await res.json();
                const allUsernames = await Promise.all(
                    data.data.map(async (drill: DrillType) => await getUsername(drill.creator))
                );
                setDrills(data.data);
                setUsernames(allUsernames);
            }
        }
        fetchDrills();
    }, [user, loading, router]);
    
    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-3xl text-[var(--muted)]">Loading...</p>
            </div>
        )
    }

    if (!drills.length) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-3xl text-[var(--muted)] text-center">
                    No drills have been shared yet.<br/>
                    Become the first by creating your own{" "}
                    <span onClick={() => router.push("/drills#create")} className="text-[var(--link)] underline">here!</span>
                </p>
            </div>
        )
    }

    return (
        <div className="flex-1 grid [grid-template-columns:repeat(auto-fit,minmax(24rem,1fr))] justify-items-center overflow-y-auto auto-rows-max gap-y-20 p-12">
            {drills.map((drill, index) => (
                <DrillCard key={index} drillInfo={drill} username={usernames[index]} />
            ))}
            <DrillModal />
        </div>
    )
}