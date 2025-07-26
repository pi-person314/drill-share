"use client";
import TrainingCard from "@/components/TrainingCard";
import { useAuth } from "@/hooks/auth";
import { TrainingType } from "@/types/training";
import Link from "next/link";
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
                setSessions(data.data.sort((a: TrainingType, b: TrainingType) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
            }
            setFetching(false);
        }
        fetchSessions();
    }, [user, loading, trigger]);
        
    if (!user || loading || fetching) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-3xl text-[var(--muted)] animate-pulse">Loading...</p>
            </div>
        )
    }

    if (!sessions.length) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-3xl text-[var(--muted)] text-center p-8">
                    No training sessions have been created yet.<br/>
                    Begin{" "}
                    <Link href="/training/new" className="text-[var(--link)] underline">here!</Link>
                </p>
            </div>
        )
    }

    return (
        <main className="flex-1 flex flex-col space-y-16 p-16 py-12 min-w-0 overflow-y-auto">
            <div className="flex-1 lg:min-h-0 [@media(max-height:70rem)]:min-h-auto space-y-4">
                <h1 className="text-center text-2xl font-semibold">Continue Where You Left Off</h1>
                <div className="flex space-x-4 p-4 pr-0 overflow-x-auto border rounded-2xl shadow-lg">
                    {sessions.filter(session => session.videos.includes("")).map((session, index) => (
                        <TrainingCard key={index} trainingInfo={session} trigger={trigger} setTrigger={setTrigger} />
                    ))}
                </div>
            </div>
            
            <div className="flex-1 lg:min-h-0 [@media(max-height:70rem)]:min-h-auto space-y-4">
                <h1 className="text-center text-2xl font-semibold">Review or Retry Completed Sessions</h1>
                <div className="flex space-x-4 p-4 pr-0 overflow-x-auto border rounded-2xl shadow-lg">
                    {sessions.filter(session => !session.videos.includes("")).map((session, index) => (
                        <TrainingCard key={index} trainingInfo={session} trigger={trigger} setTrigger={setTrigger} />
                    ))}
                </div>
            </div>
        </main>
    )
}