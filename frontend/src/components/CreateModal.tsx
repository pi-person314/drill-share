"use client";
import { useAuth } from "@/context/auth";
import { useDrill } from "@/context/drill";
import dropdownStyles from "@/styles/dropdown";
import { DrillType } from "@/types/drill";
import { Switch } from "@headlessui/react";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaUpload } from "react-icons/fa";
import ReactModal from "react-modal";
import Select from "react-select";
import DrillModal from "./DrillModal";
import { toast } from "react-toastify";

export default function CreateModal({ update, open, setOpen } : { update: boolean, open: boolean, setOpen: (val: boolean) => void }) {
    const { user, username } = useAuth();
    const { drills, setDrills, selectedDrill, setSelectedDrill, setSelectedUsername } = useDrill();
    const [ error, setError ] = useState("");
    const [ previewOpen, setPreviewOpen ] = useState(false);
    const emptyDrill = {
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
        likes: 0,
        createdAt: "",
        updatedAt: ""
    }
    const [ newDrill, setNewDrill ] = useState<DrillType>(emptyDrill);

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
                if (file.size > 5 * 1024 * 1024) {
                    setError("File too large.");
                } else {
                    setError("");
                    const reader = new FileReader();
                    reader.onload = () => {
                        const res = reader.result as string;
                        setNewDrill(prev => ({...prev, media: [...prev.media, res]}));
                    };
                    reader.readAsDataURL(file);
                }
                
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
            toast.success("Created!");
            setOpen(false);
            setDrills([...drills, data.data]);
            setNewDrill(emptyDrill);
            setError("");
        } else {
            setError(data.message);
        }
    }

    const handleUpdate = async () => {
        if (!selectedDrill) return;
        const res = await fetch(`http://localhost:5000/api/drills/info/${selectedDrill._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newDrill)
        });

        const data = await res.json();
        if (res.ok) {
            toast.info("Updated!");
            setOpen(false);
            setDrills(drills.map(drill => drill._id === selectedDrill._id ? data.data : drill));
            setSelectedDrill(data.data);
            setError("");
        } else {
            setError(data.message);
        }
    }

    const handlePreview = () => {
        if (newDrill.name && newDrill.description) {
            setSelectedDrill(newDrill);
            setSelectedUsername(username);
            setError("");
            setPreviewOpen(true);
        }
        else setError("Please fill in all required fields.");
    }

    useEffect(() => {
        if (update && selectedDrill) setNewDrill(selectedDrill);
    }, [update, selectedDrill]);

    return (
        <ReactModal
            isOpen={open}
            ariaHideApp={false}
            shouldFocusAfterRender={true}
            className={`${update ? "z-2" : "z-0"} bg-[var(--secondary)] rounded-2xl shadow-lg p-12 py-8 w-1/2 max-h-5/6 overflow-y-auto`}
            overlayClassName={`${update ? "z-2" : "z-0"} fixed inset-0 flex items-center justify-center bg-[rgba(130,146,151,0.8)]`}
        >
            <form onSubmit={e => {e.preventDefault(); update ? handleUpdate() : handleCreate();}} className="flex flex-col h-full space-y-4">
                <div className="flex justify-end mb-0">
                    <button type="button" className="cursor-pointer hover:text-[var(--danger)] text-3xl" onClick={() => {setOpen(false); setError("");}}>x</button>
                </div>

                <h1 className="text-5xl font-medium mb-8">{update ? "Update Drill" : "New Drill"}</h1>

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

                <div className="flex justify-between space-x-4">
                    <div className="space-y-1 w-1/3 2xl:w-1/2">
                        <p>Sports <span className="text-[var(--muted)]">(optional)</span></p>
                        <Select 
                            isMulti 
                            options={sportsOptions}
                            value={sportsOptions.filter(option => newDrill.sports.includes(option.value))}
                            onChange={selected => setNewDrill({
                                ...newDrill,
                                sports: (selected as readonly { value: string; label: string }[]).map(option => option.value)
                            })}
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
                            styles={dropdownStyles}
                        />
                    </div>

                    <div className="space-y-1 w-28">
                        <p>Time <span className="text-[var(--muted)]">(minutes)</span></p>
                        <input 
                            type="number"
                            min={1}
                            max={9999}
                            value={newDrill.time > 0 ? newDrill.time : ""}
                            onChange={e => setNewDrill({...newDrill, time: e.target.value === "" ? 0 : Number(e.target.value)})}
                            className="w-full h-[38px] bg-[var(--secondary)] placeholder-[var(--muted)] rounded p-3 border"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <p>Media <span className="text-[var(--muted)]">(up to 5)</span></p>
                    <div {...getRootProps()} className="text-center bg-[var(--secondary)] border border-dashed rounded-lg p-3 w-full h-32">
                        <input {...getInputProps()} />
                        <div className={`flex flex-col justify-center items-center h-full ${isDragActive ? "text-[var(--link)]": "text-[var(--muted)] hover:text-[var(--link)]"}`}>
                            <FaUpload className="text-3xl mb-3"/>
                            {!newDrill.media.length && <p className="text-sm">Drag and drop images here</p>}
                            {!!newDrill.media.length && <div className="flex space-x-2 h-1/2">
                                {newDrill.media.map((image, index) => 
                                    <div key={index} className="relative h-full">
                                        <img src={image} alt="Image Preview" className="h-full w-full object-cover" />
                                        <button type="button" onClick={e => {
                                            e.stopPropagation();
                                            const updated = [...newDrill.media];
                                            updated.splice(index, 1);
                                            setNewDrill({ ...newDrill, media: updated });
                                        }}
                                            className="absolute top-0 right-0 text-[var(--danger)] w-5 h-5 text-3xl flex items-center justify-center cursor-pointer hover:scale-105"
                                        >×</button>
                                    </div>
                                )}
                            </div>}
                        </div>
                    </div>
                </div>

                <div className="flex space-x-4">
                    <p>Public</p>
                    <Switch
                        checked={newDrill.public}
                        onChange={() => setNewDrill({...newDrill, public: !newDrill.public})}
                        className="group inline-flex h-6 w-11 items-center rounded-full bg-[var(--muted)] transition data-checked:bg-[var(--primary)] cursor-pointer"
                    >
                        <span className="size-4 translate-x-1 rounded-full bg-[var(--text)] transition group-data-checked:translate-x-6" />
                    </Switch>
                </div>

                <div className="space-x-4">
                    <button className="bg-[var(--accent)] hover:scale-105 rounded-lg mt-4 p-3 w-min cursor-pointer">{update ? "Update" : "Create"}</button>
                    <button onClick={handlePreview} type="button" className="bg-[var(--primary)] hover:scale-105 rounded-lg mt-4 p-3 w-min cursor-pointer">Preview</button>
                    <button onClick={() => {setNewDrill(emptyDrill); setError("");}} type="button" className="bg-[var(--primary)] hover:scale-105 rounded-lg mt-4 p-3 w-min cursor-pointer">Clear</button>
                </div>
                
                {error && <p className="text-[var(--danger)]">{error}</p>}
            </form>
            {update && <DrillModal preview={true} open={previewOpen} setOpen={setPreviewOpen}/>}
            {!update && <DrillModal preview={true}/>}
        </ReactModal>
    )
}