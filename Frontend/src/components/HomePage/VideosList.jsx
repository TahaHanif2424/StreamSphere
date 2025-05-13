import { useState } from "react";
import VideoItem from "./VideoItem";

export default function VideosList({ videos, isChangeable = false }) {
  const [stateVideos, setStateVideos] = useState(videos);

  const handleVideoDelete = async (id) => {
    const response = await fetch(`http://localhost:5000/videos/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Can't delete the video");
    setStateVideos(stateVideos.filter((video) => video.id !== id));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
      {stateVideos.map((video) => (
        <VideoItem
          key={video._id}
          isChangeable={isChangeable}
          onDelete={handleVideoDelete}
          {...video}
        />
      ))}
    </div>
  );
}
