"use client";
import { useDrill } from "@/hooks/drill";
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
import { useAuth } from "@/hooks/auth";
import { FaXmark } from "react-icons/fa6";

export default function CreateModal({ update, open, setOpen } : { update: boolean, open: boolean, setOpen: (val: boolean) => void }) {
    const { user, username } = useAuth();
    const { drills, setDrills, selectedDrill, setSelectedDrill } = useDrill();
    const [ error, setError ] = useState("");
    const [ previewOpen, setPreviewOpen ] = useState(false);
    const emptyDrill = {
        title: "",
        description: "",
        creator: { _id: user || "", username: username || "Deleted User" }, 
        type: "Technique",
        difficulty: "Beginner",
        time: 1,
        sports: [],
        media: [],
        public: false,
        likes: 0,
        usersLiked: [],
        usersSaved: [],
        createdAt: "",
        updatedAt: ""
    }
    const [ newDrill, setNewDrill ] = useState<DrillType>(emptyDrill);

    const sportsOptions = [
        { value: "Soccer", label: "Soccer" },
        { value: "Basketball", label: "Basketball" },
        { value: "Tennis", label: "Tennis" },
        { value: "Volleyball", label: "Volleyball" },
        { value: "Baseball", label: "Baseball" },
        { value: "Hockey", label: "Hockey" },
        { value: "Golf", label: "Golf" },
        { value: "Cricket", label: "Cricket" },
        { value: "Football", label: "Football" },
        { value: "Badminton", label: "Badminton" }
    ];

    const difficultyOptions = [
        { value: "Beginner", label: "Beginner" },
        { value: "Intermediate", label: "Intermediate" },
        { value: "Pro", label: "Pro" }
    ];

    const typeOptions = [
        { value: "Warmup", label: "Warmup" },
        { value: "Technique", label: "Technique" },
        { value: "Conditioning", label: "Conditioning" },
        { value: "Strategy", label: "Strategy" },
        { value: "Cooldown", label: "Cooldown" }
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
        const drillToSubmit = !newDrill.sports.length ? {...newDrill, sports: ["General"]} : newDrill;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/drills`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(drillToSubmit)
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
        const drillToSubmit = !newDrill.sports.length ? {...newDrill, sports: ["General"]} : newDrill;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/drills/info/${selectedDrill._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(drillToSubmit)
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
        if (newDrill.title && newDrill.description) {
            setSelectedDrill(newDrill);
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
            className={`${update ? "z-2" : "z-0"} bg-[var(--secondary)] rounded-2xl shadow-lg px-10 pt-16 pb-8 w-3/4 max-w-200 max-h-5/6 overflow-y-auto relative`}
            overlayClassName={`${update ? "z-2" : "z-0"} fixed inset-0 flex items-center justify-center bg-[rgba(130,146,151,0.8)]`}
        >
            <form className="flex flex-col h-full space-y-4" onSubmit={e => {
                e.preventDefault(); 
                if (update) handleUpdate();
                else handleCreate();
            }}>
                <div className="absolute right-4 top-4">
                    <button type="button" className="cursor-pointer duration-300 hover:text-[var(--danger)] text-3xl" onClick={() => {setOpen(false); setError("");}}><FaXmark /></button>
                </div>

                <h1 className="text-5xl font-medium mb-8">{update ? "Update Drill" : "New Drill"}</h1>

                <div className="space-y-1">
                    <p>Title <span className="text-[var(--danger)]">*</span></p>
                    <input 
                        placeholder="Title"
                        value={newDrill.title}
                        onChange={e => setNewDrill({...newDrill, title: e.target.value})}
                        className={`w-full bg-[var(--secondary)] placeholder-[var(--muted)] rounded-lg p-3 border ${error && !newDrill.title ? "border-[var(--danger)]" : ""}`}
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

                <div className="flex justify-between space-y-4">
                    <div className="space-y-1 w-1/3">
                        <p>Type <span className="text-[var(--danger)]">*</span></p>
                        <Select 
                            options={typeOptions}
                            value={typeOptions.find(option => option.value === newDrill.type)}
                            onChange={selected => setNewDrill({
                                ...newDrill,
                                type: selected?.value || "Technique"
                            })} 
                            styles={dropdownStyles}
                        />
                    </div>

                    <div className="space-y-1 w-1/3">
                        <p>Difficulty <span className="text-[var(--danger)]">*</span></p>
                        <Select  
                            options={difficultyOptions}
                            value={difficultyOptions.find(option => option.value === newDrill.difficulty)}
                            onChange={selected => setNewDrill({
                                ...newDrill,
                                difficulty: selected?.value || "Beginner"
                            })} 
                            styles={dropdownStyles}
                        />
                    </div>

                    <div className="space-y-1 w-32">
                        <p>Time (minutes) <span className="text-[var(--danger)]">*</span></p>
                        <input 
                            type="number"
                            min={1}
                            max={9999}
                            value={newDrill.time}
                            onChange={e => setNewDrill({...newDrill, time: e.target.value === "" ? 0 : Number(e.target.value)})}
                            className="w-full h-[38px] bg-[var(--secondary)] placeholder-[var(--muted)] rounded p-3 border"
                        />
                    </div>
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
                        styles={dropdownStyles}
                    />
                </div>

                <div className="space-y-1">
                    <p>Media <span className="text-[var(--muted)]">(up to 5)</span></p>
                    <div {...getRootProps()} className="text-center bg-[var(--secondary)] border-2 border-dashed rounded-lg p-3 w-full h-32">
                        <input {...getInputProps()} />
                        <div className={`flex flex-col justify-center items-center h-full duration-300 ${isDragActive ? "text-[var(--link)]": "text-[var(--muted)]"}`}>
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
                                            className="absolute top-0 right-0 w-5 h-5 text-3xl flex items-center justify-center cursor-pointer bg-[var(--danger)] text-white hover:scale-105 rounded-full"
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
                    <button className="bg-[var(--accent)] hover:scale-105 rounded-lg mt-4 p-3 w-min duration-300 cursor-pointer">{update ? "Update" : "Create"}</button>
                    <button onClick={handlePreview} type="button" className="bg-[var(--primary)] hover:scale-105 rounded-lg mt-4 p-3 w-min duration-300 cursor-pointer">Preview</button>
                    <button onClick={() => {setNewDrill(emptyDrill); setError("");}} type="button" className="bg-[var(--primary)] hover:scale-105 rounded-lg mt-4 p-3 w-min duration-300 cursor-pointer">Clear</button>
                </div>
                
                {error && <p className="text-[var(--danger)]">{error}</p>}
            </form>
            {update && <DrillModal preview={true} open={previewOpen} setOpen={setPreviewOpen}/>}
            {!update && <DrillModal preview={true}/>}
        </ReactModal>
    )
}