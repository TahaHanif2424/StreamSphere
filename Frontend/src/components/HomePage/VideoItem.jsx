import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VideoItem({
  _id,
  title,
  channelName,
  user_id,
  channelImageURL,
  views,
  isChangeable,
  onDelete,
  thumbnailURL,
  isOpenedOnChannels
}) {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleVideoPlayClick = () => navigate("/videos/" + _id);
  const handleChannelClick = () => navigate("/channels/" + user_id._id);
  const handleDeleteClick = () => onDelete(_id);
  const handleEditClick = () => navigate(`/videos/${_id}/edit`);

  return (
    <div className="flex flex-col gap-3 bg-white p-4 rounded-xl shadow-md transition-transform duration-200 hover:scale-[1.01]">
      <div
        onClick={handleVideoPlayClick}
        className="cursor-pointer rounded-lg w-full overflow-hidden aspect-video relative bg-gray-100"
      >
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            Loading...
          </div>
        )}
        {hasError ? (
          <img
            src="/fallback-thumbnail.jpg"
            className="w-full h-full object-cover"
            alt="Fallback thumbnail"
          />
        ) : (
          <img
            src={thumbnailURL}
            className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            alt={title}
          />
        )}
      </div>

      <div className="flex gap-3">
        {
          !isOpenedOnChannels && <div className="w-10 h-10 rounded-full bg-sky-100 shrink-0">
            <img src={user_id ? user_id.channelImageURL || '' : ''} className="w-full rounded-full" alt="" />
          </div>
        }

        <div className="flex flex-col justify-center">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <div className="flex items-center text-sm text-gray-700 gap-3">
            {
              !isOpenedOnChannels && <h3
                onClick={handleChannelClick}
                className="hover:underline cursor-pointer text-sky-600"
              >
                {user_id ? user_id.channelName || '' : ''}
              </h3>
            }
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
