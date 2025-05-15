import VideoItem from "./VideoItem";

export default function VideosList({ videos }) {
  return (
    <div className="flex flex-col divide-y divide-gray-700 max-h-[600px] overflow-y-auto custom-scrollbar">
      {videos.map((video) => (
        <VideoItem key={video._id} {...video} />
      ))}
    </div>
  );
}
