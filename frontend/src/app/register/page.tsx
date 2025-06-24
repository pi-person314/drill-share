import Header from "@/components/Header";
import Link from "next/link";

export default function Register() {
    return (
        <div className="flex flex-col w-screen h-screen">
            <Header />
            <main className="flex-1 flex justify-center items-center">
                <div className="flex flex-col w-1/2 items-center space-y-5 bg-[var(--primary)] rounded-3xl p-10">
                    <h1 className="text-5xl mb-10">Register</h1>
                    <div className="flex justify-between items-center w-2/3">
                        <p>*Username:</p>
                        <input placeholder="Username" className="w-4/5 bg-[var(--secondary)] rounded-lg p-3 border-4 border-red-400"/>
                    </div>
                    <div className="flex justify-between items-center w-2/3">
                        <p>*Password:</p>
                        <input placeholder="Password" type="password" className="w-4/5 bg-[var(--secondary)] rounded-lg p-3 border-4 border-red-400"/>
                    </div>
                    {/* TODO: add fields for bio, pic, and sports */}
                    <p className="text-center text-red-400">Please fill in all required fields.</p>
                    <Link href="/dashboard" className="bg-[var(--secondary)] hover:text-[var(--link)] rounded-lg p-3">Create Account</Link>
                </div>
            </main>
        </div>
    )
}