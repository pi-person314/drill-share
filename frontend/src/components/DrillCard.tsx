import { useAuth } from '@/context/auth';
import { useDrill } from '@/context/drill';
import { DrillType } from '@/types/drill';
import { FaThumbsUp } from 'react-icons/fa';
import { IoPerson } from 'react-icons/io5';

export default function DrillCard({ drillInfo }: { drillInfo: DrillType }) {
    const { user } = useAuth();
    const { setSelectedDrill } = useDrill();

    if (!user) return null;

    return (
        <div className="flex flex-col justify-between items-center bg-[var(--secondary)] rounded-xl p-5 h-60 w-80 hover:shadow-xl cursor-pointer" onClick={() => {
            setSelectedDrill(drillInfo); 
        }}>
            <h1 className="text-2xl font-medium text-center w-full truncate mt-2">{drillInfo.title}</h1>
            <img src={drillInfo.media[0] || "/images/defaultThumbnail.png"} alt="Thumbnail" className="w-3/4 max-h-24 object-contain"/>
            <div className="flex flex-row justify-between items-center w-full">
                <p className="flex items-center"><IoPerson className="mr-2"/>{drillInfo.creator.username}</p>
                <p className="flex items-center">{drillInfo.likes}<FaThumbsUp className={`ml-2 ${drillInfo.usersLiked.includes(user) ? "text-[var(--success)]" : ""}`}/></p>
            </div>
        </div>
    )
}