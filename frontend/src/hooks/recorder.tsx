import { useRef, useState } from "react";

export function useRecorder() {
    const [recording, setRecording] = useState(false);
    const [paused, setPaused] = useState(false);
    const [mediaUrl, setMediaUrl] = useState<string | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunks = useRef<Blob[]>([]);

    const start = async () => {
        const userStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(userStream);
        mediaRecorderRef.current = new window.MediaRecorder(userStream);
        chunks.current = [];
        mediaRecorderRef.current.ondataavailable = (e) => chunks.current.push(e.data);
        mediaRecorderRef.current.onstop = () => {
            const blob = new Blob(chunks.current, { type: "video/webm" });
            const reader = new FileReader();
            reader.onload = () => setMediaUrl(reader.result as string);
            reader.readAsDataURL(blob);
            userStream.getTracks().forEach(track => track.stop());
            setStream(null);
        };
        mediaRecorderRef.current.start();
        setRecording(true);
    };

    const stop = () => {
        mediaRecorderRef.current?.stop();
        setRecording(false);
    };

    const pause = () => {
        mediaRecorderRef.current?.pause();
        setPaused(true);
    };

    const resume = () => {
        mediaRecorderRef.current?.resume();
        setPaused(false);
    };

    const restart = () => {
        setMediaUrl(null);
        setStream(null);
        setRecording(false);
        setPaused(false);
    };

    return { start, stop, pause, resume, restart, recording, paused, mediaUrl, setMediaUrl, stream };
}
