import { Suspense } from "react";
import { useSelector } from "react-redux";
import { Await, defer, useLoaderData, useNavigate, useParams } from "react-router";
import VideosList from "../components/HomePage/VideosList";

export default function ChannelPage() {
  const { videos } = useLoaderData();
  const { channelId } = useParams();
  const currUser = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  function handleUploadClick() {
    navigate('/upload')
  }


  return (
    <div className="flex">
      <h1>{channelId}</h1>
      {channelId === currUser && (
        <button onClick={handleUploadClick} className="bg-white font-semibold text-lg rounded-md text-green-600 hover:bg-green-600 hover:text-white">
          Upload New Video
        </button>
      )}
      <Suspense fallback={<div>Loading....</div>}>
        <Await resolve={videos} children={loadedVideos => <VideosList isChangeable={channelId == currUser} videos={loadedVideos.video}/>} />
      </Suspense>
    </div>
  );
}

async function loadChannelVideos(channelId) {
  const response = await fetch(
    "http://localhost:5000/video/get", {
      method: 'POST',
      body: JSON.stringify({user_id: channelId}),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
  if (!response.ok) throw new Error("could not fetch the videos");
  const responseData = response.json();
  return responseData;
};

export async function loader({ params }) {
  const channelName = params.channelId;
  return defer({
    videos: loadChannelVideos(channelName),
  });
};
