import Header from "@/components/Header";
import Link from "next/link";

export default function Login() {
    return (
        <div className="flex flex-col w-screen h-screen">
            <Header />
            <main className="flex-1 flex justify-center items-center">
                <div className="flex flex-col w-1/2 items-center space-y-5 bg-[var(--primary)] rounded-3xl p-10">
                    <h1 className="text-5xl mb-10">Login</h1>
                    <input placeholder="Username" className="w-2/3 bg-[var(--secondary)] rounded-lg p-3"/>
                    <input placeholder="Password" type="password" className="w-2/3 bg-[var(--secondary)] rounded-lg p-3"/>
                    <p className="text-center text-red-400">
                        Username or password is incorrect.<br/>If this is your first time here, 
                        <Link href="/register" className="text-[var(--link)]"> <u>create an account!</u></Link>
                    </p>
                    <Link href="/dashboard" className="bg-[var(--secondary)] hover:text-[var(--link)] rounded-lg p-3">Sign In</Link>
                </div>
            </main>
        </div>
    )
}