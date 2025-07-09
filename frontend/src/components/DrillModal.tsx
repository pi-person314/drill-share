import ReactModal from "react-modal";
import { FaThumbsUp, FaDownload, FaEdit, FaTrash } from 'react-icons/fa';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useAuth } from "@/context/auth";
import { useDrill } from "@/context/drill";
import { useState } from "react";
import CreateModal from "./CreateModal";
import { toast, ToastContainer } from "react-toastify";

export default function DrillModal({ preview, open, setOpen } : { preview: boolean, open?: boolean, setOpen?: (val: boolean) => void }) {
    const { user } = useAuth();
    const { drills, setDrills, selectedDrill, setSelectedDrill, selectedUsername, setSelectedUsername } = useDrill();
    const [ updateOpen, setUpdateOpen ] = useState(false);

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

    const handleSave = async ( add: boolean ) => {
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
            if (add) toast.success("Saved!");
            else toast.warning("Removed!");
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

    const handleDelete = async () => {
        if (!selectedDrill) return;
        const res = await fetch(`http://localhost:5000/api/drills/${selectedDrill._id}`, {method: "DELETE"});
        if (res.ok) {
            toast.error("Deleted!");
            setDrills(drills.filter(drill => drill._id != selectedDrill._id));
            setSelectedDrill(null);
            setSelectedUsername(null);
        }
    }

    if (!user) return null;

    return (
        <ReactModal
            isOpen={open ?? !!selectedDrill}
            className={`${preview ? "z-3" : "z-1"} bg-[var(--secondary)] rounded-2xl shadow-lg px-12 py-8 w-1/2 max-h-5/6 overflow-y-auto`}
            overlayClassName={`${preview ? "z-3" : "z-1"} fixed inset-0 flex items-center justify-center bg-[rgba(130,146,151,0.8)]`}
        >
            {selectedDrill && <div className="flex flex-col space-y-12 h-full">
                <div className="flex justify-end mb-0">
                    <button className="cursor-pointer hover:text-[var(--danger)] text-3xl" onClick={
                        setOpen ? () => setOpen(false) : () => {setSelectedDrill(null); setSelectedUsername(null)}
                    }>x</button>
                </div>
                
                <div className="flex">
                    <h1 className="text-5xl font-medium">{selectedDrill.name}</h1>
                    <button onClick={() => preview ? {} : selectedDrill.usersLiked.includes(user) ? handleLike(false) : handleLike(true)} className="flex items-center ml-10 text-xl">
                        {selectedDrill.likes}<FaThumbsUp className={`ml-2 ${preview ? "" : selectedDrill.usersLiked.includes(user) ? "cursor-pointer text-[var(--success)]" : "cursor-pointer hover:text-[var(--muted)]"}`}/>
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
                    <p>Creator:<span className="bg-[var(--accent)] ml-3 p-3 rounded-lg">{selectedUsername}</span></p>
                    <div className="flex space-x-4">
                        {user === selectedDrill.creator && !preview && <div className="flex space-x-4">
                            <button 
                                onClick={() => setUpdateOpen(true)} 
                                className="flex items-center bg-[var(--primary)] p-3 rounded-lg cursor-pointer hover:scale-105 hover:text-[var(--success)]"
                            >
                                <FaEdit className="mr-2"/>Edit
                            </button>
                            <button 
                                onClick={handleDelete} 
                                className="flex items-center bg-[var(--primary)] p-3 rounded-lg cursor-pointer hover:scale-105 hover:text-[var(--danger)]"
                            >
                                <FaTrash className="mr-2"/>Delete
                            </button>
                        </div>}
                        <button 
                            onClick={() => preview ? {} : selectedDrill.usersSaved.includes(user) ? handleSave(false) : handleSave(true)} 
                            className={`flex items-center bg-[var(--primary)] p-3 rounded-lg ${preview ? "" : "cursor-pointer hover:scale-105 hover:text-[var(--muted)]"}`}
                        >
                            <FaDownload className="mr-2"/>{selectedDrill.usersSaved.includes(user) && !preview ? "Remove" : "Save"}
                        </button>
                    </div>
                </div>
            </div>}
            <CreateModal update={true} open={updateOpen} setOpen={setUpdateOpen} />
        </ReactModal>
    )
}