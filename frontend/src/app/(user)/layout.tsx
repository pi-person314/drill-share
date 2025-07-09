"use client";
import Sidebar from "@/components/Sidebar";
import { DrillProvider } from "@/context/drill";
import { useEffect } from "react";
import ReactModal from "react-modal";
import { ToastContainer } from "react-toastify";

export default function UserLayout({ children }: { children: React.ReactNode }) {
    useEffect(() => ReactModal.setAppElement('body'), []);

    return (
        <div className="flex flex-1 overflow-hidden p-4">
            <Sidebar />
            <ToastContainer theme="dark"/>
            <DrillProvider>
                {children}
            </DrillProvider>
        </div>
    );
}