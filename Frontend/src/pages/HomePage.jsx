import { Await, defer, useLoaderData } from "react-router-dom";
import { Suspense } from "react";
import VideosList from "../components/HomePage/VideosList";

export default function HomePage() {
  const { videos } = useLoaderData();

  return (
    <div className="mt-[10dvh] w-screen bg-gray-100 pt-5">
      <h1 className="text-center text-3xl font-semibold">
        Entertain yourself by streaming our recent Videos
      </h1>
      <Suspense fallback={<p className="text-center">Loading......</p>}>
        <Await
          resolve={videos}
          children={(loadedVideos) => (
            <div className="grid grid-cols-4 gap-5">
              <VideosList videos={loadedVideos} />
            </div>
          )}
        />
      </Suspense>
    </div>
  );
}

export async function loadVideos() {
    const response = await fetch("https://localhost:5000/videos");
    if (!response.ok) throw new Error("Unable to fetch videos");
    const responseData = await response.json();
    return responseData;
}

export async function loader() {
  return defer({
    videos: loadVideos(),
  });
}
