"use client";
import { useAuth } from "@/hooks/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) router.replace("/dashboard");
    }, [user]);

    return (
        <main className="flex-1 flex flex-col justify-center items-center text-center p-10 space-y-5">
            <h1 className="text-4xl md:text-6xl [@media(max-height:50rem)]:text-4xl font-semibold">Welcome to Drill Share!</h1>
            <p className="text-xs md:text-base [@media(max-height:50rem)]:text-xs">
                This website is designed to help you discover new ways to improve your sports skills,
                <br/>
                or you can share your own custom drills with the community!
                <br/>
                To get started, <Link href="/register" className="text-[var(--link)]"><u>create an account!</u></Link>
            </p>
            <div className="flex flex-col space-y-4 mt-4 w-2/3">
                <div className="flex justify-center w-full space-x-3">
                    <img src="/images/soccer.png" alt="Soccer Ball" className="w-1/5 max-w-30 [@media(max-height:50rem)]:max-w-20 object-contain hover:animate-spin"/>
                    <img src="/images/basketball.png" alt="Basketball" className="w-1/5 max-w-30 [@media(max-height:50rem)]:max-w-20 object-contain hover:animate-spin"/>
                    <img src="/images/tennis.png" alt="Tennis Ball" className="w-1/5 max-w-30 [@media(max-height:50rem)]:max-w-20 object-contain hover:animate-spin"/>
                    <img src="/images/volleyball.png" alt="Volleyball" className="w-1/5 max-w-30 [@media(max-height:50rem)]:max-w-20 object-contain hover:animate-spin"/>
                    <img src="/images/baseball.png" alt="Baseball" className="w-1/5 max-w-30 [@media(max-height:50rem)]:max-w-20 object-contain hover:animate-spin"/>
                </div>
                <div className="flex justify-center w-full space-x-3">
                    <img src="/images/hockey.png" alt="Hockey Puck" className="w-1/5 max-w-30 [@media(max-height:50rem)]:max-w-20 object-contain hover:animate-spin"/>
                    <img src="/images/golf.png" alt="Golf Ball" className="w-1/5 max-w-30 [@media(max-height:50rem)]:max-w-20 object-contain hover:animate-spin"/>
                    <img src="/images/cricket.png" alt="Cricket Ball" className="w-1/5 max-w-30 [@media(max-height:50rem)]:max-w-20 object-contain hover:animate-spin"/>
                    <img src="/images/football.png" alt="Football" className="w-1/5 max-w-30 [@media(max-height:50rem)]:max-w-20 object-contain hover:animate-spin"/>
                    <img src="/images/badminton.png" alt="Badminton Birdie" className="w-1/5 max-w-30 [@media(max-height:50rem)]:max-w-20 object-contain hover:animate-spin"/>
                </div> 
            </div>
        </main>
    );
}
