"use client";
import DrillCard from "@/components/DrillCard";
import { useAuth } from "@/context/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DrillModal from "@/components/DrillModal";
import { DrillType } from "@/types/drill";
import { useDrill } from "@/context/drill";
import Select from "react-select";
import dropdownStyles from "@/styles/dropdown";

export default function Browse() {
    const { user, loading } = useAuth();
    const { drills, setDrills } = useDrill();
    const [ usernames, setUsernames ] = useState<string[]>([]);
    const [ fetching, setFetching ] = useState(true);
    const [ filters, setFilters ] = useState<{sport: string | null, difficulty: string | null, time: number[] | null, query: string | null}>({
        sport: null, difficulty: null, time: null, query: null
    });
    const router = useRouter();

    const sportsOptions = [
        { value: null, label: "All Sports"},
        { value: "Soccer", label: "Soccer" },
        { value: "Basketball", label: "Basketball" },
        { value: "Tennis", label: "Tennis" },
        { value: "Volleyball", label: "Volleyball" },
        { value: "Baseball", label: "Baseball" }
    ];

    const difficultyOptions = [
        { value: null, label: "All Difficulties"},
        { value: "Beginner", label: "Beginner" },
        { value: "Amateur", label: "Amateur" },
        { value: "Pro", label: "Pro" }
    ];

    const timeOptions = [
        { value: null, label: "All Lengths"},
        { value: [1, 2], label: "1-2 min" },
        { value: [2, 5], label: "2-5 min" },
        { value: [5, 10], label: "5-10 min" },
        { value: [10, 20], label: "10-20 min" },
        { value: [20, 30], label: "20-30 min" },
        { value: [30, 60], label: "30-60 min" },
        { value: [60, 120], label: "1-2 hrs" },
        { value: [120, 9999], label: "2+ hrs" }
    ]

    const getUsername = async ( uid: string ) => {
        const res = await fetch(`http://localhost:5000/api/users/${uid}`);
        if (res.ok) {
            const data = await res.json();
            return data.data.username;
        } else {
            return "Deleted User";
        }
    }

    const arraysEqual = (a: number[] | null, b: number[] | null): boolean => {
        return a !== null && b !== null && a[0] === b[0] && a[1] === b[1];
    };

    const editDistance = (a: string, b: string): number => {
        a = a.toLowerCase(); 
        b = b.toLowerCase();
        const n = a.length;
        const m = b.length;
        const dp = Array.from({length: n+1}, () => Array(m+1).fill(0));

        for (let i=0; i<=n; i++) dp[i][0] = i;
        for (let j=0; j<=m; j++) dp[0][j] = j;
        
        for (let i=1; i<=n; i++) {
            for (let j=1; j<=m; j++) {
                if (a[i-1] === b[j-1]) dp[i][j] = dp[i-1][j-1];
                else dp[i][j] = Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1;
            }
        }
        
        return dp[n][m] / Math.max(n, m);
    }

    useEffect(() => {
        if (!user && !loading) router.replace("/");

        const fetchDrills = async () => {
            setFetching(true);
            const res = await fetch("http://localhost:5000/api/drills/public");
            if (res.ok) {
                const data = await res.json();
                const allUsernames = await Promise.all(
                    data.data.map(async (drill: DrillType) => await getUsername(drill.creator))
                );
                setDrills(data.data);
                setUsernames(allUsernames);
            }
            setFetching(false);
        }
        fetchDrills();
    }, [user, loading]);

    useEffect(() => {
        const filterDrills = async () => {
            setFetching(true);
            const res = await fetch("http://localhost:5000/api/drills/public");
            if (res.ok) {
                const data = await res.json();
                const filteredDrills = data.data.filter((drill : DrillType) => (
                    (!filters.sport || drill.sports.includes(filters.sport)) && 
                    (!filters.difficulty || drill.difficulty === filters.difficulty) &&
                    (!filters.time || drill.time >= filters.time[0] && drill.time <= filters.time[1]) &&  
                    (!filters.query || editDistance(drill.name, filters.query) <= 0.3)
                ));
                const filteredUsernames = await Promise.all(
                    filteredDrills.map(async (drill: DrillType) => await getUsername(drill.creator))
                );
                setDrills(filteredDrills);
                setUsernames(filteredUsernames);
            }
            setFetching(false);
        }
        filterDrills();
    }, [filters])
    
    if (!user || loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-3xl text-[var(--muted)]">Loading...</p>
            </div>
        )
    }

    return (
        <div className="flex-1 flex flex-col p-16 space-y-8">
            <header className="flex justify-between w-full p-6 rounded-xl bg-[var(--primary)]">
                <div className="flex w-full space-x-4">
                    <Select 
                        options={sportsOptions}
                        placeholder="All Sports"
                        value={filters.sport ? sportsOptions.find(option => option.value === filters.sport) : null}
                        onChange={selected => setFilters({...filters, sport: selected ? selected.value : null})}
                        styles={dropdownStyles}
                        className="w-1/4 min-w-44 max-w-80"
                    />
                    <Select 
                        options={difficultyOptions}
                        placeholder="All Difficulties"
                        value={filters.difficulty ? difficultyOptions.find(option => option.value === filters.difficulty) : null}
                        onChange={selected => setFilters({...filters, difficulty: selected ? selected.value : null})}
                        styles={dropdownStyles}
                        className="w-1/4 min-w-44 max-w-80"
                    />
                    <Select 
                        options={timeOptions}
                        placeholder="All Lengths"
                        value={filters.time ? timeOptions.find(option => arraysEqual(option.value, filters.time)) : null}
                        onChange={selected => setFilters({...filters, time: selected ? selected.value : null})}
                        styles={dropdownStyles}
                        className="w-1/4 min-w-44 max-w-80"
                    />
                </div>
                
                <input 
                    placeholder="Search"
                    value={filters.query || ""}
                    onChange={e => setFilters({...filters, query: e.target.value || null})}
                    className="bg-[var(--secondary)] placeholder-[var(--muted)] rounded-lg p-3 w-120 h-[38px] border"
                />
            </header>

            {!!drills.length && !fetching && <main className="grid [grid-template-columns:repeat(auto-fit,minmax(24rem,1fr))] justify-items-center overflow-y-auto auto-rows-max gap-y-20">
                {drills.sort((drill1, drill2) => drill2.likes - drill1.likes).map((drill, index) => (
                    <DrillCard key={index} drillInfo={drill} username={usernames[index]} />
                ))}
                <DrillModal preview={false}/>
            </main>}
            {!drills.length && !fetching && <main className="flex-1 flex items-center justify-center">
                <p className="text-3xl text-[var(--muted)] text-center">
                    No shared drills match these filters yet.<br/>
                    Create your own{" "}
                    <Link href="/drills" className="text-[var(--link)] underline">here!</Link>
                </p>
            </main>}
            {fetching && <div className="flex-1 flex items-center justify-center">
                <p className="text-3xl text-[var(--muted)]">Loading...</p>
            </div>}
        </div>
    )
}