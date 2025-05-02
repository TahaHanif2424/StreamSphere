import VideoItem from "./VideoItem";

export default function VideosList({videos}) {
    return <>
    {videos.map(video => <VideoItem {...video} />)}
    </>
}