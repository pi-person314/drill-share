import { Router } from "express";
import mongoose from "mongoose";
import multer from "multer";
import sharp from "sharp";
import { getBucket } from "../db.js";

const router = Router();
const upload = multer();

router.get("/:id", (req, res) => {
    try {
        const bucket = getBucket();
        const stream = bucket.openDownloadStream(new mongoose.Types.ObjectId(req.params.id));
        stream.pipe(res);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

router.post("/", upload.single("file"), async (req, res) => {
    try {
        const bucket = getBucket();
        const uploadStream = bucket.openUploadStream(req.file.originalname, { contentType: "image/webp" });
        sharp(req.file.buffer).webp({ quality: 50 }).pipe(uploadStream).on("finish", () => {
            res.status(201).json({ data: uploadStream.id, message: "File uploaded!" });
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
        console.log(error);
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const bucket = getBucket();
        await bucket.delete(new mongoose.Types.ObjectId(req.params.id));
        res.status(200).json({message: "File deleted!"});
    } catch (error) {
        res.status(500).json({message: "Server Error"});
        console.log(error);
    }
});

export default router;