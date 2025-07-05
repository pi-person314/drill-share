"use client";
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
    const { user, loading } = useAuth();
    const { drills, setDrills } = useDrill();
    const router = useRouter();
    const [ createdDrills, setCreatedDrills ] = useState<DrillType[]>([]);
    const [ savedDrills, setSavedDrills ] = useState<DrillType[]>([]);
    const [ username, setUsername ] = useState("");
    const [ fetching, setFetching ] = useState(true);

    useEffect(() => {
        if (!user && !loading) router.replace("/");

        const getUsername = async () => {
            const res = await fetch(`http://localhost:5000/api/users/${user}`);
            if (res.ok) {
                const data = await res.json();
                setUsername(data.data.username);
            } else {
                setUsername("Deleted User");
            }
        }
        getUsername();

        const fetchDrills = async () => {
            setFetching(true);
            const createdRes = await fetch(`http://localhost:5000/api/drills/created/${user}`);
            const savedRes = await fetch(`http://localhost:5000/api/drills/saved/${user}`);
            if (createdRes.ok && savedRes.ok) {
                const createdData = await createdRes.json();
                const savedData = await savedRes.json();
                setDrills([...createdData.data, ...savedData.data]);
                setCreatedDrills(createdData.data);
                setSavedDrills(savedData.data);
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
                setCreatedDrills(createdData.data);
                setSavedDrills(savedData.data);
            }
        }
        fetchDrills();
    }, [drills])
        
    if (loading || fetching) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-3xl text-[var(--muted)]">Loading...</p>
            </div>
        )
    }

    return (
        <div className="flex-1 flex flex-col justify-evenly p-16 pt-0 overflow-y-auto">
            <div id="my-drills">
                <h1 className="text-3xl text-center mt-16 mb-4">My Drills</h1>
                <div className="grid [grid-template-columns:repeat(auto-fit,minmax(24rem,1fr))] justify-items-center overflow-y-auto auto-rows-max gap-y-10 p-8 border">
                    {createdDrills.map((drill, index) => (
                        <DrillCard key={index} drillInfo={drill} username={username} />
                    ))}
                    <Link href="/drills#create">
                        <FaCirclePlus className="text-[var(--accent)] text-[10rem] hover:scale-105 cursor-pointer h-60"/>
                    </Link>
                </div>
            </div>

            <div id="saved-drills">
                <h1 className="text-3xl text-center mt-16 mb-4">Saved Drills</h1>
                {!!savedDrills.length && <div className="grid [grid-template-columns:repeat(auto-fit,minmax(24rem,1fr))] justify-items-center overflow-y-auto auto-rows-max gap-y-10 p-8 border">
                    {savedDrills.map((drill, index) => (
                        <DrillCard key={index} drillInfo={drill} username={username} />
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

            <DrillModal /> 
        </div>
    )
}