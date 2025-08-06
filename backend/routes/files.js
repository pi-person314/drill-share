import { Router } from "express";
import mongoose from "mongoose";
import multer from "multer";
import sharp from "sharp";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";
import streamifier from "streamifier";
import { getBucket } from "../db.js";

const router = Router();
const upload = multer();
ffmpeg.setFfmpegPath(ffmpegPath.path);

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
        if (req.file.mimetype.startsWith("image/")) {
            try {
                await sharp(req.file.buffer).webp({ quality: 50 }).toBuffer();
            } catch (error) {
                return res.status(400).json({ message: "File type not supported." });
            }
            const uploadStream = bucket.openUploadStream(req.file.originalname, { contentType: "image/webp" });
            sharp(req.file.buffer).webp({ quality: 50 }).pipe(uploadStream).on("finish", () => {
                res.status(201).json({ data: uploadStream.id, message: "Image uploaded!" });
            });
        } else if (req.file.mimetype.startsWith("video/")) {
            const uploadStream = bucket.openUploadStream(req.file.originalname, { contentType: "video/webm" });
            const inputStream = streamifier.createReadStream(req.file.buffer);
            ffmpeg(inputStream).format("webm").outputOptions(["-preset veryfast", "-crf 28"]).pipe(uploadStream).on("finish", () => {
                res.status(201).json({ data: uploadStream.id, message: "Video uploaded!" });
            });
        } else {
            res.status(400).json({ message: "Invalid file type" });
        }
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