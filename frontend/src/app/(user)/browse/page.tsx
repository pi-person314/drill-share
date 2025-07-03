"use client";
import DrillCard from "@/components/DrillCard";
import { useAuth } from "@/context/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { FaThumbsUp, FaDownload } from 'react-icons/fa';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Browse() {
    type FullDrillType = {
        _id: string;
        name: string;
        description: string;
        creator: string;
        usersLiked: string[],
        public: boolean;
        media: string[];
        time: number;
        sports: string[];
        difficulty: string;
        likes: number;
    }

    type DrillType = {
        _id: string;
        name: string;
        thumbnail: string;
        creator: string;
        usersLiked: string[],
        likes: number;
    };

    const [ fullDrills, setFullDrills ] = useState<FullDrillType[]>([]);
    const [ drills, setDrills ] = useState<DrillType[]>([]);
    const [ selectedDrill, setSelectedDrill ] = useState<FullDrillType | null>(null);
    const [ usernames, setUsernames ] = useState<String[]>([]);
    const [ selectedUsername, setSelectedUsername ] = useState<String | null>(null);
    const { user, loading } = useAuth();
    const router = useRouter();

    const getUsername = async ( uid: string ) => {
        const res = await fetch(`http://localhost:5000/api/users/${uid}`);
        if (res.ok) {
            const data = await res.json();
            return data.data.username;
        } else {
            return "Deleted User";
        }
    }

    const handleLike = async () => {
        if (!selectedDrill) return;
        const res = await fetch(`http://localhost:5000/api/drills/${selectedDrill._id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                ...selectedDrill, 
                likes: selectedDrill.likes + 1, 
                usersLiked: [...selectedDrill.usersLiked, user]
            })
        }); 
        if (res.ok) {
            if (user) {
                setSelectedDrill({
                    ...selectedDrill,
                    likes: selectedDrill.likes + 1,
                    usersLiked: [...selectedDrill.usersLiked, user]
                });
                setFullDrills(fullDrills.map(drill =>
                    (drill._id === selectedDrill._id) ? { 
                        ...drill, 
                        likes: drill.likes + 1,
                        usersLiked: [...drill.usersLiked, user] 
                    } : drill
                ));
                setDrills(drills.map(drill =>
                    (drill._id === selectedDrill._id) ? { 
                        ...drill, 
                        likes: drill.likes + 1,
                        usersLiked: [...drill.usersLiked, user] 
                    } : drill
                ));
            }
        }
    }

    useEffect(() => {
        if (!user && !loading) router.replace("/");
        ReactModal.setAppElement('body');
        const fetchDrills = async () => {
            const res = await fetch("http://localhost:5000/api/drills/public");
            if (res.ok) {
                const data = await res.json();
                const allUsernames = await Promise.all(
                    data.data.map(async (drill: FullDrillType) => await getUsername(drill.creator))
                );
                const filteredData = data.data.map((drill: FullDrillType, index: number) => ({
                    _id: drill._id,
                    name: drill.name,
                    thumbnail: drill.media[0] || "/images/defaultThumbnail.png",
                    creator: allUsernames[index],
                    usersLiked: drill.usersLiked,
                    likes: drill.likes
                }));
                setFullDrills(data.data);
                setDrills(filteredData);
                setUsernames(allUsernames);
            }
        }
        fetchDrills();
    }, [user]);
    
    if (!user) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-3xl text-[var(--muted)]">Loading...</p>
            </div>
        )
    }

    if (!drills.length) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-3xl text-[var(--muted)] text-center">
                    No drills have been shared yet.<br/>
                    Become the first by creating your own{" "}
                    <Link href="/drills#my-drills" className="text-[var(--link)] underline">here!</Link>
                </p>
            </div>
        )
    }

    return (
        <div className="flex-1 grid [grid-template-columns:repeat(auto-fit,minmax(24rem,1fr))] overflow-y-auto auto-rows-max gap-y-20 p-10 justify-items-center">
            {drills.map((drill, index) => (
                <DrillCard key={index} drillInfo={drill} onClick={() => {
                    setSelectedDrill(fullDrills[index]);
                    setSelectedUsername(usernames[index]);
                }}/>
            ))}
            
            {/* TODO: add liking, profile browsing, and saving */}
            <ReactModal
                isOpen={!!selectedDrill}
                className="bg-[var(--secondary)] rounded-2xl shadow-lg px-12 py-8 w-1/2 max-h-5/6 overflow-y-auto"
                overlayClassName="fixed inset-0 flex items-center justify-center bg-[rgba(130,146,151,0.8)]"
            >
                {selectedDrill && <div className="flex flex-col space-y-12 h-full">
                    <button className="flex justify-end cursor-pointer hover:text-[var(--danger)] text-3xl mb-0" onClick={() => {
                        setSelectedDrill(null);
                        setSelectedUsername(null);
                    }}>x</button>
                    <div className="flex">
                        <h1 className="text-5xl">{selectedDrill.name}</h1>
                        <button onClick={selectedDrill.usersLiked && selectedDrill.usersLiked.includes(user) ? () => {} : handleLike} className="flex items-center ml-10 text-xl">
                            {selectedDrill.likes}<FaThumbsUp className={`ml-2 ${selectedDrill.usersLiked && selectedDrill.usersLiked.includes(user) ? "text-green-500" : "hover:text-[var(--muted)] cursor-pointer"}`}/>
                        </button>
                    </div>
                    <div className="flex space-x-3 -mt-8">
                        {selectedDrill.sports.map((sport, index) => (
                            <h2 key={index} className="bg-[var(--accent)] p-2 rounded-xl">{sport}</h2>
                        ))}
                        {selectedDrill.difficulty && <h2 className="bg-[var(--accent)] p-2 rounded-xl">{selectedDrill.difficulty}</h2>}
                        {selectedDrill.time > 0 && <h2 className="bg-[var(--accent)] p-2 rounded-xl">{selectedDrill.time} min</h2>}
                    </div>
                    <div>
                        <h2 className="text-2xl mb-2">Description</h2>
                        <p className="whitespace-pre-line truncate max-h-40 overflow-y-auto">{selectedDrill.description}</p>
                    </div>
                    {!!selectedDrill.media.length && <div>
                        <h2 className="text-2xl mb-2">Media</h2>
                        <Slider infinite={false} speed={1000} arrows={false} dots={true} className="w-1/2 bg-[var(--primary)] py-8 rounded-xl">
                            {selectedDrill.media.map((image, index) => (
                                <img key={index} src={image} alt={`Image ${index}`} className="h-40 object-contain"/>
                            ))}
                        </Slider>
                    </div>}
                    <div className="flex justify-between items-center mt-8">
                        <p>Creator:<span className="bg-[var(--accent)] hover:text-[var(--muted)] cursor-pointer ml-3 p-3 rounded-lg">{selectedUsername}</span></p>
                        <button className="flex items-center bg-[var(--primary)] hover:scale-105 cursor-pointer p-3 rounded-lg"><FaDownload className="mr-2"/>Save</button>
                    </div>
                </div>}
            </ReactModal>
        </div>
    )
}