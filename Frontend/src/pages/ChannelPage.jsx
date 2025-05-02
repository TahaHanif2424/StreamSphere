import { Suspense } from "react";
import { useSelector } from "react-redux";
import { Await, defer, useLoaderData, useParams } from "react-router";
import VideosList from "../components/HomePage/VideosList";

export default function ChannelPage() {
  const { videos } = useLoaderData();
  const { channelName } = useParams();
  const currUser = useSelector((state) => state.user.user);

  return (
    <div className="flex">
      <h1>{channelName}</h1>
      {channelName === currUser && (
        <button onClick={handleUploadClick} className="bg-white font-semibold text-lg rounded-md text-green-600 hover:bg-green-600 hover:text-white">
          Upload New Video
        </button>
      )}
      <Suspense fallback={<div>Loading....</div>}>
        <Await resolve={videos} children={loadedVideos => <VideosList videos={loadedVideos}/>} />
      </Suspense>
    </div>
  );
}

async function loadChannelVideos(channelName) {
  const response = await fetch(
    "http:localhost:5000/videos?channel=" + channelName
  );
  if (!response.ok) throw new Error("could not fetch the videos");
  const responseData = response.json();
  return responseData;
}

export async function loader({ request, params }) {
  const channelName = params.channelName;
  return defer({
    videos: loadChannelVideos(channelName),
  });
};
