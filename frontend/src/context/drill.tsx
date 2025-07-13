"use client";
import { DrillType } from "@/types/drill";
import { createContext, useContext, useState, ReactNode } from "react";

type DrillContextType = {
    drills: DrillType[];
    setDrills: (newDrills: DrillType[]) => void;
    selectedDrill: DrillType | null;
    setSelectedDrill: (newDrill: DrillType | null) => void;
};

const DrillContext = createContext<DrillContextType>({
    drills: [],
    setDrills: () => {},
    selectedDrill: null,
    setSelectedDrill: () => {},
});

export function DrillProvider({ children }: { children: ReactNode }) {
    const [ drills, setDrills ] = useState<DrillType[]>([]);
    const [ selectedDrill, setSelectedDrill ] = useState<DrillType | null>(null);

    return (
        <DrillContext.Provider value={{ drills, setDrills, selectedDrill, setSelectedDrill }}>
            {children}
        </DrillContext.Provider>
    );
}

export function useDrill() {
    return useContext(DrillContext);
}