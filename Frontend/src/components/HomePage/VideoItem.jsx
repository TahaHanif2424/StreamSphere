import { useState } from "react";
import { useNavigate } from "react-router-dom";
import defaultChannelPic from "../../../public/icon-7797704_640.png";

export default function VideoItem({
  _id,
  title,
  user_id,
  views,
  isChangeable,
  onDelete,
  thumbnailURL,
  isOpenedOnChannels,
}) {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleVideoPlayClick = () => navigate("/videos/" + _id);
  const handleChannelClick = () =>
    navigate("/channels/" + user_id._id + "?tab=videos");
  const handleDeleteClick = () => onDelete(_id);
  const handleEditClick = () => navigate(`/videos/${_id}/edit`);

  return (
    <div className="flex flex-col gap-3 bg-gradient-to-tr from-blue-900 via-blue-950 to-black p-4 rounded-xl shadow-lg shadow-blue-900/30 hover:shadow-blue-800 transition-transform hover:scale-[1.015] text-white">
      {/* Thumbnail */}
      <div
        onClick={handleVideoPlayClick}
        className="cursor-pointer rounded-lg overflow-hidden aspect-video relative bg-gray-800"
      >
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
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
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            alt={title}
          />
        )}
      </div>

      {/* Info */}
      <div className="flex gap-3">
        {!isOpenedOnChannels && (
          <div className="w-10 h-10 rounded-full bg-blue-800 shrink-0">
            <img
              src={user_id.channelImageURL || defaultChannelPic}
              className="w-full h-full rounded-full object-cover"
              alt="Channel"
            />
          </div>
        )}
        <div className="flex flex-col justify-center">
          <h2 className="text-lg font-semibold text-blue-100">{title}</h2>
          <div className="flex items-center text-sm text-blue-300 gap-3">
            {!isOpenedOnChannels && (
              <h3
                onClick={handleChannelClick}
                className="hover:underline cursor-pointer text-blue-400"
              >
                {user_id.channelName}
              </h3>
            )}
            <h4 className="text-sm text-blue-500">{views} views</h4>
          </div>
        </div>
      </div>

      {/* Actions */}
      {isChangeable && (
        <div className="flex gap-4 justify-end mt-2">
          <button
            onClick={handleEditClick}
            className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition"
          >
            Edit
          </button>
          <button
            onClick={handleDeleteClick}
            className="px-4 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
