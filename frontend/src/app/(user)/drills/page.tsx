"use client";
import CreateModal from "@/components/CreateModal";
import DrillCard from "@/components/DrillCard";
import DrillModal from "@/components/DrillModal";
import { useAuth } from "@/context/auth";
import { useDrill } from "@/context/drill";
import { DrillType } from "@/types/drill";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCirclePlus } from "react-icons/fa6";

export default function Drills() {
    const { user, username, loading } = useAuth();
    const { drills, setDrills } = useDrill();
    const router = useRouter();
    const [ createdDrills, setCreatedDrills ] = useState<DrillType[]>([]);
    const [ savedDrills, setSavedDrills ] = useState<DrillType[]>([]);
    const [ savedUsernames, setSavedUsernames ] = useState<string[]>([]);
    const [ fetching, setFetching ] = useState(true);
    const [ createOpen, setCreateOpen ] = useState(false);

    const getUsername = async (uid : string) => {
        const res = await fetch(`http://localhost:5000/api/users/${uid}`);
        if (res.ok) {
            const data = await res.json();
            return data.data.username;
        } else {
            return "Deleted User";
        }
    }

    useEffect(() => {
        if (!user && !loading) router.replace("/");

        const fetchDrills = async () => {
            setFetching(true);
            const createdRes = await fetch(`http://localhost:5000/api/drills/created/${user}`);
            const savedRes = await fetch(`http://localhost:5000/api/drills/saved/${user}`);
            if (createdRes.ok && savedRes.ok) {
                const createdData = await createdRes.json();
                const savedData = await savedRes.json();
                const usernames = await Promise.all(
                    savedData.data.map(async (drill: DrillType) => await getUsername(drill.creator))
                );
                setDrills([...createdData.data, ...savedData.data]);
                setCreatedDrills(createdData.data);
                setSavedDrills(savedData.data);
                setSavedUsernames(usernames);
            }
            setFetching(false);
        }
        fetchDrills();
    }, [user, loading]);

    useEffect(() => {
        const fetchDrills = async () => {
            const createdRes = await fetch(`http://localhost:5000/api/drills/created/${user}`);
            const savedRes = await fetch(`http://localhost:5000/api/drills/saved/${user}`);
            if (createdRes.ok && savedRes.ok) {
                const createdData = await createdRes.json();
                const savedData = await savedRes.json();
                const usernames = await Promise.all(
                    savedData.data.map(async (drill: DrillType) => await getUsername(drill.creator))
                );
                setCreatedDrills(createdData.data);
                setSavedDrills(savedData.data);
                setSavedUsernames(usernames);
            }
        }
        fetchDrills();
    }, [drills])
        
    if (!user || loading || fetching) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-3xl text-[var(--muted)]">Loading...</p>
            </div>
        )
    }

    return (
        <main className="flex-1 flex flex-col justify-evenly p-16 pt-0 overflow-y-auto">
            <div id="my-drills">
                <h1 className="text-3xl font-semibold text-center mt-16 mb-4">My Drills</h1>
                <div className="grid [grid-template-columns:repeat(auto-fit,minmax(24rem,1fr))] justify-items-center overflow-y-auto auto-rows-max gap-y-10 p-8 border">
                    <button onClick={() => setCreateOpen(true)}>
                        <FaCirclePlus className="text-[var(--accent)] text-[10rem] hover:scale-105 cursor-pointer h-60"/>
                    </button>
                    {createdDrills.map((drill, index) => (
                        <DrillCard key={index} drillInfo={drill} username={username} />
                    ))}
                </div>
            </div>

            <div id="saved-drills">
                <h1 className="text-3xl font-semibold text-center mt-16 mb-4">Saved Drills</h1>
                {!!savedDrills.length && <div className="grid [grid-template-columns:repeat(auto-fit,minmax(24rem,1fr))] justify-items-center overflow-y-auto auto-rows-max gap-y-10 p-8 border">
                    {savedDrills.map((drill, index) => (
                        <DrillCard key={index} drillInfo={drill} username={savedUsernames[index]} />
                    ))}
                </div>}
                {!savedDrills.length && <div className="flex items-center justify-center h-70">
                    <p className="text-xl text-[var(--muted)] text-center">
                        No drills have been saved yet.<br/>
                        Feel free to browse through shared drills{" "}
                        <Link href="/browse" className="text-[var(--link)] underline cursor-pointer">here!</Link>
                    </p>
                </div>}
            </div>

            {!createOpen && <DrillModal preview={false}/>}
            <CreateModal open={createOpen} setOpen={setCreateOpen} update={false}/>
        </main>
    )
}