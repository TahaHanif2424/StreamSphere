const express = require("express");
const Video = require("../Model/Video");
const { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const S3 = require('../AWS/AWSConfig');
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage()
const upload = multer({ storage: storage });
const crypto = require('crypto');
const bucketName = process.env.BUCKET_NAME;
const sharp = require('sharp');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const fs = require("fs");
const path = require("path");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const { spawn } = require('child_process');
const os = require("os");

//Get all Videos
//URL http://localhost:5000/video/get-all

router.get("/get-all", async (req, res) => {
    try {
        const videos = await Video.find().populate("user_id", "channelName channelImageName");

        const signedVideos = await Promise.all(
            videos.map(async (video) => {
                if (!video.videoName) return video;

                const getVideoUrl = new GetObjectCommand({
                    Bucket: bucketName,
                    Key: video.videoName,
                });
                const videoUrl = await getSignedUrl(S3, getVideoUrl, { expiresIn: 3600 });

                let imageUrl = "";
                if (video.user_id?.channelImageName) {
                    const getImageUrl = new GetObjectCommand({
                        Bucket: bucketName,
                        Key: video.user_id.channelImageName,
                    });
                    imageUrl = await getSignedUrl(S3, getImageUrl, { expiresIn: 3600 });
                }

                return {
                    ...video.toObject(),
                    URL: videoUrl,
                    channelName: video.user_id?.channelName || "Default",
                    channelImageURL: imageUrl,
                };
            })
        );

        res.status(200).send(signedVideos);
    } catch (err) {
        console.error(err);
        res.status(400).send({ error: "Invalid Request" });
    }
});

// router.get("/get-all", async (req, res) => {
//     try {
//         // 1. Fetch all videos with their respective uploader info
//         const videos = await Video.find().populate("user_id", "channelName channelImageName");

//         // 2. Enhance each video object
//         const signedVideos = await Promise.all(
//             videos.map(async (video) => {
//                 if (!video.videoName) return video; // Skip if video not ready

//                 // 3. Construct a proxy URL to stream the video (master playlist)
//                 const proxyBaseUrl = `${process.env.BACKEND_BASE_URL || "http://localhost:5000"}/stream/${video._id}/master.m3u8`;

//                 // 4. Sign and include the channel's image URL
//                 let imageUrl = "";
//                 if (video.user_id?.channelImageName) {
//                     const getImageUrl = new GetObjectCommand({
//                         Bucket: bucketName,
//                         Key: video.user_id.channelImageName,
//                     });
//                     imageUrl = await getSignedUrl(S3, getImageUrl, { expiresIn: 3600 });
//                 }

//                 return {
//                     ...video.toObject(),
//                     hlsBaseUrl: proxyBaseUrl, // This will be used by the frontend HLS player
//                     channelName: video.user_id?.channelName || "Unknown Channel",
//                     channelImageURL: imageUrl,
//                 };
//             })
//         );

//         res.status(200).send(signedVideos);
//     } catch (err) {
//         console.error("Error fetching videos:", err);
//         res.status(400).send({ error: "Invalid Request" });
//     }
// });



//Find all videos of USER
//URL http://localhost:5000/video/get

router.get("/get", async (req, res) => {
    try {
        const user_id = req.body.user_id;
        const video = await Video.find({ user_id });
        res.status(200).send({ video });
    } catch (err) {
        return res.status(400).send({ error: "InValid Request" })
    }
});



//Add Video
//URL http://localhost:5000/video/add
// router.post("/add", upload.single("image"), async (req, res) => {
//     try {

//       const videoData = JSON.parse(req.body.data);


//     //   const buffer=await sharp(req.file.buffer).resize({height:1080,width:1920,fit:'contain'}).toBuffer();
//       const randomName= (bytes=32)=>crypto.randomBytes(bytes).toString('hex');
//       const videoName=randomName();
//       const params = {
//         Bucket: bucketName,
//         Key: videoName,
//         Body: req.file.buffer,
//         ContentType: req.file.mimetype, 
//       };

//       const command = new PutObjectCommand(params);
//       await S3.send(command);

//       const video = new Video(videoData);
//       video.videoName=videoName;
//       await video.save();

//       res.status(200).send(video);

//     } catch (err) {
//       console.error(err);
//       return res.status(400).send({ error: "Bad request", message: err.message });
//     }
//   });

router.post("/add", upload.single("image"), async (req, res) => {
    try {
        const videoData = JSON.parse(req.body.data);

        // Generate random names
        const randomName = (bytes = 8) => crypto.randomBytes(bytes).toString("hex");
        const fileId = randomName();
        const tempName = `${fileId}.mp4`;

        // Create temporary folder for processing
        const uploadFolder = path.join(os.tmpdir(), fileId);
        fs.mkdirSync(uploadFolder, { recursive: true });

        // Path for storing the uploaded video temporarily
        const tempPath = path.join(uploadFolder, tempName);
        fs.writeFileSync(tempPath, req.file.buffer);

        // Create HLS output folder within the temporary folder
        const hlsFolder = path.join(uploadFolder, "hls");
        fs.mkdirSync(hlsFolder, { recursive: true });

        // FFmpeg command using spawn instead of exec
        const ffmpeg = spawn('ffmpeg', [
            '-i', tempPath,
            '-filter_complex', '[0:v]split=3[v1][v2][v3];[v1]scale=640:360[v360];[v2]scale=854:480[v480];[v3]scale=1280:720[v720]',
            '-map', '[v360]', '-map', 'a', '-c:v:0', 'libx264', '-b:v:0', '800k', '-c:a', 'aac',
            '-f', 'hls', '-hls_time', '5', '-hls_playlist_type', 'vod',
            '-hls_segment_filename', path.join(hlsFolder, '360p_%03d.ts'),
            path.join(hlsFolder, '360p.m3u8'),
            '-map', '[v480]', '-map', 'a', '-c:v:1', 'libx264', '-b:v:1', '1400k', '-c:a', 'aac',
            '-f', 'hls', '-hls_time', '5', '-hls_playlist_type', 'vod',
            '-hls_segment_filename', path.join(hlsFolder, '480p_%03d.ts'),
            path.join(hlsFolder, '480p.m3u8'),
            '-map', '[v720]', '-map', 'a', '-c:v:2', 'libx264', '-b:v:2', '2800k', '-c:a', 'aac',
            '-f', 'hls', '-hls_time', '5', '-hls_playlist_type', 'vod',
            '-hls_segment_filename', path.join(hlsFolder, '720p_%03d.ts'),
            path.join(hlsFolder, '720p.m3u8')
        ]);

        // Handle process execution
        return new Promise((resolve, reject) => {
            let stdoutData = '';
            let stderrData = '';

            ffmpeg.stdout.on('data', (data) => {
                stdoutData += data.toString();
                console.log(`FFmpeg stdout: ${data}`);
            });

            ffmpeg.stderr.on('data', (data) => {
                stderrData += data.toString();
                console.log(`FFmpeg stderr: ${data}`);  // FFmpeg outputs most info to stderr
            });

            ffmpeg.on('close', (code) => {
                console.log(`FFmpeg process exited with code ${code}`);
                
                if (code !== 0) {
                    return reject(new Error(`FFmpeg process failed with code ${code}: ${stderrData}`));
                }

                try {
                    // Create the master playlist
                    const outputMasterPlaylist = path.join(hlsFolder, "master.m3u8");
                    const masterPlaylistContent = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360
360p.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=1400000,RESOLUTION=854x480
480p.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=2800000,RESOLUTION=1280x720
720p.m3u8
`;
                    fs.writeFileSync(outputMasterPlaylist, masterPlaylistContent);

                    // Verify files were created
                    const files = fs.readdirSync(hlsFolder);
                    console.log("Files generated:", files);

                    // Upload to S3
                    const baseS3Key = `videos/${fileId}`;
                    
                    // Loop through all created files
                    const uploadPromises = files.map(file => {
                        const filePath = path.join(hlsFolder, file);
                        const uploadParams = {
                            Bucket: bucketName,
                            Key: `${baseS3Key}/${file}`,
                            Body: fs.readFileSync(filePath),
                            ContentType: file.endsWith(".m3u8") ? "application/x-mpegURL" : "video/MP2T"
                        };
                        return S3.send(new PutObjectCommand(uploadParams));
                    });

                    Promise.all(uploadPromises).then(() => {
                        // Save video metadata to MongoDB
                        const video = new Video(videoData);
                        video.videoName = `${baseS3Key}/master.m3u8`;
                        video.save().then(savedVideo => {
                            // Cleanup temporary files
                            fs.rmSync(uploadFolder, { recursive: true, force: true });
                            resolve(savedVideo);
                            res.status(200).send(savedVideo);
                        }).catch(err => {
                            reject(err);
                            res.status(500).send({ error: "Failed to save video metadata", message: err.message });
                        });
                    }).catch(err => {
                        reject(err);
                        res.status(500).send({ error: "S3 upload failed", message: err.message });
                    });
                } catch (err) {
                    reject(err);
                    res.status(500).send({ error: "Failed to process video", message: err.message });
                }
            });
        });

    } catch (err) {
        console.error("HLS Upload Error:", err);
        return res.status(400).send({ error: "Video processing failed", message: err.message });
    }
});

//Delete Video
//URL http://localhost:5000/video/delete:id
router.delete("/delete/:id", async (req, res) => {
    try {
        const video_id = req.params.id;
        const deleteVideo = await Video.findById(video_id);
        const params = {
            Bucket: bucketName,
            Key: deleteVideo.videoName,
        };
        const command = new DeleteObjectCommand(params);
        await S3.send(command);
        await Video.deleteOne({ _id: video_id });
        if (deleteVideo) {
            return res.status(200).send({ message: "Video deleted successfully" });
        }
        else {
            return res.status(500).send({ message: "Error while deleting video" });
        }
    } catch (err) {
        return res.status(400).send({ error: "Bad request" });
    }
});


//Update Video
//URL http://localhost:5000/video/update:id
router.put("/update/:id", async (req, res) => {
    try {
        const video_id = req.params.id;
        const updatedparameter = req.body;
        const updatedVideo = await Video.findByIdAndUpdate(
            video_id,
            updatedparameter,
            { new: true, runValidators: true }
        );
        if (updatedVideo) {
            return res.status(200).send({
                message: "Video updated successfully",
                data: updatedVideo
            });
        }
        else {
            return res.status(500).send({ message: "Error while updating video" });
        }
    } catch (err) {
        return res.status(400).send({ error: "Bad request" });
    }
});




// Proxy Route to stream HLS video files from S3
// Example: http://localhost:5000/video/stream/:videoId/:filename
// router.get("/stream/:videoId/:filename", async (req, res) => {
//     const { videoId, filename } = req.params;
//     const s3Key = `videos/${videoId}/${filename}`;

//     const command = new GetObjectCommand({
//         Bucket: bucketName,
//         Key: s3Key,
//     });

//     try {
//         const data = await S3.send(command);

//         // Set appropriate content type for HLS streaming
//         if (filename.endsWith(".m3u8")) {
//             res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
//         } else if (filename.endsWith(".ts")) {
//             res.setHeader("Content-Type", "video/MP2T");
//         } else {
//             res.setHeader("Content-Type", "application/octet-stream");
//         }

//         data.Body.pipe(res);
//     } catch (err) {
//         console.error("Streaming error:", err);
//         res.status(404).send("Video segment not found");
//     }
// });

module.exports = router;