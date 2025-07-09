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
    const [ filters, setFilters ] = useState<{sport: string | null, difficulty: string | null, length: number[] | null}>({sport: null, difficulty: null, length: null});
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

    const lengthOptions = [
        { value: null, label: "All Lengths"},
        { value: [1, 2], label: "1-2 min" },
        { value: [2, 5], label: "2-5 min" },
        { value: [5, 10], label: "5-10 min" },
        { value: [10, 30], label: "10-30 min" },
        { value: [30, 60], label: ">30 min" },
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
                    (!filters.length || drill.time >= filters.length[0] && drill.time <= filters.length[1])
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
    
    if (!user || loading || fetching) {
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
                        options={lengthOptions}
                        placeholder="All Lengths"
                        value={filters.length ? lengthOptions.find(option => option && option.value && filters.length && option.value[0] === filters.length[0] && option.value[1] === filters.length[1]) : null}
                        onChange={selected => setFilters({...filters, length: selected ? selected.value : null})}
                        styles={dropdownStyles}
                        className="w-1/4 min-w-44 max-w-80"
                    />
                </div>
                
                {/* TODO: make search functional */}
                <input 
                    placeholder="Search"
                    className="bg-[var(--secondary)] placeholder-[var(--muted)] rounded-lg p-3 w-100 h-[38px] border"
                />
            </header>

            {!!drills.length && <main className="grid [grid-template-columns:repeat(auto-fit,minmax(24rem,1fr))] justify-items-center overflow-y-auto auto-rows-max gap-y-20">
                {drills.sort((drill1, drill2) => drill2.likes - drill1.likes).map((drill, index) => (
                    <DrillCard key={index} drillInfo={drill} username={usernames[index]} />
                ))}
                <DrillModal preview={false}/>
            </main>}
            {!drills.length && <main className="flex-1 flex items-center justify-center">
                <p className="text-3xl text-[var(--muted)] text-center">
                    No drills have been shared with these filters yet.<br/>
                    Become the first by creating your own{" "}
                    <Link href="/drills" className="text-[var(--link)] underline">here!</Link>
                </p>
            </main>}
        </div>
    )
}