"use client";
import { DrillType } from "@/types/drill";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type DrillContextType = {
    drills: DrillType[];
    setDrills: (newDrills: DrillType[]) => void;
    usernames: string[];
    setUsernames: (newUsernames: string[]) => void;
    selectedDrill: DrillType | null;
    setSelectedDrill: (newDrill: DrillType | null) => void;
    selectedUsername: string | null;
    setSelectedUsername: (newUsername: string | null) => void;
};

const DrillContext = createContext<DrillContextType>({
    drills: [],
    setDrills: () => {},
    usernames: [],
    setUsernames: () => {},
    selectedDrill: null,
    setSelectedDrill: () => {},
    selectedUsername: null,
    setSelectedUsername: () => {}
});

export function DrillProvider({ children }: { children: ReactNode }) {
    const [ drills, setDrills ] = useState<DrillType[]>([]);
    const [ usernames, setUsernames ] = useState<string[]>([]);
    const [ selectedDrill, setSelectedDrill ] = useState<DrillType | null>(null);
    const [ selectedUsername, setSelectedUsername ] = useState<string | null>(null);

    return (
        <DrillContext.Provider value={{ 
            drills, setDrills, usernames, setUsernames, selectedDrill, setSelectedDrill, selectedUsername, setSelectedUsername 
        }}>
            {children}
        </DrillContext.Provider>
    );
}

export function useDrill() {
    return useContext(DrillContext);
}