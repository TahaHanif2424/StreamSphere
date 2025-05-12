import VideoItem from "./VideoItem"

export default function VideosList(videos) {
    return <div className="flex flex-col items-center justify-center">
        {videos.map(video => <VideoItem {...video} key={video._id} />)}
    </div>
};