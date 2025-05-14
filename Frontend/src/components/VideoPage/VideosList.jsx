import VideoItem from "./VideoItem"

export default function VideosList({ videos }) {
  return (
    <div className="flex flex-col divide-y divide-gray-200">
      {videos.map((video) => (
        <VideoItem key={video._id} {...video} />
      ))}
    </div>
  );
}