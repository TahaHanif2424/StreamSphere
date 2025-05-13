import { useRouteLoaderData } from "react-router";
import VideosList from "../components/VideoPage/VideosList";

export default function VideoPage() {
    const data = useRouteLoaderData('video');
    return <div className="flex p-5 justify-between">
        <div className="flex flex-col gap-3">
            <video src={data.destinationVideo} alt="main-video" />
            {/* <CommentsList /> */}
        </div>
        <VideosList videos={data.videos} />
    </div>
};

export async function loader({params}) {
    const response = await fetch('http://localhost:5000/video/get-all');

    if(!response.ok) throw new Error('Error fetching the video data');

    const responseData = await response.json();
    let destinationVideo = null;

   const videos = responseData.filter(video => {
    if(video._id === params.videoId)
        destinationVideo = video;

    return video._id !== params.videoId;
   });

   if(!destinationVideo) {
    throw new Error('Cant find the requried Video');
   }

    return {destinationVideo, videos};
};