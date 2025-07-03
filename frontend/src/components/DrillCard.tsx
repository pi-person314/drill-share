import { useAuth } from '@/context/auth';
import { FaThumbsUp } from 'react-icons/fa';
import { IoPerson } from 'react-icons/io5';

type drillType = {
    _id: string,
    name: string;
    thumbnail: string;
    creator: string;
    usersLiked: string[];
    likes: number;
}

export default function DrillCard({ drillInfo, onClick }: { drillInfo: drillType, onClick: () => void }) {
    const { user } = useAuth();

    return (
        <div onClick={onClick} className="flex flex-col justify-between items-center bg-[var(--secondary)] rounded-xl p-5 h-60 w-80 hover:shadow-xl cursor-pointer">
            <h1 className="text-2xl text-center w-full truncate mt-2">{drillInfo.name}</h1>
            <img src={drillInfo.thumbnail} alt="Thumbnail" className="w-3/4 max-h-24 object-contain"/>
            <div className="flex flex-row justify-between items-center w-full">
                <p className="flex items-center"><IoPerson className="mr-2"/>{drillInfo.creator}</p>
                <p className="flex items-center">{drillInfo.likes}<FaThumbsUp className={`ml-2 ${drillInfo.usersLiked && user && drillInfo.usersLiked.includes(user) ? "text-green-500" : ""}`}/></p>
            </div>
        </div>
    )
}