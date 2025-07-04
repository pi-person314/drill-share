"use client";
import Sidebar from "@/components/Sidebar";
import { DrillProvider } from "@/context/drill";
import { useEffect } from "react";
import ReactModal from "react-modal";

export default function UserLayout({ children }: { children: React.ReactNode }) {
    useEffect(() => ReactModal.setAppElement('body'), []);

    return (
        <div className="flex h-full">
            <DrillProvider>
                <Sidebar />
                {children}
            </DrillProvider>
        </div>
    );
}