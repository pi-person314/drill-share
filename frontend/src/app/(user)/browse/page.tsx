"use client";
import DrillCard from "@/components/DrillCard";
import { useAuth } from "@/context/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DrillModal from "@/components/DrillModal";
import { DrillType } from "@/types/drill";
import { useDrill } from "@/context/drill";

export default function Browse() {
    const { user, loading } = useAuth();
    const { drills, setDrills } = useDrill();
    const [ usernames, setUsernames ] = useState<string[]>([]);
    const [ fetching, setFetching ] = useState(true);
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
            setFetching(true);
            const res = await fetch("http://localhost:5000/api/drills/public");
            if (res.ok) {
                const data = await res.json();
                const allUsernames = await Promise.all(
                    data.data.map(async (drill: DrillType) => await getUsername(drill.creator))
                );
                setDrills(data.data);
                setUsernames(allUsernames);
            }
            setFetching(false);
        }
        fetchDrills();
    }, [user, loading]);
    
    if (!user || loading || fetching) {
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
                    <Link href="/drills" className="text-[var(--link)] underline">here!</Link>
                </p>
            </div>
        )
    }

    return (
        <main className="flex-1 grid [grid-template-columns:repeat(auto-fit,minmax(24rem,1fr))] justify-items-center overflow-y-auto auto-rows-max gap-y-20 p-16">
            {drills.map((drill, index) => (
                <DrillCard key={index} drillInfo={drill} username={usernames[index]} />
            ))}
            <DrillModal preview={false}/>
        </main>
    )
}