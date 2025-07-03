import ReactModal from "react-modal";
import { FaThumbsUp, FaDownload } from 'react-icons/fa';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useAuth } from "@/context/auth";
import { useEffect } from "react";
import { useDrill } from "@/context/drill";

export default function DrillModal() {
    const { user } = useAuth();
    const { drills, setDrills, selectedDrill, setSelectedDrill, selectedUsername, setSelectedUsername } = useDrill();

    const handleLike = async ( increase: boolean ) => {
        if (!selectedDrill || !user) return;
        const res = await fetch(`http://localhost:5000/api/drills/${selectedDrill._id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                ...selectedDrill, 
                likes: selectedDrill.likes + (increase ? 1 : -1), 
                usersLiked: increase ? [...selectedDrill.usersLiked, user] : selectedDrill.usersLiked.filter(id => id != user)
            })
        }); 
        if (res.ok) {
            setSelectedDrill({
                ...selectedDrill,
                likes: selectedDrill.likes + (increase ? 1 : -1),
                usersLiked: increase ? [...selectedDrill.usersLiked, user] : selectedDrill.usersLiked.filter(id => id != user)
            });
            setDrills(drills.map(drill =>
                (drill._id === selectedDrill._id) ? { 
                    ...drill, 
                    likes: drill.likes + (increase ? 1 : -1),
                    usersLiked: increase ? [...drill.usersLiked, user] : drill.usersLiked.filter(id => id != user)
                } : drill
            ));
        }
    }

    useEffect(() => ReactModal.setAppElement("body"));

    if (!user) return null;

    return (
        // TODO: profile browsing and saving
        <ReactModal
            isOpen={!!selectedDrill}
            className="bg-[var(--secondary)] rounded-2xl shadow-lg px-12 py-8 w-1/2 max-h-5/6 overflow-y-auto"
            overlayClassName="fixed inset-0 flex items-center justify-center bg-[rgba(130,146,151,0.8)]"
        >
            {selectedDrill && <div className="flex flex-col space-y-12 h-full">
                <div className="flex justify-end mb-0">
                    <button className="cursor-pointer hover:text-[var(--danger)] text-3xl" onClick={() => {
                        setSelectedDrill(null);
                        setSelectedUsername(null);
                    }}>x</button>
                </div>
                
                <div className="flex">
                    <h1 className="text-5xl">{selectedDrill.name}</h1>
                    <button onClick={() => selectedDrill.usersLiked.includes(user) ? handleLike(false) : handleLike(true)} className="flex items-center ml-10 text-xl">
                        {selectedDrill.likes}<FaThumbsUp className={`ml-2 cursor-pointer ${selectedDrill.usersLiked.includes(user) ? "text-green-500" : "hover:text-[var(--muted)]"}`}/>
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
    )
}