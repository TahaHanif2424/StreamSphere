import { useRouteLoaderData } from 'react-router';
import VideoPlayer from '../components/VideoPage/VideoPlayer';
import VideoActions from '../components/VideoPage/VideoActions';
import CommentsList from '../components/VideoPage/CommentsList';
import VideosList from '../components/VideoPage/VideosList';

export default function VideoPage() {
  const { destinationVideo, videos, comments } = useRouteLoaderData('video');

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Main Video + Comments */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <VideoPlayer videoData={destinationVideo} />
          <VideoActions
            videoId={destinationVideo._id}
            channelId={destinationVideo.user_id._id}
            initialLikes={destinationVideo.likes}
          />
          <CommentsList
            comments={comments}
            channelName={destinationVideo.channelName}
            channelImageURL={destinationVideo.channelImageURL}
            videoId={destinationVideo._id}
          />
        </div>

        {/* Up Next */}
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


export async function loader({ params }) {
  const response = await fetch("http://localhost:5000/video/get-all");

  if (!response.ok) throw new Error("Error fetching the video data");

  const responseData = await response.json();
  let destinationVideo = null;

  const videos = responseData.filter((video) => {
    if (video._id === params.videoId) destinationVideo = video;

    return video._id !== params.videoId;
  });

  if (!destinationVideo) {
    throw new Error("Cant find the requried Video");
  }

  const comments = await fetch(
    "http://localhost:5000/comment/" + params.videoId
  );

  if(!comments.ok) {
    throw new Error('Cant fetch the comments');
  }

  const commentsData = await comments.json();

  return { destinationVideo, videos, comments : commentsData };
}
