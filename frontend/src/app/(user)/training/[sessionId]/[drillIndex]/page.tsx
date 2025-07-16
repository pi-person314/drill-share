"use client";
import { useParams } from "next/navigation";

export default function RecordPage() {
    const { sessionId, drillIndex } = useParams();

    return (
        <main className="flex-1 flex flex-col items-center justify-center">
            <p>Session ID: {sessionId}</p>
            <p>Drill Index: {drillIndex}</p>
        </main>
    )
}