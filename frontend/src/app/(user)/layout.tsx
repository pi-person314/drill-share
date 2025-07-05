"use client";
import Sidebar from "@/components/Sidebar";
import { DrillProvider } from "@/context/drill";
import { useEffect } from "react";
import ReactModal from "react-modal";

export default function UserLayout({ children }: { children: React.ReactNode }) {
    useEffect(() => ReactModal.setAppElement('body'), []);

    return (
        <div className="flex flex-1 overflow-hidden">
            <DrillProvider>
                <Sidebar />
                {children}
            </DrillProvider>
        </div>
    );
}