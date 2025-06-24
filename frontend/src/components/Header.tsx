import Link from "next/link";

export default function Header() {
    return (
        <header className="flex justify-between items-center w-full h-24 p-5">
            <Link href="/" className="h-full"><img src="./images/logo.png" alt="Logo" className="h-full"/></Link>
            <div className="space-x-3">
                <Link href="/login" className="bg-[var(--primary)] hover:text-[var(--link)] p-4 rounded-xl">Login</Link>
                <Link href="/register" className="bg-[var(--primary)] hover:text-[var(--link)] p-4 rounded-xl">Register</Link>
            </div>
        </header>
    )
}