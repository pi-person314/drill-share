import ReactModal from "react-modal";
import { FaThumbsUp, FaDownload } from 'react-icons/fa';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useAuth } from "@/context/auth";
import { useDrill } from "@/context/drill";

export default function DrillModal({ preview } : { preview: boolean }) {
    const { user } = useAuth();
    const { drills, setDrills, selectedDrill, setSelectedDrill, selectedUsername, setSelectedUsername } = useDrill();

    const handleLike = async ( add: boolean ) => {
        if (!selectedDrill || !user) return;
        const res = await fetch(`http://localhost:5000/api/drills/${selectedDrill._id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                ...selectedDrill, 
                likes: selectedDrill.likes + (add ? 1 : -1), 
                usersLiked: add ? [...selectedDrill.usersLiked, user] : selectedDrill.usersLiked.filter(id => id != user)
            })
        });
        if (res.ok) {
            setSelectedDrill({
                ...selectedDrill,
                likes: selectedDrill.likes + (add ? 1 : -1),
                usersLiked: add ? [...selectedDrill.usersLiked, user] : selectedDrill.usersLiked.filter(id => id != user)
            });
            setDrills(drills.map(drill =>
                (drill._id === selectedDrill._id) ? { 
                    ...drill, 
                    likes: drill.likes + (add ? 1 : -1),
                    usersLiked: add ? [...drill.usersLiked, user] : drill.usersLiked.filter(id => id != user)
                } : drill
            ));
        }
    }

    const handleSave = async ( add: boolean) => {
        if (!selectedDrill || !user) return;
        const res = await fetch(`http://localhost:5000/api/drills/${selectedDrill._id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                ...selectedDrill, 
                usersSaved: add ? [...selectedDrill.usersSaved, user] : selectedDrill.usersSaved.filter(id => id != user)
            })
        });
        if (res.ok) {
            setSelectedDrill({
                ...selectedDrill,
                usersSaved: add ? [...selectedDrill.usersSaved, user] : selectedDrill.usersSaved.filter(id => id != user)
            });
            setDrills(drills.map(drill =>
                (drill._id === selectedDrill._id) ? { 
                    ...drill, 
                    usersSaved: add ? [...drill.usersSaved, user] : drill.usersSaved.filter(id => id != user)
                } : drill
            ));
        }
    };

    if (!user) return null;

    return (
        // TODO: profile browsing, add alert when saved
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
                    <h1 className="text-5xl font-medium">{selectedDrill.name}</h1>
                    <button onClick={() => preview ? {} : selectedDrill.usersLiked.includes(user) ? handleLike(false) : handleLike(true)} className="flex items-center ml-10 text-xl">
                        {selectedDrill.likes}<FaThumbsUp className={`ml-2 ${preview ? "" : selectedDrill.usersLiked.includes(user) ? "cursor-pointer text-green-500" : "cursor-pointer hover:text-[var(--muted)]"}`}/>
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
                    <p>Creator:<span className={`bg-[var(--accent)] ml-3 p-3 rounded-lg ${preview ? "" : "cursor-pointer hover:text-[var(--muted)]"}`}>{selectedUsername}</span></p>
                    <button 
                        onClick={() => preview ? {} : selectedDrill.usersSaved.includes(user) ? handleSave(false) : handleSave(true)} 
                        className={`flex items-center bg-[var(--primary)] p-3 rounded-lg ${preview ? "" : "cursor-pointer hover:scale-105"}`}
                    >
                        <FaDownload className="mr-2"/>{selectedDrill.usersSaved.includes(user) ? "Unsave" : "Save"}
                    </button>
                </div>
            </div>}
        </ReactModal>
    )
}