"use client";
import Header from "@/components/Header";
import Link from "next/link";
import Select from "react-select";
import { useDropzone } from "react-dropzone";

export default function Register() {
    const options = [
        { value: "soccer", label: "Soccer" },
        { value: "basketball", label: "Basketball" },
        { value: "tennis", label: "Tennis" },
        { value: "volleyball", label: "Volleyball" },
        { value: "baseball", label: "Baseball" }
    ];

    const { getRootProps, getInputProps, acceptedFiles } = useDropzone({multiple: false, accept: {"image/*": []}});

    return (
        <div className="flex flex-col w-screen h-screen">
            <Header />
            <main className="flex-1 flex justify-center items-center">
                <div className="flex flex-col w-1/2 items-center space-y-5 bg-[var(--primary)] rounded-3xl shadow-lg p-16">
                    <h1 className="text-5xl mb-10">Register</h1>
                    <div className="flex justify-between items-center w-3/4">
                        <p><span className="text-[var(--danger)]">*</span> Username:</p>
                        <input placeholder="Username" className="w-3/4 bg-[var(--secondary)] rounded-lg p-3 border-2 border-[var(--danger)]"/>
                    </div>
                    <div className="flex justify-between items-center w-3/4">
                        <p><span className="text-[var(--danger)]">*</span> Password:</p>
                        <input placeholder="Password" type="password" className="w-3/4 bg-[var(--secondary)] rounded-lg p-3 border-2 border-[var(--danger)]"/>
                    </div>
                    <div className="flex justify-between items-center w-3/4">
                        <p>Bio:</p>
                        <textarea placeholder="Experience, location, fun facts, etc." rows={3} className="w-3/4 bg-[var(--secondary)] rounded-lg p-3"/>
                    </div>
                    <div className="flex justify-between items-center w-3/4">
                        <p>Sports:</p>
                        <Select isMulti options={options} className="w-3/4" styles={{
                            control: base => ({...base, backgroundColor: "var(--secondary)", borderWidth: 0}),
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
                    <div className="flex justify-between items-center space-y-2 w-3/4">
                        <p>Photo:</p>
                        <div {...getRootProps()} className="flex flex-col justify-center items-center text-center bg-[var(--secondary)] border-2 border-dashed rounded-lg p-3 w-3/4 h-24">
                            <input {...getInputProps()} />
                            <h1 className="text-xl">Upload</h1>
                            {!acceptedFiles.length && <p className="text-sm">Drag and drop an image here</p>}
                            {acceptedFiles.map(file => (
                                <p key={file.path} className="text-sm">{file.path}</p>
                            ))}
                        </div>
                    </div>
                    <Link href="/dashboard" className="bg-[var(--accent)] hover:scale-105 rounded-lg p-3 mt-5">Create Account</Link>
                    <p className="text-center text-[var(--danger)]">Please fill in all required fields.</p>
                </div>
            </main>
        </div>
    )
}