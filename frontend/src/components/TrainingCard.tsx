import { TrainingType } from "@/types/training";
import { useRouter } from "next/navigation";
import DrillCard from "./DrillCard";
import DrillModal from "./DrillModal";
import { FaTrash } from "react-icons/fa6";
import { toast } from "react-toastify";

export default function TrainingCard({ trainingInfo, trigger, setTrigger }: { trainingInfo: TrainingType, trigger?: boolean, setTrigger?: (val: boolean) => void }) {
    const router = useRouter();
    const created = new Date(trainingInfo.updatedAt).toLocaleDateString();
    const today = new Date().toLocaleDateString();
    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleDateString();

    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        const res = await fetch(`http://localhost:5000/api/training/${trainingInfo._id}`, {method: "DELETE"});
        if (res.ok) {
            toast.error("Deleted!");
            if (setTrigger) setTrigger(!trigger);
        }
    }

    return (
        <div>
            <div 
                onClick={() => router.push(`/training/${trainingInfo._id}/0`)} 
                className="flex justify-evenly bg-[var(--primary)] rounded-xl cursor-pointer p-8 w-180 h-100 space-x-8 duration-300 hover:shadow-xl relative"
            >
                {setTrigger && <div className="absolute top-5 left-4">
                    <button onClick={handleDelete} className="text-2xl cursor-pointer text-[var(--muted)] hover:text-[var(--danger)]"><FaTrash /></button>
                </div>}
                <div className="flex flex-col justify-center items-center space-y-2 w-2/5">
                    <h1 className="text-3xl font-semibold text-center w-full break-words line-clamp-3">{trainingInfo.title}</h1>
                    <p className="text-lg text-center text-[var(--muted)] w-full">{trainingInfo.drills.length} drills</p>
                    <p className="text-lg text-center text-[var(--muted)] w-full">
                        {created === today ? "Today" : created === yesterday ? "Yesterday" : created}
                    </p>
                </div> 
                <div className="flex flex-col w-80 space-y-6 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
                    {trainingInfo.drills.map((drill, index) => (
                        <DrillCard key={index} drillInfo={drill} />
                    ))}
                </div>
            </div>
            <DrillModal preview={true} /> 
        </div>
    )
}