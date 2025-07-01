import Sidebar from "@/components/Sidebar";

export default function UserLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-full">
            <Sidebar />
            {children}
        </div>
    );
}