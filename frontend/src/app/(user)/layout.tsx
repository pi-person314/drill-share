import Sidebar from "@/components/Sidebar";
import { DrillProvider } from "@/context/drill";

export default function UserLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-full">
            <DrillProvider>
                <Sidebar />
                {children}
            </DrillProvider>
        </div>
    );
}