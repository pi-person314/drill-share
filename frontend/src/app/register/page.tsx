"use client";
import Header from "@/components/Header";
import Select from "react-select";
import { useDropzone } from "react-dropzone";
import { useState } from "react";

export default function Register() {
    type UserInfo = {
        username: string;
        password: string;
        bio: string;
        sports: string[];
        photo: string;
    }

    const options = [
        { value: "soccer", label: "Soccer" },
        { value: "basketball", label: "Basketball" },
        { value: "tennis", label: "Tennis" },
        { value: "volleyball", label: "Volleyball" },
        { value: "baseball", label: "Baseball" }
    ];

    const [ userInfo, setUserInfo ] = useState<UserInfo>({ username: "", password: "", bio: "", sports: [], photo: "" });
    const { getRootProps, getInputProps } = useDropzone({
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

    const [ error, setError ] = useState("");

    const handleRegister = async () => {
        const res = await fetch("http://localhost:5000/api/users/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userInfo)
        });
        if (res.ok) {
            setError("");
            setUserInfo({ username: "", password: "", bio: "", sports: [], photo: "" });
            window.location.href = "/dashboard";
        } else {
            const data = await res.json();
            setError(data.message);
        }
    }

    return (
        <div className="flex flex-col w-screen h-screen">
            <Header />
            <main className="flex-1 flex justify-center items-center">
                <div className="flex flex-col w-1/2 items-center space-y-5 bg-[var(--primary)] rounded-3xl shadow-lg p-16">
                    <h1 className="text-5xl mb-10 font-medium">Register</h1>
                    <div className="flex justify-between items-center w-5/6">
                        <p><span className="text-[var(--danger)]">*</span> Username:</p>
                        <input 
                            placeholder="Username"
                            value={userInfo.username}
                            onChange={e => setUserInfo({...userInfo, username: e.target.value})}
                            className={`w-3/4 bg-[var(--secondary)] rounded-lg p-3 border ${error && !userInfo.username ? "border-[var(--danger)]" : ""}`}
                        />
                    </div>
                    <div className="flex justify-between items-center w-5/6">
                        <p><span className="text-[var(--danger)]">*</span> Password:</p>
                        <input 
                            placeholder="Password" 
                            type="password" 
                            value={userInfo.password}
                            onChange={e => setUserInfo({...userInfo, password: e.target.value})}
                            className={`w-3/4 bg-[var(--secondary)] rounded-lg p-3 border ${error && !userInfo.password ? "border-[var(--danger)]" : ""}`}
                        />
                    </div>
                    <div className="flex justify-between items-center w-5/6">
                        <p>Bio:</p>
                        <textarea 
                            placeholder="Experience, location, fun facts, etc." 
                            rows={3} 
                            value={userInfo.bio}
                            onChange={e => setUserInfo({...userInfo, bio: e.target.value})}
                            className="w-3/4 bg-[var(--secondary)] rounded-lg p-3 border"
                        />
                    </div>
                    <div className="flex justify-between items-center w-5/6">
                        <p>Sports:</p>
                        <Select 
                            isMulti 
                            options={options}
                            value={options.filter(option => userInfo.sports.includes(option.value))}
                            onChange={selected => setUserInfo({
                                ...userInfo,
                                sports: (selected as readonly { value: string; label: string }[]).map(option => option.value)
                            })}
                            className="w-3/4" 
                            styles={{
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
                            }}/>
                    </div>
                    <div className="flex justify-between items-center space-y-2 w-5/6">
                        <p>Photo:</p>
                        <div {...getRootProps()} className="flex flex-col justify-center items-center text-center bg-[var(--secondary)] border border-dashed rounded-lg p-3 w-3/4 h-30">
                            <input {...getInputProps()} />
                            <h1 className="text-xl mb-2">Upload</h1>
                            {!userInfo.photo && <p className="text-sm">Drag and drop an image here</p>}
                            {userInfo.photo && <img src={userInfo.photo} alt="Photo Preview" className="h-1/2"/>}
                        </div>
                    </div>
                    <button onClick={handleRegister} className="bg-[var(--accent)] hover:scale-105 rounded-lg p-3 mt-5">Create Account</button>
                    {error && <p className="text-center text-[var(--danger)]">{error}</p>}
                </div>
            </main>
        </div>
    )
}