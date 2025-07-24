"use client";
import { useAuth } from "@/hooks/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaHome, FaSearch, FaBasketballBall, FaDumbbell } from "react-icons/fa";

export default function Sidebar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [userInfo, setUserInfo] = useState<{username: string, bio: string, photo: string}>({
        username: "Guest",
        bio: "",
        photo: "/images/defaultPhoto.png"
    });

    useEffect(() => {
        const getUserInfo = async () => {
            if (user) {
                const res = await fetch(`http://localhost:5000/api/users/${user}`);
                if (res.ok) {
                    const data = await res.json();
                    setUserInfo({
                        username: data.data.username,
                        bio: data.data.bio,
                        photo: data.data.photo || "/images/defaultPhoto.png"
                    });
                } else {
                    setUserInfo({
                        username: "Guest",
                        bio: "",
                        photo: "/images/defaultPhoto.png"
                    });
                }
            }
        }
        getUserInfo();
    }, [user, pathname]);

    if (!user) return null;

    return (
        <aside className="flex flex-col shrink-0 w-32 lg:w-80 h-full bg-[var(--primary)] justify-between items-center px-4 pt-16 pb-8 lg:p-8 lg:pt-16 overflow-y-auto [@media(max-height:50rem)]:pt-8 duration-300 rounded-2xl shadow-lg">
            <Link href="/dashboard" className={`flex items-center text-3xl [@media(max-height:50rem)]:text-2xl hover:text-[var(--muted)] px-5 py-8 [@media(max-height:50rem)]:py-4 rounded-4xl duration-300 ${pathname === "/dashboard" ? "font-bold bg-[var(--accent)] shadow-lg" : "font-semibold"}`}>
                <FaHome className="lg:mr-2"/>
                <p className="hidden lg:block">Dashboard</p>
            </Link>
            <div className="flex flex-col items-center">
                <Link href="/browse" className={`flex items-center text-2xl [@media(max-height:50rem)]:text-xl hover:text-[var(--muted)] px-5 py-8 [@media(max-height:50rem)]:py-4 rounded-4xl duration-300 ${pathname === "/browse" ? "font-bold bg-[var(--accent)] shadow-lg" : "font-semibold"}`}>
                    <FaSearch className="lg:mr-2"/>
                    <p className="hidden lg:block">Browse</p>
                </Link>
                <div className="flex flex-col items-center">
                    <Link href="/drills" className={`flex items-center text-2xl [@media(max-height:50rem)]:text-xl hover:text-[var(--muted)] px-5 py-8 [@media(max-height:50rem)]:py-4 rounded-4xl duration-300 ${pathname === "/drills" ? "font-bold bg-[var(--accent)] shadow-lg" : "font-semibold"}`}>
                        <FaBasketballBall className="lg:mr-2"/>
                        <p className="hidden lg:block">Drills</p>
                    </Link>
                    {pathname === "/drills" && <div className="flex flex-col items-center space-y-2 mt-4">
                        <Link href="/drills#my-drills" className="[@media(max-height:50rem)]:text-sm underline hover:text-[var(--muted)] duration-300"><span className="lg:hidden">Created</span><span className="hidden lg:inline">My Drills</span></Link>
                        <Link href="/drills#saved-drills" className="[@media(max-height:50rem)]:text-sm underline hover:text-[var(--muted)] duration-300">Saved<span className="hidden lg:inline"> Drills</span></Link>
                    </div>}
                </div>
                <div className="flex flex-col items-center">
                    <Link href="/training" className={`flex items-center text-2xl [@media(max-height:50rem)]:text-xl hover:text-[var(--muted)] px-5 py-8 [@media(max-height:50rem)]:py-4 rounded-4xl duration-300 ${pathname.startsWith("/training") ? "font-bold bg-[var(--accent)] shadow-lg" : "font-semibold"}`}>
                        <FaDumbbell className="lg:mr-2"/>
                        <p className="hidden lg:block">Training</p>
                    </Link>
                    {pathname.startsWith("/training") && <div className="flex flex-col items-center text-center space-y-2 mt-4">
                        <Link href="/training/new" className="[@media(max-height:50rem)]:text-sm underline hover:text-[var(--muted)] duration-300">New<span className="hidden lg:inline"> Session</span></Link>
                        <Link href="/training/review" className="[@media(max-height:50rem)]:text-sm underline hover:text-[var(--muted)] duration-300">Review<span className="hidden lg:inline"> Sessions</span></Link>
                    </div>}
                </div>
            </div>
            <div className="flex flex-col lg:flex-row bg-[var(--secondary)] items-center w-full h-36 [@media(max-height:50rem)]:h-30 p-4 rounded-2xl shadow-lg">
                <Link href="/profile" className="flex justify-center lg:pointer-events-none mx-auto lg:mr-4 lg:w-1/3">
                    <img src={userInfo.photo} alt="Profile Picture" className="h-20 [@media(max-height:50rem)]:h-16 object-contain hover:opacity-50 duration-300"/>
                </Link>
                <div className="hidden lg:flex flex-1 flex-col min-w-0 h-full justify-center">
                    <h1 className="text-xl [@media(max-height:50rem)]:text-lg font-medium w-full truncate">{userInfo.username}</h1>
                    {userInfo.bio && <p className="text-sm [@media(max-height:50rem)]:text-xs text-[var(--muted)] whitespace-pre-line max-h-1/2 overflow-y-auto">{userInfo.bio}</p>}
                    <div className="flex space-x-2 text-sm [@media(max-height:50rem)]:text-xs mt-1">
                        <Link href="/profile" className="[@media(max-height:50rem)]:text-xs underline hover:text-[var(--muted)] duration-300">Edit</Link>
                        <Link href="/" onClick={logout} className="[@media(max-height:50rem)]:text-xs underline hover:text-[var(--muted)] duration-300">Logout</Link>
                    </div>
                </div>
                <Link href="/" onClick={logout} className="lg:hidden mt-2 underline text-sm [@media(max-height:50rem)]:text-xs hover:text-[var(--muted)] duration-300">Logout</Link>
            </div>
        </aside>
    )
}