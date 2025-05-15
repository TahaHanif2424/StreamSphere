import VideoItem from "./VideoItem";

export default function VideosList({ videos }) {
  return (
    <div className="flex flex-col bg-slate-900 h-max overflow-y-auto custom-scrollbar">
      {videos.map((video) => (
        <VideoItem key={video._id} {...video} />
      ))}
    </div>
  );
}
