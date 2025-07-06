"use client";
import { useAuth } from "@/context/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaHome, FaSearch, FaBasketballBall, FaDumbbell } from "react-icons/fa";

export default function Sidebar() {
    const { user } = useAuth();
    const pathname = usePathname();
    const [userInfo, setUserInfo] = useState<{username: string, bio: string, photo: string}>({
        username: "Guest",
        bio: "",
        photo: "./images/defaultPhoto.png"
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
                        photo: data.data.photo || "./images/defaultPhoto.png"
                    });
                } else {
                    setUserInfo({
                        username: "Guest",
                        bio: "",
                        photo: "./images/defaultPhoto.png"
                    });
                }
            }
        }
        getUserInfo();
    }, [user]);

    if (!user) return null;

    return (
        <aside className="flex flex-col w-80 h-full bg-[var(--primary)] justify-between items-center py-10 px-6">
            <Link href="/dashboard" className={`flex items-center text-3xl font-semibold hover:text-[var(--muted)] px-5 py-8 ${pathname === "/dashboard" ? "bg-[var(--accent)] rounded-4xl shadow-lg" : ""}`}>
                <FaHome className="mr-2"/>
                Dashboard
            </Link>
            <div className="flex flex-col items-center">
                <Link href="/browse" className={`flex items-center text-2xl font-medium hover:text-[var(--muted)] px-5 py-8 ${pathname === "/browse" ? "bg-[var(--accent)] rounded-4xl shadow-lg" : ""}`}>
                    <FaSearch className="mr-2"/>
                    Browse
                </Link>
                <div className="flex flex-col items-center">
                    <Link href="/drills" className={`flex items-center text-2xl font-medium hover:text-[var(--muted)] px-5 py-8 ${pathname === "/drills" ? "bg-[var(--accent)] rounded-4xl shadow-lg" : ""}`}>
                        <FaBasketballBall className="mr-2"/>
                        Drills
                    </Link>
                    {pathname === "/drills" && <div className="flex flex-col items-center space-y-2 mt-4">
                        <Link href="/drills#my-drills" className="hover:text-[var(--muted)]">My Drills</Link>
                        <Link href="/drills#saved-drills" className="hover:text-[var(--muted)]">Saved Drills</Link>
                    </div>}
                </div>
                <div className="flex flex-col items-center">
                    <Link href="/workouts" className={`flex items-center text-2xl font-medium hover:text-[var(--muted)] px-5 py-8 ${pathname === "/workouts" ? "bg-[var(--accent)] rounded-4xl shadow-lg" : ""}`}>
                        <FaDumbbell className="mr-2"/>
                        Workouts
                    </Link>
                    {pathname === "/workouts" && <div className="flex flex-col items-center space-y-2 mt-4">
                        <Link href="/workouts#new" className="hover:text-[var(--muted)]">New Workout</Link>
                        <Link href="/workouts#review" className="hover:text-[var(--muted)]">Review Workouts</Link>
                    </div>}
                </div>
            </div>
            <Link href="/profile" className="flex bg-[var(--secondary)] items-center w-full h-36 space-x-2 px-3 py-5 rounded-2xl hover:scale-105">
                <img src={userInfo.photo} alt="Profile Picture" className="w-1/3 h-full object-contain"/>
                <div className="flex-1 flex flex-col min-w-0 h-full justify-center">
                    <h1 className="text-xl font-medium w-full truncate">{userInfo.username}</h1>
                    {userInfo.bio && <p className="text-sm text-[var(--muted)] whitespace-pre-line max-h-2/3 overflow-y-auto">{userInfo.bio}</p>}
                </div>
            </Link>
        </aside>
    )
}