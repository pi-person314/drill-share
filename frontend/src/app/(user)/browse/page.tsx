"use client";
import DrillCard from "@/components/DrillCard";
import { useAuth } from "@/hooks/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DrillModal from "@/components/DrillModal";
import { DrillType } from "@/types/drill";
import { useDrill } from "@/hooks/drill";
import Select from "react-select";
import dropdownStyles from "@/styles/dropdown";

export default function Browse() {
    const { user, loading } = useAuth();
    const { drills, setDrills } = useDrill();
    const [ fetching, setFetching ] = useState(true);
    const [ filters, setFilters ] = useState<{sport: string | null, type: string | null, difficulty: string | null, time: number[] | null, query: string | null}>({
        sport: null, type: null, difficulty: null, time: null, query: null
    });
    const router = useRouter();

    const sportsOptions = [
        { value: null, label: "Any Sport"},
        { value: "General", label: "General" },
        { value: "Soccer", label: "Soccer" },
        { value: "Basketball", label: "Basketball" },
        { value: "Tennis", label: "Tennis" },
        { value: "Volleyball", label: "Volleyball" },
        { value: "Baseball", label: "Baseball" }
    ];

    const typeOptions = [
        { value: null, label: "Any Type"},
        { value: "Warmup", label: "Warmup" },
        { value: "Technique", label: "Technique" },
        { value: "Conditioning", label: "Conditioning" },
        { value: "Strategy", label: "Strategy" },
        { value: "Cooldown", label: "Cooldown" }
    ];

    const difficultyOptions = [
        { value: null, label: "Any Difficulty"},
        { value: "Beginner", label: "Beginner" },
        { value: "Intermediate", label: "Intermediate" },
        { value: "Pro", label: "Pro" }
    ];

    const timeOptions = [
        { value: null, label: "Any Length"},
        { value: [1, 2], label: "1-2 min" },
        { value: [2, 5], label: "2-5 min" },
        { value: [5, 10], label: "5-10 min" },
        { value: [10, 20], label: "10-20 min" },
        { value: [20, 30], label: "20-30 min" },
        { value: [30, 60], label: "30-60 min" },
        { value: [60, 120], label: "1-2 hrs" },
        { value: [120, 9999], label: "2+ hrs" }
    ]

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
                setDrills(data.data);
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
                    (!filters.type || drill.type === filters.type) &&
                    (!filters.difficulty || drill.difficulty === filters.difficulty) &&
                    (!filters.time || drill.time >= filters.time[0] && drill.time <= filters.time[1]) &&  
                    (!filters.query || editDistance(drill.title, filters.query) <= 0.3)
                ));
                setDrills(filteredDrills);
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
        <div className="flex-1 flex flex-col items-center space-y-4 p-16">
            <header className="flex flex-col justify-evenly [@media(min-width:90rem)]:w-full max-w-300 [@media(min-width:90rem)]:h-auto space-y-20 [@media(min-width:90rem)]:space-y-6 p-8 rounded-xl bg-[var(--primary)]">
                <div className="flex flex-col [@media(min-width:90rem)]:flex-row items-center w-full space-y-4 [@media(min-width:90rem)]:space-y-0 [@media(min-width:90rem)]:space-x-8">
                    <h1 className="text-xl">Filters:</h1>
                    <Select 
                        options={sportsOptions}
                        placeholder="Any Sport"
                        value={filters.sport ? sportsOptions.find(option => option.value === filters.sport) : null}
                        onChange={selected => setFilters({...filters, sport: selected ? selected.value : null})}
                        styles={dropdownStyles}
                        className="flex-1 min-w-44"
                    />
                    <Select 
                        options={typeOptions}
                        placeholder="Any Type"
                        value={filters.type ? typeOptions.find(option => option.value === filters.type) : null}
                        onChange={selected => setFilters({...filters, type: selected ? selected.value : null})}
                        styles={dropdownStyles}
                        className="flex-1 min-w-44"
                    />
                    <Select 
                        options={difficultyOptions}
                        placeholder="Any Difficulty"
                        value={filters.difficulty ? difficultyOptions.find(option => option.value === filters.difficulty) : null}
                        onChange={selected => setFilters({...filters, difficulty: selected ? selected.value : null})}
                        styles={dropdownStyles}
                        className="flex-1 min-w-44"
                    />
                    <Select 
                        options={timeOptions}
                        placeholder="Any Length"
                        value={filters.time ? timeOptions.find(option => arraysEqual(option.value, filters.time)) : null}
                        onChange={selected => setFilters({...filters, time: selected ? selected.value : null})}
                        styles={dropdownStyles}
                        className="flex-1 min-w-44"
                    />
                </div>
                <input 
                    placeholder="Search"
                    value={filters.query || ""}
                    onChange={e => setFilters({...filters, query: e.target.value || null})}
                    className="bg-[var(--secondary)] placeholder-[var(--muted)] rounded-lg p-3 w-full h-[38px] border"
                />
            </header>

            {!!drills.length && !fetching && <main className="grid [grid-template-columns:repeat(auto-fit,minmax(24rem,1fr))] justify-items-center h-full w-full overflow-x-hidden overflow-y-auto auto-rows-max pt-20 gap-y-20">
                {drills.sort((drill1, drill2) => drill2.likes - drill1.likes).map((drill, index) => (
                    <DrillCard key={index} drillInfo={drill} />
                ))}
                <DrillModal preview={false}/>
            </main>}
            {!drills.length && !fetching && <main className="flex-1 flex items-center justify-center">
                <p className="text-3xl text-[var(--muted)] text-center">
                    No shared drills match these filters yet.<br/>
                    Create your own{" "}
                    <Link href="/drills#my-drills" className="text-[var(--link)] underline">here!</Link>
                </p>
            </main>}
            {fetching && <div className="flex-1 flex items-center justify-center">
                <p className="text-3xl text-[var(--muted)]">Loading...</p>
            </div>}
        </div>
    )
}