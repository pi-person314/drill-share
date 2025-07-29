"use client";
import DrillModal from "@/components/DrillModal";
import { useDrill } from "@/hooks/drill";
import { DrillType } from "@/types/drill";
import { FaEye, FaLongArrowAltLeft, FaLongArrowAltRight, FaMicrophone, FaPause, FaPlay, FaRedo, FaSave } from "react-icons/fa";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useRecorder } from "@/hooks/recorder";
import { TrainingType } from "@/types/training";
import { useAuth } from "@/hooks/auth";
import { toast } from "react-toastify";

export default function RecordPage() {
    const { user, loading } = useAuth();
    const { sessionId, drillIndex } = useParams();
    const router = useRouter();
    const { selectedDrill, setSelectedDrill } = useDrill();
    const [ session, setSession ] = useState<TrainingType | null>(null);
    const [ drill, setDrill ] = useState<DrillType | null>(null);
    const [ notes, setNotes ] = useState("");
    const [ fetching, setFetching ] = useState(true);
    const [ changed, setChanged ] = useState(false);
    const [ recorded, setRecorded ] = useState(false);
    const { start, stop, pause, resume, restart, recording, paused, mediaUrl, setMediaUrl, stream } = useRecorder();
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleUpdate = async (finish?: boolean) => {
        if (!changed) return;

        await fetch(`${process.env.NEXT_PUBLIC_API}/api/training/${sessionId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...session, 
                notes: session?.notes.map((note, index) => index === Number(drillIndex) ? notes : note),
                videos: session?.videos.map((video, index) => index === Number(drillIndex) ? mediaUrl || "" : video)
            })
        });

        if (finish && recorded) {
            const today = new Date().toLocaleDateString();
            const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleDateString();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/users/${user}`);
            if (res.ok) {
                const userData = await res.json();
                const oldDailyAt = userData.data.dailyAt;
                const res2 = await fetch(`${process.env.NEXT_PUBLIC_API}/api/users/${user}`, {
                    method: "PUT",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        ...userData.data,
                        streak: userData.data.dailyAt === today ? userData.data.streak : userData.data.dailyAt === yesterday ? userData.data.streak + 1 : 1,
                        dailyAt: today
                    })
                });
                if (res2.ok && oldDailyAt !== today) {
                    toast.success("Daily training completed!");
                }
            }
        }
    }

    useEffect(() => {
        if (!user && !loading) {
            router.replace("/");
            return;
        }
    }, [user, loading]);

    useEffect(() => {
        const fetchSession = async () => {
            setFetching(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/training/${sessionId}`);
            if (res.ok) {
                const data = await res.json();
                setSession(data.data);
                setDrill(data.data.drills[Number(drillIndex)]);
                setNotes(data.data.notes[Number(drillIndex)]);
                setMediaUrl(data.data.videos[Number(drillIndex)]);
            }
            setFetching(false);
        }
        fetchSession();
    }, [sessionId, drillIndex]);

    useEffect(() => {
        if (videoRef.current && stream) videoRef.current.srcObject = stream;
    }, [stream]);

    if (!user || loading || fetching) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-3xl text-[var(--muted)] animate-pulse">Loading...</p>
            </div>
        )
    }

    if (!session || !drill) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-3xl text-[var(--muted)]">Session or drill not found.</p>
            </div>
        )
    }

    return (
        <main className="flex-1 flex items-center justify-center w-full min-w-0 h-full p-16 pr-0">
            <div className="flex flex-col items-center justify-between w-full h-full max-w-300 space-y-8 xl:space-y-16 p-1 pr-16 overflow-y-auto relative">
                <div className="flex flex-col items-center text-center w-full">
                    <h1 className="text-4xl xl:text-5xl font-semibold w-1/2 truncate">{drill.title}</h1>
                    <h2 className="text-xl xl:text-2xl font-medium text-[var(--muted)]">{drill.type}</h2>
                </div>

                <div className="absolute top-1 right-16">
                    <button onClick={() => setSelectedDrill(drill)} className="flex items-center bg-[var(--primary)] text-sm xl:text-base rounded-lg shadow-lg p-4 cursor-pointer hover:scale-105">
                        <p className="hidden md:block">View Drill</p><FaEye className="md:ml-2 text-xl xl:text-2xl" />
                    </button>
                </div>

                <div className="flex flex-col xl:flex-row w-full xl:h-full space-y-8 xl:space-y-0 xl:space-x-16">
                    <div className="flex flex-col items-center justify-center bg-[var(--primary)] rounded-xl shadow-lg min-h-80 xl:w-2/3 p-8 space-y-8">
                        {recording ? 
                            <video ref={videoRef} autoPlay className={`w-full h-3/4 ${paused ? "opacity-50" : ""}`} /> 
                        : mediaUrl ? 
                            <video src={mediaUrl} controls className="w-full h-3/4" />
                        : 
                            <button onClick={start} className="flex items-center bg-[var(--secondary)] text-sm md:text-base rounded-lg shadow-lg p-4 cursor-pointer hover:text-[var(--danger)]">
                                <FaMicrophone className="mr-2 text-xl md:text-2xl" />Record
                            </button>
                        }
                        
                        {recording && <div className="flex justify-center w-full space-x-4">
                            <button onClick={() => paused ? resume() : pause()} className="flex items-center bg-[var(--secondary)] text-sm md:text-base rounded-lg shadow-lg p-4 cursor-pointer hover:text-[var(--muted)]">
                                {paused ? <FaPlay className="mr-2 text-lg md:text-xl" /> : <FaPause className="mr-2 text-lg md:text-xl" />}
                                {paused ? "Resume" : "Pause"}
                            </button>
                            <button onClick={() => {stop(); setChanged(true); setRecorded(true); handleUpdate();}} className="flex items-center bg-[var(--secondary)] text-sm md:text-base rounded-lg shadow-lg p-4 cursor-pointer hover:text-[var(--success)]">
                                <FaSave className="mr-2 text-lg md:text-2xl" />Save
                            </button>
                        </div>}
                        {!recording && mediaUrl && <button onClick={restart} className="flex items-center bg-[var(--secondary)] text-sm md:text-base rounded-lg shadow-lg p-4 cursor-pointer hover:text-[var(--danger)]">
                            <FaRedo className="mr-2 text-lg md:text-xl" />Restart
                        </button>}
                    </div>
                    <textarea 
                        placeholder="Take notes here..." 
                        className="xl:flex-1 bg-[var(--secondary)] rounded-xl shadow-lg border p-4 min-h-80 whitespace-pre-line resize-none" 
                        value={notes}
                        onChange={(e) => {setNotes(e.target.value); setChanged(true);}}
                    />
                </div>

                <div className="flex justify-between w-full">
                    <button 
                        onClick={() => {handleUpdate(); router.push(`/training/${sessionId}/${Number(drillIndex) - 1}`)}} 
                        disabled={Number(drillIndex) === 0}
                        className={`flex items-center bg-[var(--accent)] text-sm xl:text-base rounded-lg shadow-lg p-4 ${Number(drillIndex) === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-105"}`}
                    >
                        <FaLongArrowAltLeft className="mr-2 text-xl xl:text-2xl" />
                        Previous
                    </button>

                    <button 
                        onClick={() => {handleUpdate(Number(drillIndex) === session.drills.length - 1); router.push(`${Number(drillIndex) === session.drills.length - 1 ? "/training/review" : `/training/${sessionId}/${Number(drillIndex) + 1}`}`)}} 
                        disabled={recording || !mediaUrl}
                        className={`flex items-center bg-[var(--accent)] text-sm xl:text-base rounded-lg shadow-lg p-4 ${recording || !mediaUrl ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-105"}`}
                    >
                        {Number(drillIndex) === session.drills.length - 1 ? "Finish" : "Next"}
                        <FaLongArrowAltRight className="ml-2 text-xl xl:text-2xl" />
                    </button>
                </div>
            </div>

            <DrillModal />
        </main>
    )
}