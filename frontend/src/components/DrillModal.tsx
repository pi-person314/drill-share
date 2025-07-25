import ReactModal from "react-modal";
import { FaThumbsUp, FaDownload, FaEdit, FaTrash } from 'react-icons/fa';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useAuth } from "@/hooks/auth";
import { useDrill } from "@/hooks/drill";
import { useState } from "react";
import CreateModal from "./CreateModal";
import { toast } from "react-toastify";
import { FaXmark } from "react-icons/fa6";

export default function DrillModal({ preview, open, setOpen } : { preview: boolean, open?: boolean, setOpen?: (val: boolean) => void }) {
    const { user } = useAuth();
    const { drills, setDrills, selectedDrill, setSelectedDrill } = useDrill();
    const [ updateOpen, setUpdateOpen ] = useState(false);

    const handleLike = async ( add: boolean ) => {
        if (!selectedDrill || !user) return;
        const res = await fetch(`http://localhost:5000/api/drills/interactions/${selectedDrill._id}`, {
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
        const res = await fetch(`http://localhost:5000/api/drills/interactions/${selectedDrill._id}`, {
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
        }
    }

    if (!user) return null;

    return (
        <div onClick={e => e.stopPropagation()}>
            <ReactModal
                isOpen={open ?? !!selectedDrill}
                className={`${preview ? "z-3" : "z-1"} bg-[var(--secondary)] rounded-2xl shadow-lg px-12 pt-16 pb-8 w-3/4 max-w-200 max-h-5/6 overflow-y-auto relative`}
                overlayClassName={`${preview ? "z-3" : "z-1"} fixed inset-0 flex items-center justify-center bg-[rgba(130,146,151,0.8)]`}
                ariaHideApp={false}
            >
                
                {selectedDrill && <div className="flex flex-col space-y-12 h-full">
                    <div className="absolute right-4 top-4">
                        <button className="cursor-pointer duration-300 hover:text-[var(--danger)] text-3xl" onClick={
                            () => {setOpen ? setOpen(false) : setSelectedDrill(null)}
                        }><FaXmark /></button>
                    </div>
                    
                    <div className="flex">
                        <h1 className="text-5xl font-medium truncate">{selectedDrill.title}</h1>
                        <button onClick={() => preview ? {} : selectedDrill.usersLiked.includes(user) ? handleLike(false) : handleLike(true)} className="flex items-center ml-10 text-xl">
                            {selectedDrill.likes}<FaThumbsUp className={`ml-2 duration-300 ${preview ? "" : "cursor-pointer"} ${selectedDrill.usersLiked.includes(user) ? "text-[var(--success)]" : "hover:text-[var(--muted)]"}`}/>
                        </button>
                    </div>
                    <div className="flex space-x-3 -mt-8">
                        {selectedDrill.sports.map((sport, index) => (
                            <h2 key={index} className="bg-[var(--accent)] p-2 rounded-xl">{sport}</h2>
                        ))}
                        <h2 className="bg-[var(--accent)] p-2 rounded-xl">{selectedDrill.type}</h2>
                        <h2 className="bg-[var(--accent)] p-2 rounded-xl">{selectedDrill.difficulty}</h2>
                        <h2 className="bg-[var(--accent)] p-2 rounded-xl">{selectedDrill.time} min</h2>
                    </div>
                    <div>
                        <h2 className="text-2xl mb-2">Description</h2>
                        <p className="whitespace-pre-line truncate max-h-40 overflow-y-auto">{selectedDrill.description}</p>
                    </div>
                    {!!selectedDrill.media.length && <div>
                        <h2 className="text-2xl mb-2">Media</h2>
                        <Slider infinite={false} speed={1000} arrows={false} dots={true} className="w-1/2 bg-[var(--primary)] py-8 rounded-xl">
                            {selectedDrill.media.map((image, index) => (
                                <img key={index} src={image} alt={`Image ${index}`} className="h-40 px-8 object-contain"/>
                            ))}
                        </Slider>
                    </div>}
                    <div className="flex justify-between items-center mt-8">
                        <p className="flex items-center w-1/3"><p className="hidden md:block">Creator:</p><span className="bg-[var(--accent)] md:ml-3 p-3 rounded-lg truncate">{selectedDrill.creator.username}</span></p>
                        <div className="flex space-x-4">
                            {user === selectedDrill.creator._id && !preview && <div className="flex space-x-4">
                                <button 
                                    onClick={() => setUpdateOpen(true)} 
                                    className="flex items-center bg-[var(--primary)] p-3 rounded-lg cursor-pointer duration-300 hover:scale-105 hover:text-[var(--success)]"
                                >
                                    <FaEdit className="md:mr-2"/><p className="hidden md:block">Edit</p>
                                </button>
                                <button 
                                    onClick={handleDelete} 
                                    className="flex items-center bg-[var(--primary)] p-3 rounded-lg cursor-pointer duration-300 hover:scale-105 hover:text-[var(--danger)]"
                                >
                                    <FaTrash className="md:mr-2"/><p className="hidden md:block">Delete</p>
                                </button>
                            </div>}
                            <button 
                                onClick={() => preview ? {} : selectedDrill.usersSaved.includes(user) ? handleSave(false) : handleSave(true)} 
                                className={`flex items-center bg-[var(--primary)] p-3 rounded-lg duration-300 ${preview ? "" : "cursor-pointer hover:scale-105 hover:text-[var(--muted)]"}`}
                            >
                                <FaDownload className="md:mr-2"/><p className="hidden md:block">{selectedDrill.usersSaved.includes(user) && !preview ? "Remove" : "Save"}</p>
                            </button>
                        </div>
                    </div>
                </div>}
                <CreateModal update={true} open={updateOpen} setOpen={setUpdateOpen} />
            </ReactModal>
        </div>
    )
}