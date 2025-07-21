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

export default function RecordPage() {
    const { user, loading } = useAuth();
    const { sessionId, drillIndex } = useParams();
    const router = useRouter();
    const { setSelectedDrill } = useDrill();
    const [ session, setSession ] = useState<TrainingType | null>(null);
    const [ drill, setDrill ] = useState<DrillType | null>(null);
    const [ notes, setNotes ] = useState("");
    const [ fetching, setFetching ] = useState(true);
    const { start, stop, pause, resume, restart, recording, paused, mediaUrl, setMediaUrl, stream } = useRecorder();
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleUpdate = async () => {
        await fetch(`http://localhost:5000/api/training/${sessionId}`, {
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
    }

    useEffect(() => {
        if (!user && !loading) router.replace("/");
    }, [user, loading]);

    useEffect(() => {
        const fetchSession = async () => {
            setFetching(true);
            const res = await fetch(`http://localhost:5000/api/training/${sessionId}`);
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
                <p className="text-3xl text-[var(--muted)]">Loading...</p>
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
        <main className="flex-1 flex items-center justify-center w-full h-full p-16">
            <div className="flex flex-col items-center justify-between w-full h-full max-w-400 space-y-16 relative">
                <div className="text-center">
                    <h1 className="text-5xl font-semibold">{drill.title}</h1>
                    <h2 className="text-2xl font-medium text-[var(--muted)]">{drill.type}</h2>
                </div>

                <div className="absolute top-0 right-0">
                    <button onClick={() => setSelectedDrill(drill)} className="flex items-center bg-[var(--primary)] rounded-lg shadow-lg p-4 cursor-pointer hover:scale-105">
                        View Drill<FaEye className="ml-2 text-2xl" />
                    </button>
                </div>

                <div className="flex w-full h-full space-x-16">
                    <div className="flex flex-col items-center justify-center bg-[var(--primary)] rounded-xl shadow-lg w-2/3 p-8 space-y-8">
                        {recording ? 
                            <video ref={videoRef} autoPlay className={`w-full ${paused ? "opacity-50" : ""}`} /> 
                        : mediaUrl ? 
                            <video src={mediaUrl} controls className="w-full" />
                        : 
                            <button onClick={start} className="flex items-center bg-[var(--secondary)] rounded-lg shadow-lg p-4 cursor-pointer hover:text-[var(--danger)]">
                                <FaMicrophone className="mr-2 text-2xl" />Record
                            </button>
                        }
                        
                        {recording && <div className="flex justify-center w-full space-x-4">
                            <button onClick={() => paused ? resume() : pause()} className="flex items-center bg-[var(--secondary)] rounded-lg shadow-lg p-4 cursor-pointer hover:text-[var(--muted)]">
                                {paused ? <FaPlay className="mr-2 text-xl" /> : <FaPause className="mr-2 text-xl" />}
                                {paused ? "Resume" : "Pause"}
                            </button>
                            <button onClick={stop} className="flex items-center bg-[var(--secondary)] rounded-lg shadow-lg p-4 cursor-pointer hover:text-[var(--success)]">
                                <FaSave className="mr-2 text-2xl" />Save
                            </button>
                        </div>}
                        {!recording && mediaUrl && <button onClick={restart} className="flex items-center bg-[var(--secondary)] rounded-lg shadow-lg p-4 cursor-pointer hover:text-[var(--danger)]">
                            <FaRedo className="mr-2 text-xl" />Restart
                        </button>}
                    </div>
                    <textarea 
                        placeholder="Take notes here..." 
                        className="flex-1 bg-[var(--secondary)] rounded-xl shadow-lg border p-4 whitespace-pre-line resize-none" 
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </div>

                <div className="flex justify-between w-full">
                    <button 
                        onClick={() => {handleUpdate(); router.push(`/training/${sessionId}/${Number(drillIndex) - 1}`)}} 
                        disabled={Number(drillIndex) === 0}
                        className={`flex items-center bg-[var(--accent)] rounded-lg shadow-lg p-4 ${Number(drillIndex) === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-105"}`}
                    >
                        <FaLongArrowAltLeft className="mr-2 text-2xl" />
                        Previous
                    </button>

                    <button 
                        onClick={() => {handleUpdate(); router.push(`${Number(drillIndex) === session.drills.length - 1 ? "/training/review" : `/training/${sessionId}/${Number(drillIndex) + 1}`}`)}} 
                        className="flex items-center bg-[var(--accent)] rounded-lg shadow-lg p-4 cursor-pointer hover:scale-105"
                    >
                        {Number(drillIndex) === session.drills.length - 1 ? "Finish" : "Next"}
                        <FaLongArrowAltRight className="ml-2 text-2xl" />
                    </button>
                </div>
            </div>

            <DrillModal preview={true} />
        </main>
    )
}