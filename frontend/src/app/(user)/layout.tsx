"use client";
import Sidebar from "@/components/Sidebar";
import { DrillProvider } from "@/hooks/drill";
import { useEffect } from "react";
import ReactModal from "react-modal";
import { ToastContainer } from "react-toastify";

export default function UserLayout({ children }: { children: React.ReactNode }) {
    useEffect(() => ReactModal.setAppElement('body'), []);

    return (
        <div className="flex flex-1 overflow-hidden px-4 py-8">
            <Sidebar />
            <ToastContainer theme="dark"/>
            <DrillProvider>
                {children}
            </DrillProvider>
        </div>
    );
}