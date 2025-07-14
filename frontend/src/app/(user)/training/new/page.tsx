"use client";
import DrillCard from "@/components/DrillCard";
import DrillModal from "@/components/DrillModal";
import { useAuth } from "@/context/auth";
import { useDrill } from "@/context/drill";
import dropdownStyles from "@/styles/dropdown";
import { DrillType } from "@/types/drill";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaPlay, FaTrash } from "react-icons/fa";
import Select from "react-select";

export default function NewSession() {
    const { user, loading } = useAuth();
    const { drills, setDrills } = useDrill();
    const router = useRouter();
    const [ sport, setSport ] = useState("");
    const [ type, setType ] = useState("Warmup");
    const [ fetching, setFetching ] = useState(true);

    const sportOptions = [
        { value: "Soccer", label: "Soccer" },
        { value: "Basketball", label: "Basketball" },
        { value: "Tennis", label: "Tennis" },
        { value: "Volleyball", label: "Volleyball" },
        { value: "Baseball", label: "Baseball" }
    ]

    useEffect(() => {
        if (!user && !loading) router.replace("/");
    }, [user, loading]);

    useEffect(() => {
        if (!sport || !type) {
            setDrills([]);
            return;
        }
        const fetchDrills = async () => {
            setFetching(true);
            const res = await fetch(`http://localhost:5000/api/drills/saved/${user}`);
            if (res.ok) {
                const data = await res.json();
                const typeDrills = data.data.filter((drill: DrillType) => drill.type === type);
                setDrills([
                    ...typeDrills.filter((drill: DrillType) => drill.sports.includes(sport)), 
                    ...typeDrills.filter((drill: DrillType) => drill.sports.includes("General"))
                ]);
            }
            setFetching(false);
        }
        fetchDrills();
    }, [sport, type]);
        
    if (!user || loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-3xl text-[var(--muted)]">Loading...</p>
            </div>
        )
    }

    if (!sport) {
        return (
            <main className="flex-1 flex flex-col items-center justify-center p-16 space-y-8">
                <h1 className="text-4xl font-semibold">Select a sport to begin!</h1>
                <div className="flex justify-center space-x-4 w-2/3 p-8 border rounded-xl">
                    <img onClick={() => setSport("Soccer")} src="/images/soccer.png" alt="Soccer Ball" className="w-1/5 max-w-30 hover:scale-105 cursor-pointer"/>
                    <img onClick={() => setSport("Basketball")} src="/images/basketball.png" alt="Basketball" className="w-1/5 max-w-30 hover:scale-105 cursor-pointer"/>
                    <img onClick={() => setSport("Tennis")} src="/images/tennis.png" alt="Tennis Ball" className="w-1/5 max-w-30 hover:scale-105 cursor-pointer"/>
                    <img onClick={() => setSport("Volleyball")} src="/images/volleyball.png" alt="Volleyball" className="w-1/5 max-w-30 hover:scale-105 cursor-pointer"/>
                    <img onClick={() => setSport("Baseball")} src="/images/baseball.png" alt="Baseball" className="w-1/5 max-w-30 hover:scale-105 cursor-pointer"/>
                </div>
            </main>
        )
    }

    return (
        <main className="flex-1 flex flex-col items-center w-full h-full space-y-16 p-16">
            <div className="flex justify-center w-1/3">
                <input 
                    placeholder={`Untitled ${sport} Session`} 
                    className="w-full text-center bg-[var(--primary)] placeholder-[var(--muted)] rounded-lg p-2 border"
                />
            </div>
            <div className="flex-1 flex justify-between w-full h-4/5 space-x-16">
                <div className="flex flex-col border w-3/5 p-8 rounded-2xl shadow-lg">
                    <div className="flex flex-col items-center h-full">
                        
                    </div>
                </div>
                <div className="flex-1 flex flex-col border min-w-80 p-8 rounded-2xl shadow-lg">
                    <div className="flex flex-col items-center h-full">
                        <h2 className="text-2xl font-medium mb-4">Saved {type} Drills</h2>
                        {fetching && <div className="flex-1 flex items-center justify-center">
                            <p className="text-xl text-[var(--muted)]">Loading...</p>
                        </div>}
                        {!drills.length && !fetching && <p className="flex-1 flex items-center justify-center text-xl text-[var(--muted)]">
                            No drills found
                        </p>}
                        {!!drills.length && !fetching && <div className="flex flex-col space-y-8 overflow-y-auto">
                            {drills.map((drill, index) => (
                                <DrillCard key={index} drillInfo={drill} />
                            ))}
                        </div>}
                    </div>
                </div>
            </div>
            <div className="flex justify-end w-full space-x-4">
                <button onClick={() => {setSport(""); setType("Warmup");}} className="flex items-center bg-red-500 rounded-lg p-3 cursor-pointer hover:scale-105">
                    <FaTrash className="mr-2" />
                    <p>Discard</p>
                </button>
                <button className="flex items-center bg-[var(--accent)] rounded-lg p-3 cursor-pointer hover:scale-105">
                    <FaPlay className="mr-2" />
                    Begin!
                </button>
            </div>
            
            <DrillModal preview={false} />
        </main>
    )
}