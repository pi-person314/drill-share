"use client";
import DrillCard from "@/components/DrillCard";
import DrillModal from "@/components/DrillModal";
import TrainingSection from "@/components/TrainingSection";
import { useAuth } from "@/hooks/auth";
import { useDrill } from "@/hooks/drill";
import { DrillType } from "@/types/drill";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaPlay, FaRunning, FaTrash } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { PiStrategy } from "react-icons/pi";
import { v4 as uuidv4 } from "uuid";

export default function NewSession() {
    const searchParams = useSearchParams();
    const { user, loading } = useAuth();
    const { drills, setDrills } = useDrill();
    const router = useRouter();
    const [ sport, setSport ] = useState("");
    const [ type, setType ] = useState("");
    const [ fetchingTraining, setFetchingTraining ] = useState(true);
    const [ fetching, setFetching ] = useState(true);
    const [ sections, setSections ] = useState<{id: string, type: string, drillInfo: DrillType | null}[]>([]);
    const [ warmup, setWarmup ] = useState<DrillType | null>(null);
    const [ cooldown, setCooldown ] = useState<DrillType | null>(null);
    const [ title, setTitle ] = useState("");
    const [ error, setError ] = useState("");

    const handleRemove = (id: string) => {
        setSections(sections.filter((s) => s.id !== id));
        if (type === sections.find((s) => s.id === id)?.type) setType("");
    }

    const handleDiscard = () => {
        setSport("");
        setType("");
        setWarmup(null);
        setCooldown(null);
        setSections([]);
        setError("");
        setTitle("");
    }

    const handleCreate = async () => {
        if (!warmup || !cooldown) {
            setError("A warmup and cooldown drill are required.");
            return;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/training`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title || `Untitled ${sport} Session`, 
                drills: [warmup._id, ...sections.map((s) => s.drillInfo?._id), cooldown._id], 
                creator: user,
                sport: sport,
                videos: Array.from({length: sections.length + 2}, () => ""),
                notes: Array.from({length: sections.length + 2}, () => "")
            })
        });

        const data = await res.json();
        if (res.ok) {
            router.push(`/training/${data.data._id}/0`);
        } else {
            setError(data.message);
        }
    }

    useEffect(() => {
        if (!user && !loading) router.replace("/");
        const fetchTraining = async () => {
            setFetchingTraining(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/training/${searchParams.get("id")}`);
            if (res.ok) {
                const data = await res.json();
                setSport(data.data.sport);
                setWarmup(data.data.drills[0]);
                setCooldown(data.data.drills[data.data.drills.length - 1]);
                setSections(data.data.drills.slice(1, data.data.drills.length - 1).map((drill: DrillType) => ({id: drill._id, type: drill.type, drillInfo: drill})));
                setTitle(data.data.title + " (Copy)");
            }
            setFetchingTraining(false);
        }
        fetchTraining();
    }, [user, loading]);

    useEffect(() => {
        if (!sport || !type) {
            setDrills([]);
            return;
        }
        const fetchDrills = async () => {
            setFetching(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/drills/saved/${user}`);
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
        
    if (!user || loading || fetchingTraining) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-3xl text-[var(--muted)] animate-pulse">Loading...</p>
            </div>
        )
    }

    if (!sport) {
        return (
            <main className="flex-1 flex flex-col items-center justify-center p-16 space-y-8">
                <h1 className="text-2xl md:text-4xl text-center font-semibold">Select a sport to begin!</h1>
                <div className="flex flex-col space-y-8 w-full lg:w-2/3 max-w-300 p-4 lg:p-8 border rounded-xl shadow-lg">
                    <div className="flex justify-evenly space-x-2 lg:space-x-6 w-full">
                        <div className="flex-1 w-full max-w-30 hover:scale-110 cursor-pointer object-contain">
                            <img onClick={() => setSport("Soccer")} src="/images/soccer.png" alt="Soccer Ball"/>
                        </div>
                        <div className="flex-1 w-full max-w-30 hover:scale-110 cursor-pointer object-contain">
                            <img onClick={() => setSport("Basketball")} src="/images/basketball.png" alt="Basketball"/>
                        </div>
                        <div className="flex-1 w-full max-w-30 hover:scale-110 cursor-pointer object-contain">
                            <img onClick={() => setSport("Tennis")} src="/images/tennis.png" alt="Tennis Ball"/>
                        </div>
                        <div className="flex-1 w-full max-w-30 hover:scale-110 cursor-pointer object-contain">
                            <img onClick={() => setSport("Volleyball")} src="/images/volleyball.png" alt="Volleyball"/>
                        </div>
                        <div className="flex-1 w-full max-w-30 hover:scale-110 cursor-pointer object-contain">
                            <img onClick={() => setSport("Baseball")} src="/images/baseball.png" alt="Baseball"/>
                        </div>
                    </div>
                    <div className="flex justify-evenly space-x-2 lg:space-x-6 w-full">
                        <div className="flex-1 w-full max-w-30 hover:scale-110 cursor-pointer object-contain">
                            <img onClick={() => setSport("Hockey")} src="/images/hockey.png" alt="Hockey Puck"/>
                        </div>
                        <div className="flex-1 w-full max-w-30 hover:scale-110 cursor-pointer object-contain">
                            <img onClick={() => setSport("Golf")} src="/images/golf.png" alt="Golf Ball"/>
                        </div>
                        <div className="flex-1 w-full max-w-30 hover:scale-110 cursor-pointer object-contain">
                            <img onClick={() => setSport("Cricket")} src="/images/cricket.png" alt="Cricket Ball"/>
                        </div>
                        <div className="flex-1 w-full max-w-30 hover:scale-110 cursor-pointer object-contain">
                            <img onClick={() => setSport("Football")} src="/images/football.png" alt="Football"/>
                        </div>
                        <div className="flex-1 w-full max-w-30 hover:scale-110 cursor-pointer object-contain">
                            <img onClick={() => setSport("Badminton")} src="/images/badminton.png" alt="Badminton Birdie"/>
                        </div>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="flex-1 flex justify-center w-full p-16 pr-0">
            <div className="flex flex-col items-center justify-between w-full max-w-400 space-y-16 p-1 pr-16 overflow-y-auto">
                <div className="flex justify-center w-2/3 xl:w-1/3">
                    <input 
                        placeholder={`Untitled ${sport} Session`} 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full text-center bg-[var(--primary)] placeholder-[var(--muted)] rounded-lg p-2 border"
                    />
                </div>

                <div className="flex flex-col xl:flex-row items-center xl:items-start w-full space-y-16 xl:h-4/5 xl:space-y-0 xl:space-x-8">
                    <div className="flex flex-col items-center w-full h-full xl:w-2/5 min-w-80 xl:min-w-120 max-w-160 space-y-8 px-4 xl:overflow-y-auto" style={{scrollbarWidth: "none"}}>
                        <TrainingSection type="Warmup" drillInfo={warmup} setDrillInfo={setWarmup} onClick={() => setType("Warmup")}/>
                        {sections.map((section) => (
                            <TrainingSection 
                                key={section.id} 
                                drillInfo={section.drillInfo} 
                                setDrillInfo={(drill) => setSections(sections.map((s) => s.id === section.id ? { ...s, drillInfo: drill } : s))} 
                                type={section.type} 
                                onClick={() => setType(section.type)} 
                                handleRemove={() => handleRemove(section.id)} 
                            />
                        ))}
                        <div className="flex justify-center space-x-4">
                            <button onClick={() => setSections([...sections, {id: uuidv4(), type: "Technique", drillInfo: null}])} className="flex justify-center items-center bg-[var(--accent)] rounded-lg p-4 cursor-pointer hover:scale-105">
                                <p className="hidden md:block">Add Technique</p> <FaGear className="md:ml-2 text-2xl"/>
                            </button>
                            <button onClick={() => setSections([...sections, {id: uuidv4(), type: "Conditioning", drillInfo: null}])} className="flex justify-center items-center bg-[var(--accent)] rounded-lg p-4 cursor-pointer hover:scale-105">
                                <p className="hidden md:block">Add Conditioning</p> <FaRunning className="md:ml-2 text-2xl"/>
                            </button>
                            <button onClick={() => setSections([...sections, {id: uuidv4(), type: "Strategy", drillInfo: null}])} className="flex justify-center items-center bg-[var(--accent)] rounded-lg p-4 cursor-pointer hover:scale-105">
                                <p className="hidden md:block">Add Strategy</p> <PiStrategy className="md:ml-2 text-3xl"/>
                            </button>
                        </div>
                        <TrainingSection type="Cooldown" drillInfo={cooldown} setDrillInfo={setCooldown} onClick={() => setType("Cooldown")}/>
                    </div>

                    <div className="flex-1 border p-8 px-2 w-full h-full rounded-2xl shadow-lg">
                        {!type && <p className="flex-1 flex items-center justify-center text-center h-full text-xl text-[var(--muted)] px-8">
                            Click a section to see matching drills!
                        </p>}
                        {type && <div className="flex-1 flex flex-col items-center h-full">
                            <h2 className="text-2xl font-medium mb-6">Saved {type} Drills</h2>
                            {fetching && <div className="flex-1 flex items-center">
                                <p className="text-xl text-[var(--muted)] animate-pulse">Loading...</p>
                            </div>}
                            {!drills.length && !fetching && <p className="flex-1 flex items-center text-xl text-[var(--muted)]">
                                No drills found
                            </p>}
                            {!!drills.length && !fetching && <div className="grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] lg:grid-cols-[repeat(auto-fit,minmax(17.5rem,1fr))] justify-items-center w-full gap-16 overflow-x-hidden overflow-y-auto">
                                {drills.map((drill, index) => (
                                    <DrillCard key={index} drillInfo={drill} />
                                ))}
                            </div>}
                        </div>}
                    </div>
                </div>

                <div className="flex justify-end w-full space-x-4">
                    <button onClick={handleDiscard} className="flex items-center bg-red-500 rounded-lg p-3 cursor-pointer hover:scale-105">
                        <FaTrash className="mr-2" />
                        <p>Discard</p>
                    </button>
                    <button onClick={handleCreate} className="flex items-center bg-[var(--accent)] rounded-lg p-3 cursor-pointer hover:scale-105">
                        <FaPlay className="mr-2" />
                        Begin!
                    </button>
                </div>

                {error && <div className="flex justify-end w-full -mt-12">
                    <p className="text-lg text-[var(--danger)]">{error}</p>
                </div>}
            </div>
            
            <DrillModal preview={false} />
        </main>
    )
}