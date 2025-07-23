"use client";
import DrillCard from "@/components/DrillCard";
import { DrillType } from "@/types/drill";
import { useState } from "react";
import { FaXmark } from "react-icons/fa6";
import { MdCopyAll } from "react-icons/md";

export default function TrainingSection({ type, drillInfo, setDrillInfo, onClick, handleRemove }: { 
    type: string, drillInfo: DrillType | null, setDrillInfo: (drill: DrillType | null) => void, onClick: () => void, handleRemove?: () => void 
}) {
    const [ hovering, setHovering ] = useState(false);
    
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const drill = JSON.parse(e.dataTransfer.getData("application/json")) as DrillType;
        setHovering(false);
        if (drill.type === type) setDrillInfo(drill);
    }

    return (
        <div tabIndex={0} onClick={onClick} className="flex flex-col items-center bg-[var(--primary)] space-y-4 p-8 w-full rounded-xl focus:border focus:border-[var(--link)] relative">
            {handleRemove && <button className="absolute top-3 left-3 cursor-pointer text-[var(--danger)] text-2xl" onClick={(e) => {e.stopPropagation(); handleRemove();}}><FaXmark /></button>}
            <h1 className="text-2xl font-medium">{type}</h1>
            <div 
                onDragOver={e => {e.preventDefault(); setHovering(true);}}
                onDragLeave={e => {e.preventDefault(); setHovering(false);}}
                onDrop={handleDrop}
            >
                {!drillInfo && <div className={`flex flex-col justify-center items-center bg-[var(--secondary)] border-2 border-dashed h-60 w-70 space-y-2 rounded-xl ${hovering ? "text-[var(--link)]" : "text-[var(--muted)]"}`}>
                    <MdCopyAll className={`text-3xl`}/>
                    <p>Drag and drop a drill here!</p>
                </div>}
                {drillInfo && <DrillCard drillInfo={drillInfo} />}
            </div>
        </div>
    )
}