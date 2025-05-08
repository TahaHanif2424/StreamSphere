import { useNavigate } from "react-router-dom";

export default function VideoItem({
  URL,
  id,
  title,
  channelName,
  views,
  isChangeable,
  onDelete,
}) {
  const navigate = useNavigate();

  const handleVideoPlayClick = () => navigate("/videos/" + id);
  const handleChannelClick = () => navigate("/channels/" + channelName);
  const handleDeleteClick = () => onDelete(id);
  const handleEditClick = () => navigate(`/videos/${id}/edit`);

  return (
    <div className="flex flex-col gap-3 bg-white p-4 rounded-xl shadow-md transition-transform duration-200 hover:scale-[1.01]">
      <div
        onClick={handleVideoPlayClick}
        className="cursor-pointer rounded-lg w-full overflow-hidden aspect-video"
      >
        <img src={URL} className="w-full h-full object-cover" alt={title} />
      </div>

      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-sky-100 shrink-0"></div>

        <div className="flex flex-col justify-center">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <div className="flex items-center text-sm text-gray-700 gap-3">
            <h3 onClick={handleChannelClick} className="hover:underline cursor-pointer text-sky-600">
              {channelName}
            </h3>
            <h4 className="text-gray-500">{views} views</h4>
          </div>
        </div>
      </div>

      {isChangeable && (
        <div className="flex gap-4 justify-end mt-2">
          <button
            onClick={handleEditClick}
            className="px-4 py-1.5 text-sm font-medium text-white bg-sky-500 hover:bg-sky-700 rounded-md transition"
          >
            Edit
          </button>
          <button
            onClick={handleDeleteClick}
            className="px-4 py-1.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
