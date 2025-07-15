"use client";
import { useAuth } from "@/context/auth";
import dropdownStyles from "@/styles/dropdown";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Select from "react-select";
import { FaUpload } from "react-icons/fa";

export default function Profile() {
    type UserInfo = {
        username: string;
        bio: string;
        sports: string[];
        photo: string;
    }

    const options = [
        { value: "Soccer", label: "Soccer" },
        { value: "Basketball", label: "Basketball" },
        { value: "Tennis", label: "Tennis" },
        { value: "Volleyball", label: "Volleyball" },
        { value: "Baseball", label: "Baseball" }
    ];

    const { user, loading } = useAuth();
    const router = useRouter();
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        multiple: false,
        accept: {"image/*": []},
        onDrop: (acceptedFiles) => {
            const file = acceptedFiles[0];
            if (file.size > 5 * 1024 * 1024) {
                setError("File too large.");
            } else {
                setError("");
                const reader = new FileReader();
                reader.onload = () => setUserInfo({...userInfo, photo: reader.result as string});
                reader.readAsDataURL(file);
            }
        }
    });
    
    const [ userInfo, setUserInfo ] = useState<UserInfo>({ username: "", bio: "", sports: [], photo: "" });
    const [ error, setError ] = useState("");
    const [ fetching, setFetching ] = useState(true);

    const handleUpdate = async () => {
        const res = await fetch(`http://localhost:5000/api/users/${user}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userInfo)
        });

        const data = await res.json();
        if (res.ok) {
            router.push("/dashboard");
        } else {
            setError(data.message);
        }
    }

    useEffect(() => {
        if (!user && !loading) router.replace("/");
        const fetchUser = async () => {
            setFetching(true);
            const res = await fetch(`http://localhost:5000/api/users/${user}`);
            if (res.ok) {
                const data = await res.json();
                setUserInfo(data.data);
            } else {
                setUserInfo({ username: "", bio: "", sports: [], photo: "" });
            }
            setFetching(false);
        }
        fetchUser();
    }, [user, loading]);
        
    if (!user || loading || fetching) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-3xl text-[var(--muted)]">Loading...</p>
            </div>
        )
    }

    return (
        <main className="flex-1 flex justify-center items-center p-16">
            <form className="flex flex-col w-full min-w-72 max-w-[50rem] space-y-5 bg-[var(--secondary)] rounded-3xl shadow-lg p-16 pb-12"
                onSubmit={e => {e.preventDefault(); handleUpdate();}}
            >
                <h1 className="text-5xl mb-10 font-medium">Edit Profile</h1>

                <div className="min-w-60 space-y-1">
                    <p>Username <span className="text-[var(--danger)]">*</span></p>
                    <input 
                        placeholder="Username"
                        value={userInfo.username}
                        onChange={e => setUserInfo({...userInfo, username: e.target.value})}
                        className={`w-full bg-[var(--secondary)] placeholder-[var(--muted)] rounded-lg p-3 border ${error && !userInfo.username ? "border-[var(--danger)]" : ""}`}
                    />
                </div>

                <div className="min-w-60 space-y-1">
                    <p>Bio <span className="text-[var(--muted)]">(optional)</span></p>
                    <textarea 
                        placeholder="Experience, location, fun facts, etc." 
                        rows={3} 
                        value={userInfo.bio}
                        onChange={e => setUserInfo({...userInfo, bio: e.target.value})}
                        className="w-full bg-[var(--secondary)] placeholder-[var(--muted)] rounded-lg p-3 border"
                    />
                </div>

                <div className="min-w-60 space-y-1">
                    <p>Sports <span className="text-[var(--muted)]">(optional)</span></p>
                    <Select 
                        isMulti 
                        options={options}
                        value={options.filter(option => userInfo.sports.includes(option.value))}
                        onChange={selected => setUserInfo({
                            ...userInfo,
                            sports: (selected as readonly { value: string; label: string }[]).map(option => option.value)
                        })}
                        className="w-full" 
                        styles={dropdownStyles}
                    />
                </div>

                <div className="min-w-60 space-y-1">
                    <p>Photo <span className="text-[var(--muted)]">(optional)</span></p>
                    <div {...getRootProps()} className="text-center bg-[var(--secondary)] border-2 border-dashed rounded-lg p-3 w-full h-32">
                        <input {...getInputProps()} />
                        <div className={`flex flex-col justify-center items-center h-full ${isDragActive ? "text-[var(--link)]": "text-[var(--muted)]"}`}>
                            <FaUpload className="text-3xl mb-3"/>
                            {!userInfo.photo && <p className="text-sm">Drag and drop an image here</p>}
                            {userInfo.photo && <div className="relative h-1/2">
                                <img src={userInfo.photo} alt="Image Preview" className="h-full w-full object-cover" />
                                <button type="button" onClick={e => {
                                    e.stopPropagation();
                                    setUserInfo({ ...userInfo, photo: "" });
                                }}
                                    className="absolute top-0 right-0 w-5 h-5 text-3xl flex items-center justify-center cursor-pointer bg-[var(--danger)] text-white hover:scale-105 rounded-full"
                                >×</button>
                            </div>}
                        </div>
                    </div>
                </div>

                <button className="bg-[var(--accent)] hover:scale-105 rounded-lg p-3 mt-5 w-max cursor-pointer">Update Account</button>
                {error && <p className="text-[var(--danger)]">{error}</p>}
            </form>
        </main>
    )
}