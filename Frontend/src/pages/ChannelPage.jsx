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
    navigate('/upload');
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 py-8 px-4 sm:px-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 border-b pb-4 border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 break-all">
          {channelId}
        </h1>
        {channelId === currUser && (
          <button
            onClick={handleUploadClick}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg transition"
          >
            Upload New Video
          </button>
        )}
      </div>

      <Suspense fallback={<div className="text-center text-gray-500">Loading videos...</div>}>
        <Await
          resolve={videos}
          children={(loadedVideos) => (
            <VideosList
              isChangeable={channelId === currUser}
              videos={loadedVideos.video}
            />
          )}
        />
      </Suspense>
    </div>
  );
}

async function loadChannelVideos(channelId) {
  const response = await fetch("http://localhost:5000/video/get", {
    method: 'POST',
    body: JSON.stringify({ user_id: channelId }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error("Could not fetch the videos");
  const responseData = await response.json();
  return responseData;
}

export async function loader({ params }) {
  const channelId = params.channelId;
  return defer({
    videos: loadChannelVideos(channelId),
  });
}
