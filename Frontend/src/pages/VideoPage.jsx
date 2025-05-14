import { useRouteLoaderData } from 'react-router';
import VideoPlayer from '../components/VideoPage/VideoPlayer';
import CommentsList from '../components/VideoPage/CommentsList';
import VideosList from '../components/VideoPage/VideosList';

export default function VideoPage() {
  const { destinationVideo, videos, comments } = useRouteLoaderData('video');

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2 flex flex-col gap-6">
          <VideoPlayer videoData={destinationVideo} />

          <CommentsList
            comments={comments}
            channelName={destinationVideo.channelName}
            channelImageURL={destinationVideo.channelImageURL}
            videoId={destinationVideo._id}
          />
        </div>

        <aside className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-800">Up Next</h2>
          <div className="flex-1 overflow-y-auto space-y-4">
            <VideosList videos={videos} />
          </div>
        </aside>
      </div>
    </div>
  );
}
