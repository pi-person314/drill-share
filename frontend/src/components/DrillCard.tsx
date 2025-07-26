import { useAuth } from '@/hooks/auth';
import { useDrill } from '@/hooks/drill';
import { DrillType } from '@/types/drill';
import { FaThumbsUp } from 'react-icons/fa';
import { IoPerson } from 'react-icons/io5';

export default function DrillCard({ drillInfo }: { drillInfo: DrillType }) {
    const { user } = useAuth();
    const { setSelectedDrill } = useDrill();

    const handleDrag = (e: React.DragEvent) => {
        e.dataTransfer.setData("application/json", JSON.stringify(drillInfo));
        e.dataTransfer.effectAllowed = "copy";
    }

    if (!user) return null;

    return (
        <div 
            draggable={true}
            onDragStart={handleDrag}
            className="flex flex-col justify-between items-center bg-[var(--secondary)] rounded-xl p-5 w-60 lg:w-70 h-60 min-h-60 [@media(max-height:50rem)]:h-50 [@media(max-height:50rem)]:min-h-50 duration-300 hover:shadow-xl cursor-pointer"
            onClick={(e) => {
                e.stopPropagation();
                setSelectedDrill(drillInfo);
            }}
        >
            <h1 className="text-xl lg:text-2xl font-medium text-center w-full truncate mt-2">{drillInfo.title}</h1>
            <img src={drillInfo.media[0] || "/images/defaultThumbnail.png"} alt="Thumbnail" className="w-3/4 max-h-24 [@media(max-height:50rem)]:max-h-18 object-contain"/>
            <div className="flex flex-row justify-between items-center w-full">
                <p className="flex items-center text-sm lg:text-base w-3/4 space-x-2"><IoPerson /><span className="max-w-2/3 truncate">{drillInfo.creator.username}</span></p>
                <p className="flex items-center text-sm lg:text-base">{drillInfo.likes}<FaThumbsUp className={`ml-2 ${drillInfo.usersLiked.includes(user) ? "text-[var(--success)]" : ""}`}/></p>
            </div>
        </div>
    )
}