export type DrillType = {
    _id?: string;
    title: string;
    description: string;
    creator: {
        _id: string;
        username: string;
    };
    type: string;
    difficulty: string;
    time: number | null;
    sports: string[];
    media: string[];
    public: boolean;
    likes: number;
    usersLiked: string[];
    usersSaved: string[];
    createdAt: string;
    updatedAt: string;
};