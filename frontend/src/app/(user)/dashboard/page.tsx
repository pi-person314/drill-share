"use client";
import DrillCard from "@/components/DrillCard";
import DrillModal from "@/components/DrillModal";
import TrainingCard from "@/components/TrainingCard";
import { useAuth } from "@/hooks/auth";
import { useDrill } from "@/hooks/drill";
import { DrillType } from "@/types/drill";
import { TrainingType } from "@/types/training";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
    const { user, loading } = useAuth();
    const router = useRouter(); 
    const { drills, setDrills } = useDrill();
    const [ fetching, setFetching ] = useState(false);
    const [ userSports, setUserSports ] = useState<string[] | null>(null);
    const [ recDrills, setRecDrills ] = useState<DrillType[]>([]);
    const [ myDrills, setMyDrills ] = useState<DrillType[]>([]);
    const [ sessions, setSessions ] = useState<TrainingType[]>([]);

    useEffect(() => {
        if (!user && !loading) router.replace("/");
        const fetchUser = async () => {
            setFetching(true);
            const res = await fetch(`http://localhost:5000/api/users/${user}`);
            if (res.ok) {
                const data = await res.json();
                setUserSports(data.data.sports);
            }
        }
        fetchUser();

        const fetchSessions = async () => {
            setFetching(true);
            const res = await fetch(`http://localhost:5000/api/training/created/${user}`);
            if (res.ok) {
                const data = await res.json();
                // change to sort by most visited (add a backend field for this)
                setSessions(data.data.slice(0, 3));
            }
        }
        fetchSessions();
    }, [user, loading]);

    useEffect(() => {
        if (!userSports) return;
        const fetchDrills = async () => {
            const publicRes = await fetch("http://localhost:5000/api/drills/public");
            const myRes = await fetch(`http://localhost:5000/api/drills/created/${user}`);
            if (publicRes.ok && myRes.ok) {
                const publicData = await publicRes.json();
                const filteredDrills = publicData.data.filter((drill: DrillType) => userSports.some((sport) => drill.sports.includes(sport)));
                const sortedDrills = filteredDrills.sort((a: DrillType, b: DrillType) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setRecDrills(sortedDrills.slice(0, 5));

                const myData = await myRes.json();
                setMyDrills(myData.data.sort((a: DrillType, b: DrillType) => b.likes - a.likes).slice(0, 5));

                setDrills([...recDrills, ...myDrills]);
            }
            setFetching(false);
        }
        fetchDrills();
    }, [userSports]);
    
    if (!user || loading || fetching) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-3xl text-[var(--muted)]">Loading...</p>
            </div>
        )
    }

    return (
        <main className="flex-1 p-16 min-w-0">
            <div className="flex flex-col space-y-28 h-full">
                <div className="flex flex-col space-y-4">
                    <h1 className="text-2xl font-semibold">Recommended For You</h1>
                    <div className="flex space-x-8 overflow-x-auto p-4 border rounded-lg shadow-lg">
                        {recDrills.map((drill, index) => <DrillCard key={index} drillInfo={drill} />)}
                        {!recDrills.length && <p className="text-center text-xl text-[var(--muted)] w-full m-8">
                            No drills have been shared yet.<br/>
                            Create your own{" "}
                            <Link href="/drills" className="text-[var(--link)] underline">here!</Link>
                        </p>}
                    </div>
                </div>
                <div className="flex-1 flex justify-between space-x-8 min-h-0">
                    <div className="flex flex-col space-y-2">
                        <h1 className="text-2xl font-semibold">Your Trending Drills</h1>
                        <p className="text-[var(--muted)]">Create drills with 10+ likes to increase your contribution!</p>
                        <div className="flex flex-col items-center space-y-6 p-6 mt-4 border rounded-lg shadow-lg overflow-y-auto">
                            {myDrills.map((drill, index) => <DrillCard key={index} drillInfo={drill} />)}
                        </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <h1 className="text-2xl font-semibold">Popular Training Sessions</h1>
                        <p className="text-[var(--muted)]">Complete training sessions daily to maintain your streak!</p>
                        <div className="flex flex-col items-center space-y-6 p-6 mt-4 border rounded-lg shadow-lg overflow-y-auto">
                            {sessions.map((session, index) => <TrainingCard key={index} trainingInfo={session} />)}
                        </div>
                    </div>
                </div>
            </div>
            <DrillModal preview={false} />
        </main>
        
    )
}