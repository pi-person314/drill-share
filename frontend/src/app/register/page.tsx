"use client";
import Select from "react-select";
import { useDropzone } from "react-dropzone";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";
import { FaUpload } from "react-icons/fa";

export default function Register() {
    type UserInfo = {
        username: string;
        password: string;
        bio: string;
        sports: string[];
        photo: string;
    }

    const [ userInfo, setUserInfo ] = useState<UserInfo>({ username: "", password: "", bio: "", sports: [], photo: "" });
    const [ error, setError ] = useState("");
    const [ loading, setLoading ] = useState(false);

    const { user, login } = useAuth();
    const router = useRouter();
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        multiple: false,
        accept: {"image/*": []},
        onDrop: (acceptedFiles) => {
            const file = acceptedFiles[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => setUserInfo({...userInfo, photo: reader.result as string});
                reader.readAsDataURL(file);
            }
        }
    });

    
    useEffect(() => {
        if (user) router.replace("/dashboard");
    }, [user]);
    
    const handleRegister = async () => {
        const res = await fetch("http://localhost:5000/api/users/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userInfo)
        });

        const data = await res.json();
        if (res.ok) {
            setLoading(true);
            login(data.data._id);
            router.push("/dashboard");
        } else {
            setError(data.message);
        }
    }

    const options = [
        { value: "soccer", label: "Soccer" },
        { value: "basketball", label: "Basketball" },
        { value: "tennis", label: "Tennis" },
        { value: "volleyball", label: "Volleyball" },
        { value: "baseball", label: "Baseball" }
    ];

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-3xl text-[var(--muted)]">Loading...</p>
            </div>
        )
    }

    return (
        <main className="flex-1 flex justify-center items-center p-10">
            <form className="flex flex-col w-1/2 min-w-72 max-w-[50rem] justify-center items-center space-y-5 bg-[var(--primary)] rounded-3xl shadow-lg p-16"
                onSubmit={e => {
                    e.preventDefault();
                    handleRegister();
                }}
            >
                <h1 className="text-5xl mb-10 font-medium">Register</h1>

                <div className="w-5/6 min-w-60 space-y-1">
                    <p>Username <span className="text-[var(--danger)]">*</span></p>
                    <input 
                        placeholder="Username"
                        value={userInfo.username}
                        onChange={e => setUserInfo({...userInfo, username: e.target.value})}
                        className={`w-full bg-[var(--secondary)] placeholder-[var(--muted)] rounded-lg p-3 border ${error && !userInfo.username ? "border-[var(--danger)]" : ""}`}
                    />
                </div>

                <div className="w-5/6 min-w-60 space-y-1">
                    <p>Password <span className="text-[var(--danger)]">*</span></p>
                    <input 
                        placeholder="Password" 
                        type="password" 
                        value={userInfo.password}
                        onChange={e => setUserInfo({...userInfo, password: e.target.value})}
                        className={`w-full bg-[var(--secondary)] placeholder-[var(--muted)] rounded-lg p-3 border ${error && !userInfo.password ? "border-[var(--danger)]" : ""}`}
                    />
                </div>

                <div className="w-5/6 min-w-60 space-y-1">
                    <p>Bio <span className="text-[var(--muted)]">(optional)</span></p>
                    <textarea 
                        placeholder="Experience, location, fun facts, etc." 
                        rows={3} 
                        value={userInfo.bio}
                        onChange={e => setUserInfo({...userInfo, bio: e.target.value})}
                        className="w-full bg-[var(--secondary)] placeholder-[var(--muted)] rounded-lg p-3 border"
                    />
                </div>

                <div className="w-5/6 min-w-60 space-y-1">
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
                        styles={{
                            placeholder: base => ({...base, color: "var(--muted)"}),
                            control: base => ({...base, backgroundColor: "var(--secondary)"}),
                            menu: base => ({...base, backgroundColor: "var(--secondary)"}),
                            option: (base, state) => ({
                                ...base, 
                                backgroundColor: state.isFocused ? "var(--primary)" : "var(--secondary)", 
                                color: "var(--text)",
                                ":active": {backgroundColor: "var(--accent)"}
                            }),
                            multiValue: base => ({...base, backgroundColor: "var(--primary)"}),
                            multiValueLabel: base => ({...base, color: "var(--text)"})
                        }}
                    />
                </div>

                <div className="w-5/6 min-w-60 space-y-1">
                    <p>Photo <span className="text-[var(--muted)]">(optional)</span></p>
                    <div {...getRootProps()} className="text-center bg-[var(--secondary)] border border-dashed rounded-lg p-3 w-full h-32">
                        <input {...getInputProps()} />
                        <div className={`flex flex-col justify-center items-center h-full cursor-pointer ${isDragActive ? "text-[var(--link)]": "text-[var(--muted)] hover:text-[var(--link)]"}`}>
                            <FaUpload className="text-3xl mb-3"/>
                            {!userInfo.photo && <p className="text-sm">Drag and drop an image here</p>}
                            {userInfo.photo && <img src={userInfo.photo} alt="Photo Preview" className="h-1/2 object-contain"/>}
                        </div>
                    </div>
                </div>

                <button className="bg-[var(--accent)] hover:scale-105 rounded-lg p-3 mt-5 cursor-pointer">Create Account</button>
                {error && <p className="text-center text-[var(--danger)]">{error}</p>}
            </form>
        </main>
    )
}