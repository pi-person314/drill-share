"use client";
import CreateModal from "@/components/CreateModal";
import DrillCard from "@/components/DrillCard";
import DrillModal from "@/components/DrillModal";
import { useAuth } from "@/hooks/auth";
import { useDrill } from "@/hooks/drill";
import dropdownStyles from "@/styles/dropdown";
import { DrillType } from "@/types/drill";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FaArrowDownUpAcrossLine, FaCirclePlus } from "react-icons/fa6";
import Select from "react-select";

export default function Drills() {
    const { user, loading } = useAuth();
    const { drills, setDrills } = useDrill();
    const router = useRouter();
    const [ createdDrills, setCreatedDrills ] = useState<DrillType[]>([]);
    const [ savedDrills, setSavedDrills ] = useState<DrillType[]>([]);
    const [ fetching, setFetching ] = useState(true);
    const [ createOpen, setCreateOpen ] = useState(false);
    const [ mySort, setMySort ] = useState("created");
    const [ myReverse, setMyReverse ] = useState(false);
    const [ savedSort, setSavedSort ] = useState("difficulty");
    const [ savedReverse, setSavedReverse ] = useState(false);

    const mySortOptions = [
        { value: "created", label: `${myReverse ? "First" : "Last"} Created` },
        { value: "updated", label: `${myReverse ? "First" : "Last"} Updated` },
        { value: "likes", label: `${myReverse ? "Least" : "Most"} Likes` },
        { value: "alpha", label: `${myReverse ? "Reverse" : ""} Alphabetical` }
    ];

    const savedSortOptions = [
        { value: "difficulty", label: `${savedReverse ? "Hardest" : "Easiest"} Difficulty` },
        { value: "time", label: `${savedReverse ? "Longest" : "Shortest"} Time` },
        { value: "likes", label: `${savedReverse ? "Least" : "Most"} Likes` },
        { value: "alpha", label: `${savedReverse ? "Reverse" : ""} Alphabetical` }
    ];

    const fetchDrills = async (first: boolean) => {
        if (first) setFetching(true);
        const createdRes = await fetch(`${process.env.NEXT_PUBLIC_API}/api/drills/created/${user}`);
        const savedRes = await fetch(`${process.env.NEXT_PUBLIC_API}/api/drills/saved/${user}`);
        if (createdRes.ok && savedRes.ok) {
            const createdData = await createdRes.json();
            const savedData = await savedRes.json();
            setCreatedDrills(createdData.data);
            setSavedDrills(savedData.data);
            if (first) setDrills([...createdData.data, ...savedData.data]);
        }
        if (first) setFetching(false);
    }

    useEffect(() => {
        if (!user && !loading) {
            router.replace("/");
            return;
        }
        fetchDrills(true);
    }, [user, loading]);

    useEffect(() => {
        fetchDrills(false);
    }, [drills]);

    const sortedCreatedDrills = useMemo(() => {
        const sorted = [...createdDrills];

        if (mySort === "created") sorted.sort((drill1, drill2) => (myReverse ? -1 : 1) * (new Date(drill2.createdAt).getTime() - new Date(drill1.createdAt).getTime()));
        else if (mySort === "updated") sorted.sort((drill1, drill2) => (myReverse ? -1 : 1) * (new Date(drill2.updatedAt).getTime() - new Date(drill1.updatedAt).getTime()));
        else if (mySort === "likes") sorted.sort((drill1, drill2) => (myReverse ? -1 : 1) * (drill2.likes - drill1.likes));
        else sorted.sort((drill1, drill2) => (myReverse ? -1 : 1) * drill1.title.toLowerCase().localeCompare(drill2.title.toLowerCase()));
        
        return sorted;
    }, [createdDrills, mySort, myReverse]);

    const sortedSavedDrills = useMemo(() => {
        const sorted = [...savedDrills];

        if (savedSort === "difficulty") sorted.sort((drill1, drill2) => (savedReverse ? -1 : 1) * (drill1.difficulty.localeCompare(drill2.difficulty)));
        else if (savedSort === "time") sorted.sort((drill1, drill2) => (savedReverse ? -1 : 1) * (drill1.time! - drill2.time!));
        else if (savedSort === "likes") sorted.sort((drill1, drill2) => (savedReverse ? -1 : 1) * (drill2.likes - drill1.likes));
        else sorted.sort((drill1, drill2) => (savedReverse ? -1 : 1) * drill1.title.toLowerCase().localeCompare(drill2.title.toLowerCase()));
        
        return sorted;
    }, [savedDrills, savedSort, savedReverse]);

    if (!user || loading || fetching) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-3xl text-[var(--muted)] animate-pulse">Loading...</p>
            </div>
        )
    }

    return (
        <main className="flex-1 flex flex-col justify-evenly p-16 pt-0 overflow-y-auto">
            <div id="my-drills" className="space-y-6">
                <h1 className="text-3xl font-semibold text-center mt-16 mb-4">My Drills</h1>
                <div className="flex justify-center items-center justify-self-center space-x-4">
                    <p>Sort By:</p>
                    <Select 
                        options={mySortOptions}
                        value={mySortOptions.find(option => option.value === mySort)}
                        onChange={selected => setMySort(selected ? selected.value : "created")}
                        styles={dropdownStyles}
                        className="w-60"
                    />
                    <FaArrowDownUpAcrossLine onClick={() => setMyReverse(!myReverse)} className="text-xl duration-300 hover:text-[var(--muted)] cursor-pointer"/>
                </div>
                {!!sortedCreatedDrills.length && <div className="grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] lg:grid-cols-[repeat(auto-fit,minmax(17.5rem,1fr))] justify-items-center overflow-x-hidden overflow-y-auto gap-16 p-8 border rounded-2xl shadow-lg">
                    <button onClick={() => setCreateOpen(true)}>
                        <FaCirclePlus className="text-[var(--accent)] text-9xl lg:text-[10rem] duration-300 hover:scale-110 cursor-pointer"/>
                    </button>
                    {sortedCreatedDrills.map((drill, index) => (
                        <DrillCard key={index} drillInfo={drill} />
                    ))}
                </div>}
                {!sortedCreatedDrills.length && <div className="flex items-center justify-center h-70">
                    <button onClick={() => setCreateOpen(true)}>
                        <FaCirclePlus className="text-[var(--accent)] text-9xl lg:text-[10rem] duration-300 hover:scale-110 cursor-pointer"/>
                    </button>
                </div>}
            </div>

            <div id="saved-drills" className="space-y-6">
                <h1 className="text-3xl font-semibold text-center mt-16 mb-4">Saved Drills</h1>
                <div className="flex justify-center items-center justify-self-center space-x-4">
                    <p>Sort By:</p>
                    <Select 
                        options={savedSortOptions}
                        value={savedSortOptions.find(option => option.value === savedSort)}
                        onChange={selected => setSavedSort(selected ? selected.value : "likes")}
                        styles={dropdownStyles}
                        className="w-60"
                    />
                    <FaArrowDownUpAcrossLine onClick={() => setSavedReverse(!savedReverse)} className="text-xl duration-300 hover:text-[var(--muted)] cursor-pointer"/>
                </div>
                {!!sortedSavedDrills.length && <div className="grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] lg:grid-cols-[repeat(auto-fit,minmax(17.5rem,1fr))] justify-items-center overflow-x-hidden overflow-y-auto gap-16 p-8 border rounded-2xl shadow-lg">
                    {sortedSavedDrills.map((drill, index) => (
                        <DrillCard key={index} drillInfo={drill} />
                    ))}
                </div>}
                {!sortedSavedDrills.length && <div className="flex items-center justify-center h-70">
                    <p className="text-xl text-[var(--muted)] text-center">
                        No drills have been saved yet.<br/>
                        Feel free to browse through shared drills{" "}
                        <Link href="/browse" className="text-[var(--link)] underline cursor-pointer">here!</Link>
                    </p>
                </div>}
            </div>

            <DrillModal />
            <CreateModal update={false} open={createOpen} setOpen={setCreateOpen}/>
        </main>
    )
}