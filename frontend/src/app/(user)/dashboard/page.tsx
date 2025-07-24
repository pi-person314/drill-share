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
import { FaArrowUp, FaFire } from "react-icons/fa";

export default function Dashboard() {
    const { user, loading } = useAuth();
    const router = useRouter(); 
    const { setDrills } = useDrill();
    const [ fetching, setFetching ] = useState(false);
    const [ userSports, setUserSports ] = useState<string[] | null>(null);
    const [ streak, setStreak ] = useState<number>(0);
    const [ contribution, setContribution ] = useState<number>(0);
    const [ recDrills, setRecDrills ] = useState<DrillType[]>([]);
    const [ myDrills, setMyDrills ] = useState<DrillType[]>([]);
    const [ sessions, setSessions ] = useState<TrainingType[]>([]);

    useEffect(() => {
        if (!user && !loading) router.replace("/");
        const fetchUser = async () => {
            setFetching(true);
            const res = await fetch(`http://localhost:5000/api/users/${user}`);
            if (res.ok) {
                const today = new Date().toLocaleDateString();
                const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleDateString();
                const data = await res.json();
                setUserSports(data.data.sports);
                setStreak(data.data.dailyAt === today || data.data.dailyAt === yesterday ? data.data.streak : 0);
            }
        }
        fetchUser();

        const fetchSessions = async () => {
            setFetching(true);
            const res = await fetch(`http://localhost:5000/api/training/created/${user}`);
            if (res.ok) {
                const data = await res.json();
                const sortedSessions = data.data.sort((a: TrainingType, b: TrainingType) => b.visited - a.visited);
                setSessions(sortedSessions.slice(0, 3));
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
                const filteredDrills = publicData.data.filter((drill: DrillType) => drill.creator._id !== user && userSports.some((sport) => drill.sports.includes(sport)));
                const sortedDrills = filteredDrills.sort((a: DrillType, b: DrillType) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setRecDrills(sortedDrills.slice(0, 5));

                const myData = await myRes.json();
                setMyDrills(myData.data.sort((a: DrillType, b: DrillType) => b.likes - a.likes).slice(0, 5));
                setContribution(myData.data.filter((drill: DrillType) => drill.likes >= 10).length);
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
        <main className="flex-1 flex justify-center p-16 min-w-0 overflow-y-auto">
            <div className="flex flex-col space-y-28 max-w-300 w-full h-full">
                <div className="flex flex-col space-y-4">
                    <h1 className="text-2xl font-semibold">Recommended For You</h1>
                    <div className="flex space-x-8 overflow-x-auto p-4 border rounded-lg shadow-lg">
                        {recDrills.map((drill, index) => <DrillCard key={index} drillInfo={drill} />)}
                        {!recDrills.length && <p className="text-center text-xl text-[var(--muted)] w-full p-8">
                            No drills have been shared yet.<br/>
                            Create your own{" "}
                            <Link href="/drills#my-drills" className="text-[var(--link)] underline">here!</Link>
                        </p>}
                    </div>
                </div>
                <div className="flex-1 flex flex-col 2xl:flex-row justify-between space-x-0 2xl:space-x-16 space-y-16 2xl:space-y-0 min-h-0">
                    <div className="flex flex-col space-y-2">
                        <h1 className="flex text-2xl font-semibold">
                            Your Trending Drills
                            <span className="flex items-center ml-4 text-xl text-[var(--link)]"><FaArrowUp className="mr-1"/>{contribution}</span>
                        </h1>
                        <p className="text-[var(--muted)]">Create drills with 10+ likes to increase your contribution!</p>
                        <div className="flex-1 grid [grid-template-columns:repeat(auto-fit,minmax(24rem,1fr))] justify-items-center overflow-y-auto auto-rows-max gap-y-20 p-6 mt-4 border rounded-lg shadow-lg">
                            {myDrills.map((drill, index) => <DrillCard key={index} drillInfo={drill} />)}
                            {!myDrills.length && <p className="text-center text-xl text-[var(--muted)] m-auto p-8">
                                No drills have been created yet.<br/>
                                Begin{" "}
                                <Link href="/drills#my-drills" className="text-[var(--link)] underline">here!</Link>
                            </p>}
                        </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <h1 className="flex text-2xl font-semibold">
                            Popular Training Sessions
                            <span className="flex items-center ml-4 text-xl text-[var(--danger)]"><FaFire className="mr-1"/>{streak}</span>
                        </h1>
                        <p className="text-[var(--muted)]">Complete training sessions daily to maintain your streak!</p>
                        <div className="flex-1 flex flex-col items-center space-y-6 p-6 mt-4 border rounded-lg shadow-lg overflow-y-auto">
                            {sessions.map((session, index) => <TrainingCard key={index} trainingInfo={session} />)}
                            {!sessions.length && <p className="text-center text-xl text-[var(--muted)] m-auto p-8">
                                No training sessions have been created yet.<br/>
                                Begin{" "}
                                <Link href="/training/new" className="text-[var(--link)] underline">here!</Link>
                            </p>}
                        </div>
                    </div>
                </div>
            </div>
            <DrillModal preview={false} />
        </main>
        
    )
}