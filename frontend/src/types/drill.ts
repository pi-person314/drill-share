export type DrillType = {
    _id?: string;
    title: string;
    description: string;
    creator: string;
    type: string;
    difficulty: string;
    time: number;
    sports: string[];
    media: string[];
    public: boolean;
    likes: number;
    usersLiked: string[];
    usersSaved: string[];
    createdAt: string;
    updatedAt: string;
};