"use client";
import { useAuth } from "@/context/auth";
import { useDrill } from "@/context/drill";
import dropdownStyles from "@/styles/dropdown";
import { DrillType } from "@/types/drill";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaUpload } from "react-icons/fa";
import ReactModal from "react-modal";
import Select from "react-select";

export default function CreateModal({open, setOpen} : {open: boolean, setOpen: (val: boolean) => void}) {
    const { user } = useAuth();
    const { drills, setDrills } = useDrill();
    const [ error, setError ] = useState("");
    const [ newDrill, setNewDrill ] = useState<DrillType>({
        name: "",
        description: "",
        creator: user || "Deleted User",
        usersLiked: [],
        usersSaved: [],
        public: false,
        media: [],
        time: 0,
        sports: [],
        difficulty: "",
        likes: 0
    });

    const sportsOptions = [
        { value: "Soccer", label: "Soccer" },
        { value: "Basketball", label: "Basketball" },
        { value: "Tennis", label: "Tennis" },
        { value: "Volleyball", label: "Volleyball" },
        { value: "Baseball", label: "Baseball" }
    ];

    const difficultyOptions = [
        { value: null, label: "None" },
        { value: "Beginner", label: "Beginner" },
        { value: "Amateur", label: "Amateur" },
        { value: "Pro", label: "Pro" }
    ];

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        multiple: true,
        accept: {"image/*": []},
        onDrop: (acceptedFiles) => {
            acceptedFiles = acceptedFiles.slice(0, 5 - newDrill.media.length);
            acceptedFiles.forEach(file => {
                const reader = new FileReader();
                reader.onload = () => setNewDrill({...newDrill, media: [...newDrill.media, reader.result as string]});
                reader.readAsDataURL(file);
            });
        }
    });

    const handleCreate = async () => {
        const res = await fetch("http://localhost:5000/api/drills", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newDrill)
        });

        const data = await res.json();
        if (res.ok) {
            setOpen(false);
            setDrills([...drills, data.data]);
        } else {
            setError(data.message);
        }
    }

    return (
        <ReactModal
            isOpen={open}
            ariaHideApp={false}
            shouldFocusAfterRender={true}
            className="bg-[var(--secondary)] rounded-2xl shadow-lg p-12 py-8 w-1/2 max-h-5/6 overflow-y-auto"
            overlayClassName="fixed inset-0 flex items-center justify-center bg-[rgba(130,146,151,0.8)]"
        >
            <form onSubmit={e => {e.preventDefault(); handleCreate();}} className="flex flex-col h-full space-y-4">
                <div className="flex justify-end mb-0">
                    <button type="button" className="cursor-pointer hover:text-[var(--danger)] text-3xl" onClick={() => {setOpen(false); setError("");}}>x</button>
                </div>

                <h1 className="text-5xl font-medium mb-8">Create Drill</h1>

                <div className="space-y-1">
                    <p>Title <span className="text-[var(--danger)]">*</span></p>
                    <input 
                        placeholder="Title"
                        value={newDrill.name}
                        onChange={e => setNewDrill({...newDrill, name: e.target.value})}
                        className={`w-full bg-[var(--secondary)] placeholder-[var(--muted)] rounded-lg p-3 border ${error && !newDrill.name ? "border-[var(--danger)]" : ""}`}
                    />
                </div>

                <div className="space-y-1">
                    <p>Description <span className="text-[var(--danger)]">*</span></p>
                    <textarea 
                        placeholder="Materials, setup, step-by-step explanation, etc." 
                        rows={5} 
                        value={newDrill.description}
                        onChange={e => setNewDrill({...newDrill, description: e.target.value})}
                        className={`w-full bg-[var(--secondary)] placeholder-[var(--muted)] rounded-lg p-3 border ${error && !newDrill.description ? "border-[var(--danger)]" : ""}`}
                    />
                </div>

                <div className="space-y-1">
                    <p>Sports <span className="text-[var(--muted)]">(optional)</span></p>
                    <Select 
                        isMulti 
                        options={sportsOptions}
                        value={sportsOptions.filter(option => newDrill.sports.includes(option.value))}
                        onChange={selected => setNewDrill({
                            ...newDrill,
                            sports: (selected as readonly { value: string; label: string }[]).map(option => option.value)
                        })}
                        className="w-full" 
                        styles={dropdownStyles}
                    />
                </div>

                <div className="space-y-1">
                    <p>Difficulty <span className="text-[var(--muted)]">(optional)</span></p>
                    <Select  
                        options={difficultyOptions}
                        value={difficultyOptions.find(option => option.value === newDrill.difficulty) || null}
                        onChange={selected => setNewDrill({
                            ...newDrill,
                            difficulty: selected && selected.value ? selected.value : ""
                        })}
                        className="w-full" 
                        styles={dropdownStyles}
                    />
                </div>

                <div className="space-y-1">
                    <p>Time <span className="text-[var(--muted)]">(minutes)</span></p>
                    <input 
                        type="number"
                        min={0}
                        value={newDrill.time}
                        onChange={e => setNewDrill({...newDrill, time: Number(e.target.value)})}
                        className="w-full bg-[var(--secondary)] placeholder-[var(--muted)] rounded-lg p-3 border"
                    />
                </div>

                {/* TODO: add toggle for public/private visibility, figure out how to upload multiple images at a time, add preview */}

                <div className="space-y-1">
                    <p>Media <span className="text-[var(--muted)]">(up to 5)</span></p>
                    <div {...getRootProps()} className="text-center bg-[var(--secondary)] border border-dashed rounded-lg p-3 w-full h-32">
                        <input {...getInputProps()} />
                        <div className={`flex flex-col justify-center items-center h-full cursor-pointer ${isDragActive ? "text-[var(--link)]": "text-[var(--muted)] hover:text-[var(--link)]"}`}>
                            <FaUpload className="text-3xl mb-3"/>
                            {!newDrill.media.length && <p className="text-sm">Drag and drop images here</p>}
                            {!!newDrill.media.length && <div className="flex space-x-2 h-1/2">
                                {newDrill.media.map((image, index) => <img key={index} src={image} alt="Image Preview" className="h-full object-contain"/>)}
                            </div>}
                        </div>
                    </div>
                </div>

                <button className="bg-[var(--accent)] hover:scale-105 rounded-lg mt-4 p-3 w-min cursor-pointer">Submit</button>
                {error && <p className="text-[var(--danger)]">{error}</p>}
            </form>
        </ReactModal>
    )
}