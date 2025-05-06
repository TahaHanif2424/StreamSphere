import { Await, defer, useLoaderData } from "react-router-dom";
import { Suspense } from "react";
import VideosList from "../components/HomePage/VideosList";
import SkeletonVideosList from '../components/UI/Skeleton/VideosList';

export default function HomePage() {
  const { videos } = useLoaderData();

  return (
    <>
      <h1 className="text-center text-3xl font-semibold">
        Entertain yourself by streaming our recent Videos
      </h1>
      <Suspense fallback={<SkeletonVideosList />}>
        <Await
          resolve={videos}
          children={(loadedVideos) => (
            <div className="grid grid-cols-4 gap-5">
              <VideosList videos={loadedVideos} />
            </div>
          )}
        />
      </Suspense>
    </>
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
