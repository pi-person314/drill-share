"use client";
import TrainingCard from "@/components/TrainingCard";
import { useAuth } from "@/hooks/auth";
import { TrainingType } from "@/types/training";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ReviewSessions() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [ sessions, setSessions ] = useState<TrainingType[]>([]);
    const [ fetching, setFetching ] = useState(true);
    const [ trigger, setTrigger ] = useState(false);

    useEffect(() => {
        if (!user && !loading) router.replace("/");

        const fetchSessions = async () => {
            setFetching(true);
            const res = await fetch(`http://localhost:5000/api/training/created/${user}`);
            if (res.ok) {
                const data = await res.json();
                setSessions(data.data);
            }
            setFetching(false);
        }
        fetchSessions();
    }, [user, loading, trigger]);
        
    if (!user || loading || fetching) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-3xl text-[var(--muted)]">Loading...</p>
            </div>
        )
    }

    return (
        <main className="flex-1 grid [grid-template-columns:repeat(auto-fit,minmax(50rem,1fr))] justify-items-center overflow-y-auto auto-rows-max gap-y-20 p-16">
            {sessions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((session, index) => (
                <TrainingCard key={index} trainingInfo={session} trigger={trigger} setTrigger={setTrigger} />
            ))}
        </main>
    )
}