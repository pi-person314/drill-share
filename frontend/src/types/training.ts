import { DrillType } from "./drill";

export type TrainingType = {
    _id: string;
    title: string;
    drills: DrillType[];
    videos: string[];
    notes: string[];
    updatedAt: string;
    visited: number;
}