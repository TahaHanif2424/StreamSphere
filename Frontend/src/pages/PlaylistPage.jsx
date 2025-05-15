import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { apiFetch } from "../utils/api";
import VideosList from "../components/HomePage/VideosList";

export default function PlaylistPage() {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const currUser = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPlaylist() {
      try {
        const res = await apiFetch(`http://localhost:5000/playlist/video/${playlistId}`);
        if (!res.ok) throw new Error("Failed to fetch playlist");
        const data = await res.json();
        setPlaylist(data.playlist);
        setVideos(data.videos);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchPlaylist();
  }, [playlistId]);

  async function deletePlaylist() {
    const confirm = window.confirm("Are you sure you want to delete this playlist?");
    if (!confirm) return;
    await apiFetch(`http://localhost:5000/playlist/delete/${playlistId}`, {
      method: "DELETE",
    });
    navigate(`/channels/${currUser._id}`);
  }

  function handleAddVideo() {
    navigate(`/upload?playlistId=${playlistId}`);
  }

  if (loading) return <div className="p-8 text-center">Loading playlist...</div>;
  if (!playlist) return <div className="p-8 text-center text-red-500">Playlist not found</div>;

  return (
    <div className="min-h-screen w-full bg-gray-50 py-8 px-4 sm:px-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{playlist.name}</h1>
          <p className="text-gray-600">{videos.length} videos</p>
        </div>
        <div className="flex gap-2">
          {currUser._id === playlist.user_id && (
            <>
              <button
                onClick={handleAddVideo}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add Video
              </button>
              <button
                onClick={deletePlaylist}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete Playlist
              </button>
            </>
          )}
        </div>
      </div>

      {videos.length === 0 ? (
        <p className="text-gray-500">No videos in this playlist.</p>
      ) : (
        <VideosList videos={videos} isOpenedOnChannels={true} isChangeable={currUser._id === playlist.user_id} />
      )}
    </div>
  );
};
