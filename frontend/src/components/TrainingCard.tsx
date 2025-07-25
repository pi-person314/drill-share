"use client";
import { TrainingType } from "@/types/training";
import { useRouter } from "next/navigation";
import DrillCard from "./DrillCard";
import DrillModal from "./DrillModal";
import { FaCopy, FaTrash } from "react-icons/fa6";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useDrill } from "@/hooks/drill";

export default function TrainingCard({ trainingInfo, trigger, setTrigger }: { trainingInfo: TrainingType, trigger?: boolean, setTrigger?: (val: boolean) => void }) {
    const router = useRouter();
    const { drills } = useDrill();
    const [ trainingDrills, setTrainingDrills ] = useState(trainingInfo.drills);
    const created = new Date(trainingInfo.updatedAt).toLocaleDateString();
    const today = new Date().toLocaleDateString();
    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleDateString();

    const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        router.push(`/training/new?id=${trainingInfo._id}`);
    }

    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        const res = await fetch(`http://localhost:5000/api/training/${trainingInfo._id}`, {method: "DELETE"});
        if (res.ok) {
            toast.error("Deleted!");
            if (setTrigger) setTrigger(!trigger);
        }
    }

    const handleVisit = async () => {
        await fetch(`http://localhost:5000/api/training/visit/${trainingInfo._id}`, {method: "PUT"});
    }

    useEffect(() => {
        setTrainingDrills(trainingDrills.map(trainingDrill => drills.find(drill => drill._id === trainingDrill._id) || trainingDrill));
    }, [drills]);

    return (
        <>
            <div 
                onClick={() => {handleVisit(); router.push(`/training/${trainingInfo._id}/0`)}} 
                className="flex flex-col lg:flex-row justify-between [@media(max-width:1023px)]:items-center bg-[var(--primary)] rounded-xl cursor-pointer p-8 lg:pl-0 w-80 lg:w-130 h-150 lg:h-100 duration-300 hover:shadow-xl relative"
            >
                <div className="absolute top-5 left-4">
                    <button onClick={handleCopy} className="text-2xl cursor-pointer duration-300 text-[var(--muted)] hover:text-[var(--link)]"><FaCopy /></button>
                </div>
                {setTrigger && <div className="absolute top-5 left-12">
                    <button onClick={handleDelete} className="text-2xl cursor-pointer duration-300 text-[var(--muted)] hover:text-[var(--danger)]"><FaTrash /></button>
                </div>}
                <div className="flex-1 flex flex-col justify-center space-y-2 p-6 lg:w-1/3">
                    <h1 className="text-3xl font-semibold text-center w-full break-all line-clamp-3">{trainingInfo.title}</h1>
                    <p className="text-lg text-center text-[var(--muted)] w-full">{trainingInfo.drills.length} drills</p>
                    <p className="text-lg text-center text-[var(--muted)] w-full">
                        Updated {created === today ? "Today" : created === yesterday ? "Yesterday" : created}
                    </p>
                </div> 
                <div className="flex flex-col space-y-6 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
                    {trainingDrills.map((drill, index) => (
                        <DrillCard key={index} drillInfo={drill} />
                    ))}
                </div>
            </div>
            <DrillModal preview={false} /> 
        </>
    )
}