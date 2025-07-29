"use client";
import Sidebar from "@/components/Sidebar";
import { DrillProvider } from "@/hooks/drill";
import { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { ToastContainer } from "react-toastify";

export default function UserLayout({ children }: { children: React.ReactNode }) {
    const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
    const [height, setHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 0);
    
    useEffect(() => {
        ReactModal.setAppElement('body');
        const handleResize = () => {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
        }
        window.addEventListener('resize', handleResize);
    }, []);

    return (
        <div className="overflow-hidden w-screen h-screen">
            {typeof window !== "undefined" && (width < 650 || height < 600)
                ? <div className="flex items-center justify-center text-center w-screen h-screen p-8">
                    <p className="text-3xl text-[var(--muted)]">Drill Share is not yet supported for mobile screens!</p>
                </div>
                : <div className="flex w-screen h-screen pl-4 py-8">
                    <Sidebar />
                    <ToastContainer theme="dark"/>
                    <DrillProvider>
                        {children}
                    </DrillProvider>
                </div>
            }
        </div>
    );
}