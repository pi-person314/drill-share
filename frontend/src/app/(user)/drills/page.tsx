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
            const createdRes = await fetch(`http://localhost:5000/api/drills/created/${user}`);
            const savedRes = await fetch(`http://localhost:5000/api/drills/saved/${user}`);
            if (createdRes.ok && savedRes.ok) {
                const createdData = await createdRes.json();
                const savedData = await savedRes.json();
                setDrills([...createdData.data, ...savedData.data]);
                setCreatedDrills(createdData.data);
                setSavedDrills(savedData.data);
            }
        }
        fetchDrills();
    }, [user, loading, router, drills]);
        
    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-3xl text-[var(--muted)]">Loading...</p>
            </div>
        )
    }

    return (
        <div className="flex-1 flex flex-col justify-around p-12">
            <div>
                <h1 className="text-3xl text-center">My Drills</h1>
                <div className="grid [grid-template-columns:repeat(auto-fit,minmax(24rem,1fr))] justify-items-center overflow-y-auto auto-rows-max h-70 snap-y snap-mandatory">
                    {createdDrills.map((drill, index) => (
                        <div key={index} className="snap-start p-5">
                            <DrillCard drillInfo={drill} username={username} />
                        </div>
                    ))}
                    <Link href="/drills#create" className="snap-start p-5">
                        <FaCirclePlus className="text-[var(--accent)] text-[10rem] hover:scale-105 cursor-pointer h-60"/>
                    </Link>
                </div>
            </div>

            <div>
                <h1 className="text-3xl text-center">Saved Drills</h1>
                {!!savedDrills.length && <div className="grid [grid-template-columns:repeat(auto-fit,minmax(24rem,1fr))] justify-items-center overflow-y-auto auto-rows-max h-70 snap-y snap-mandatory">
                    {savedDrills.map((drill, index) => (
                        <div key={index} className="snap-start p-5">
                            <DrillCard drillInfo={drill} username={username} />
                        </div>
                    ))}
                </div>}
                {!savedDrills.length && <div className="flex items-center justify-center h-70">
                    <p className="text-xl text-[var(--muted)] text-center">
                        No drills have been saved yet.<br/>
                        Feel free to browse through shared drills{" "}
                        <span onClick={() => router.push("/browse")} className="text-[var(--link)] underline cursor-pointer">here!</span>
                    </p>
                </div>}
            </div>

            <DrillModal /> 
        </div>
    )
}