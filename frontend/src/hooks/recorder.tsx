import { useRef, useState } from "react";

export function useRecorder() {
    const [recording, setRecording] = useState(false);
    const [paused, setPaused] = useState(false);
    const [mediaId, setMediaId] = useState<string | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunks = useRef<Blob[]>([]);

    const start = async () => {
        const userStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(userStream);
        mediaRecorderRef.current = new window.MediaRecorder(userStream);
        chunks.current = [];
        mediaRecorderRef.current.ondataavailable = (e) => chunks.current.push(e.data);
        mediaRecorderRef.current.start();
        setRecording(true);
    };

    const stop = async () => {
        return new Promise<string | null>((resolve, reject) => {
            mediaRecorderRef.current!.onstop = async () => {
                stream?.getTracks().forEach(track => track.stop());
                setStream(null);
                setRecording(false);
    
                const blob = new Blob(chunks.current, { type: "video/webm" });
                const formData = new FormData();
                formData.append("file", blob);
    
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/files`, {
                        method: "POST",
                        body: formData,
                    });
                    const data = await res.json();
                    if (res.ok) {
                        setMediaId(data.data);
                        resolve(data.data);
                    } else {
                        resolve(null);
                    }
                } catch (error) {
                    reject(error);
                }
            };
            mediaRecorderRef.current!.stop();
        });
    };

    const pause = () => {
        mediaRecorderRef.current?.pause();
        setPaused(true);
    };

    const resume = () => {
        mediaRecorderRef.current?.resume();
        setPaused(false);
    };

    const restart = async () => {
        setMediaId(null);
        setStream(null);
        setRecording(false);
        setPaused(false);
        await fetch(`${process.env.NEXT_PUBLIC_API}/api/files/${mediaId}`, {method: "DELETE"});
        return null;
    };

    return { start, stop, pause, resume, restart, recording, paused, mediaId, setMediaId, stream };
}
