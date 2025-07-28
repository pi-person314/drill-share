import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";

let bucket;

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO);
        bucket = new GridFSBucket(conn.connection.db, {bucketName: "uploads"});
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
};

export const getBucket = () => bucket;