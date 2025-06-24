import Header from "@/components/Header";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col w-screen h-screen">
      <Header />
      <main className="flex-1 flex flex-col justify-center items-center text-center p-10 space-y-5">
        <h1 className="text-6xl">Welcome to Drill Share!</h1>
        <p>
          This website is designed to help you discover new ways to improve your sports skills,<br/>
          or you can share your own custom drills with the community!<br/>
          To get started, <Link href="/register" className="text-[var(--link)]"><u>create an account!</u></Link>
        </p>
        <div className="flex flex-row space-x-3 mt-8">
          <img src="./images/soccer.png" alt="Soccer Ball" className="h-24 hover:animate-spin"/>
          <img src="./images/basketball.png" alt="Basketball" className="h-24 hover:animate-spin"/>
          <img src="./images/tennis.png" alt="Tennis Ball" className="h-24 hover:animate-spin"/>
          <img src="./images/volleyball.png" alt="Volleyball" className="h-24 hover:animate-spin"/>
          <img src="./images/baseball.png" alt="Baseball" className="h-24 hover:animate-spin"/>
        </div>
      </main>
    </div>
  );
}
