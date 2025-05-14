// src/pages/ChannelPage.jsx
import { Suspense, useState } from 'react';
import { useSelector } from 'react-redux';
import { Await, defer, useLoaderData, useNavigate, useParams } from 'react-router';
import VideosList from '../components/HomePage/VideosList';

export default function ChannelPage() {
  const { videos, channelInfo, subCount, totalLikes } = useLoaderData();
  console.log(channelInfo);
  const { channelId } = useParams();
  const currUser = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  function handleUploadClick() {
    navigate('/upload');
  }
  function openModal() { setIsModalOpen(true); }
  function closeModal() { setIsModalOpen(false); setSelectedFile(null); }
  async function handleImageSubmit(e) {
    e.preventDefault();
    if (!selectedFile) return;
    const form = new FormData();
    form.append('image', selectedFile);
    await fetch(`http://localhost:5000/user/uploadimage/${channelId}`, {
      method: 'PUT',
      body: form,
    });
    closeModal();
    window.location.reload();
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 py-8 px-4 sm:px-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 border-b pb-4 border-gray-200">
        <div className="flex items-center gap-4">
          <img
            src={channelInfo.channelImageURL}
            onClick={openModal}
            alt={channelInfo.channelName}
            className="w-16 h-16 rounded-full object-cover cursor-pointer shadow-md"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{channelInfo.channelName}</h1>
            <div className="flex items-center gap-4 text-gray-600 mt-1">
              <span>{subCount} subscribers</span>
              <span>{totalLikes} total likes</span>
            </div>
          </div>
        </div>
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
        <Await resolve={videos}>
          {(loadedVideos) => (
            <VideosList
              isChangeable={channelId === currUser}
              isOpenedOnChannels={true}
              videos={loadedVideos.video}
            />
          )}
        </Await>
      </Suspense>

      {/* Custom Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div onClick={closeModal} className="fixed inset-0 bg-black opacity-50" />
          {/* Modal Content */}
          <form
            onSubmit={handleImageSubmit}
            className="bg-white p-6 rounded-lg shadow-lg z-10 w-full max-w-sm"
          >
            <h3 className="text-xl font-semibold mb-4">Change Channel Image</h3>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={!selectedFile}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}


// loader
async function loadChannelVideos(channelId) {
  const response = await fetch('http://localhost:5000/video/get', {
    method: 'POST',
    body: JSON.stringify({ user_id: channelId }),
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) throw new Error('Could not fetch the videos');
  return response.json();
}
async function loadChannelInfo(channelId) {
  const response = await fetch('http://localhost:5000/user/getimage');
  if (!response.ok) throw new Error('Could not fetch user data');
  const users = await response.json();
  return users.find(u => u._id === channelId);
}
async function loadSubscriberCount(channelId) {
  const res = await fetch(`http://localhost:5000/subscription/count/${channelId}`);
  if (!res.ok) return 0;
  const { count } = await res.json();
  return count;
}
async function loadTotalLikes(channelId) {
  // fetch all videos, sum their likes
  const vidData = await loadChannelVideos(channelId);
  return vidData.video.reduce((sum, vid) => sum + (vid.likes || 0), 0);
}

export async function loader({ params }) {
  const channelId = params.channelId;
  return defer({
    videos: loadChannelVideos(channelId),
    channelInfo: loadChannelInfo(channelId),
    subCount: loadSubscriberCount(channelId),
    totalLikes: loadTotalLikes(channelId)
  });
}
