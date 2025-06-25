import Link from "next/link";

export default function Header() {
    return (
        <header className="flex justify-between w-full h-30 p-5">
            <Link href="/" className="h-full hover:scale-105"><img src="./images/logo.png" alt="Logo" className="h-full"/></Link>
            <div className="flex items-center space-x-3 h-full">
                <Link href="/login" className="bg-[var(--primary)] hover:scale-105 p-4 rounded-xl text-lg">Login</Link>
                <Link href="/register" className="bg-[var(--primary)] hover:scale-105 p-4 rounded-xl text-lg">Register</Link>
            </div>
        </header>
    )
}