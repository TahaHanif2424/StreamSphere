// --- Updated ChannelPage.jsx ---
import { Suspense, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  Await,
  defer,
  useLoaderData,
  useNavigate,
  useParams,
} from "react-router";
import VideosList from "../components/HomePage/VideosList";
import { apiFetch } from "../utils/api";
import defaultChannelPic from "../../public/icon-7797704_640.png";

export default function ChannelPage() {
  const loaderData = useLoaderData();
  const { channelId } = useParams();
  const currUser = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tab || "videos");

  useEffect(() => {
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [tab]);

  useEffect(() => {
    if (activeTab === "playlists") {
      loadPlaylists();
    }
  }, [activeTab]);

  async function loadPlaylists() {
    const res = await apiFetch(`http://localhost:5000/playlist/${channelId}`);
    if (res.ok) {
      const data = await res.json();
      setPlaylists(data);
    }
  }

  async function createPlaylist(e) {
    e.preventDefault();
    if (!newPlaylistName) return;
    await apiFetch("http://localhost:5000/playlist/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: channelId,
        name: newPlaylistName,
        video_id: [],
      }),
    });
    setNewPlaylistName("");
    setIsPlaylistModalOpen(false);
    loadPlaylists();
  }

  function handleUploadClick() {
    navigate("/upload");
  }

  function openImageModal() {
    if (currUser._id !== channelId) return;
    setIsImageModalOpen(true);
  }

  function closeImageModal() {
    setIsImageModalOpen(false);
    setSelectedFile(null);
  }

  async function handleImageSubmit(e) {
    e.preventDefault();
    if (!selectedFile) return;
    const form = new FormData();
    form.append("image", selectedFile);
    await apiFetch(`http://localhost:5000/user/uploadimage/${channelId}`, {
      method: "PUT",
      body: form,
    });
    closeImageModal();
    window.location.reload();
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 py-8 px-4 sm:px-10">
      <Suspense
        fallback={<div className="text-center">Loading channel info...</div>}
      >
        <Await resolve={loaderData.channelInfo}>
          {(channelInfo) => (
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6 border-b pb-4">
              <div className="flex items-center gap-4">
                <img
                  src={channelInfo.channelImageURL || defaultChannelPic}
                  onClick={openImageModal}
                  alt={channelInfo.channelName}
                  className={`w-16 h-16 rounded-full object-cover ${
                    currUser._id === channelId ? "cursor-pointer" : ""
                  }`}
                />
                <div>
                  <h1 className="text-3xl font-bold">
                    {channelInfo.channelName}
                  </h1>
                  <div className="text-gray-600 text-sm mt-1">
                    <Suspense fallback={<span>– subscribers</span>}>
                      <Await resolve={loaderData.subCount}>
                        {(subCount) => <span>{subCount} subscribers</span>}
                      </Await>
                    </Suspense>
                    <span className="mx-2">|</span>
                    <Suspense fallback={<span>– total likes</span>}>
                      <Await resolve={loaderData.totalLikes}>
                        {(totalLikes) => <span>{totalLikes} total likes</span>}
                      </Await>
                    </Suspense>
                  </div>
                </div>
              </div>
              {channelId === currUser._id && (
                <button
                  onClick={handleUploadClick}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Upload New Video
                </button>
              )}
            </div>
          )}
        </Await>
      </Suspense>

      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "videos" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setSearchParams({ tab: "videos" })}
        >
          Videos
        </button>

        <button
          className={`px-4 py-2 rounded ${
            activeTab === "playlists" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setSearchParams({ tab: "playlists" })}
        >
          Playlists
        </button>

        {channelId === currUser._id && (
          <button
            className={`px-4 py-2 rounded ${
              activeTab === "history" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setSearchParams({ tab: "history" })}
          >
            Watch History
          </button>
        )}
      </div>

      {activeTab === "videos" && (
        <Suspense fallback={<div>Loading videos...</div>}>
          <Await resolve={loaderData.videos}>
            {(loaded) => (
              <VideosList
                isChangeable={channelId === currUser._id}
                isOpenedOnChannels={true}
                videos={loaded.video}
              />
            )}
          </Await>
        </Suspense>
      )}

      {activeTab === "history" && (
        <Suspense fallback={<div>Loading watch history...</div>}>
          <Await resolve={loaderData.watchHistory}>
            {(data) => {
              const [watchedVideos, setWatchedVideos] = useState(
                data.watchedVideos
              );

              async function handleWatchDelete(id) {
                const response = await apiFetch(
                  "http://localhost:5000/history/remove/" + id,
                  {
                    method: "DELETE",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      user_id: currUser._id,
                    }),
                  }
                );

                if (!response.ok) {
                  throw new Error("Unable to delete watch history video");
                }

                setWatchedVideos((videos) =>
                  videos.filter((video) => video._id !== id)
                );
              }

              return watchedVideos.length === 0 ? (
                <p className="text-gray-500">No watch history yet.</p>
              ) : (
                <VideosList
                  videos={watchedVideos}
                  isOpenedOnChannels={true}
                  isChangeable={false}
                  handleDelete={handleWatchDelete}
                />
              );
            }}
          </Await>
        </Suspense>
      )}

      {activeTab === "playlists" && (
        <div>
          {channelId === currUser._id && (
            <button
              onClick={() => setIsPlaylistModalOpen(true)}
              className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              + Add Playlist
            </button>
          )}
          {playlists.length === 0 ? (
            <p className="text-gray-500">No playlists yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {playlists.map((pl) => (
                <div
                  key={pl._id}
                  className="p-4 border rounded shadow cursor-pointer hover:bg-gray-100"
                  onClick={() => navigate(`/playlists/${pl._id}`)}
                >
                  <h2 className="text-lg font-semibold">{pl.name}</h2>
                  <p className="text-sm text-gray-600">
                    {pl.video_id.length} videos
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Image Upload Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            onClick={closeImageModal}
            className="fixed inset-0 bg-black opacity-50"
          />
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
                onClick={closeImageModal}
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

      {/* Playlist Creation Modal */}
      {isPlaylistModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            onClick={() => setIsPlaylistModalOpen(false)}
            className="fixed inset-0 bg-black opacity-50"
          />
          <form
            onSubmit={createPlaylist}
            className="bg-white p-6 rounded-lg shadow-lg z-10 w-full max-w-sm"
          >
            <h3 className="text-xl font-semibold mb-4">Create Playlist</h3>
            <input
              type="text"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="Playlist Name"
              className="mb-4 w-full p-2 border rounded"
              required
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsPlaylistModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

async function loadChannelVideos(channelId) {
  const response = await apiFetch("http://localhost:5000/video/get", {
    method: "POST",
    body: JSON.stringify({ user_id: channelId }),
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Could not fetch the videos");
  return response.json();
}
async function loadChannelInfo(channelId) {
  const response = await apiFetch(
    "http://localhost:5000/user/getuser/" + channelId
  );
  if (!response.ok) throw new Error("Could not fetch user data");
  return response.json();
}
async function loadSubscriberCount(channelId) {
  const res = await apiFetch(
    `http://localhost:5000/subscription/count/${channelId}`
  );
  if (!res.ok) return 0;
  const { count } = await res.json();
  return count;
}
async function loadTotalLikes(channelId) {
  const vidData = await loadChannelVideos(channelId);
  return vidData.video.reduce((sum, vid) => sum + (vid.likes || 0), 0);
}

async function loadWatchHistory(channelId) {
  const response = await apiFetch("http://localhost:5000/histroy/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: channelId }),
  });
  if (!response.ok) return { watchedVideos: [] };
  return response.json();
}

export async function loader({ params }) {
  const channelId = params.channelId;
  return defer({
    videos: loadChannelVideos(channelId),
    channelInfo: loadChannelInfo(channelId),
    subCount: loadSubscriberCount(channelId),
    totalLikes: loadTotalLikes(channelId),
    watchHistory: loadWatchHistory(channelId),
  });
}
