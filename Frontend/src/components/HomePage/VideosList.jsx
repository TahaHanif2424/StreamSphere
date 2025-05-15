import { useState } from "react";
import VideoItem from "./VideoItem";
import { apiFetch } from "../../utils/api";

export default function VideosList({ videos, isChangeable = false, isOpenedOnChannels = false }) {
  const [stateVideos, setStateVideos] = useState(videos);
  console.log(stateVideos);

  const handleVideoDelete = async (id) => {
    const response = await apiFetch(`http://localhost:5000/video/delete/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Can't delete the video");
    setStateVideos(stateVideos.filter((video) => video._id !== id));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
      {stateVideos.map((video) => (
        <VideoItem
          key={video._id}
          isChangeable={isChangeable}
          onDelete={handleVideoDelete}
          isOpenedOnChannels={isOpenedOnChannels}
          {...video}
        />
      ))}
    </div>
  );
}
