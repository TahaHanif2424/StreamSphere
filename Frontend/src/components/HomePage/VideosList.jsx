import { useState } from "react";
import VideoItem from "./VideoItem";

export default function VideosList({videos, isChangeable = false}) {
    const [stateVideos, setStateVideos] = useState(videos);

    const handleVideoDelete = async id => {
        const response = await fetch(`http://localhost:5000/videos/${id}`, {
            method: 'DELETE'
        });
        if(!response.ok) throw new Error('Cant delete the video');
        const newVideos = stateVideos.filter(video => video.id !== id);
        setStateVideos(newVideos);
    }

    return <>
    {videos.map(video => <VideoItem isChangeable={isChangeable} onDelete={handleVideoDelete} {...video} />)}
    </>
}