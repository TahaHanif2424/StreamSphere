import { useNavigate } from "react-router-dom";

export default function VideoItem({
  thumbnail,
  id,
  title,
  channelName,
  channelImg,
  views,
  isChangeable,
  onDelete
}) {
  const navigate = useNavigate();

  const handleVideoPlayClick = () => {
    navigate("videos/" + id);
  };

  const handleChannelClick = () => {
    navigate("channels/" + channelName);
  };

  const handleDeleteClick = () => {onDelete(id)};

  const handleEditClick = () => {
    navigate(`/videos/${id}/edit`);
  }

  return (
    <div className="flex flex-col items-center gap-2 justify-start p-3 rounded-lg">
      <div
        onClick={handleVideoPlayClick}
        className="relative rounded-md w-full"
      >
        <img src={thumbnail} className="w-full" alt={title} />
      </div>
      <div className="flex">
        <img
          src={channelImg}
          className="rounded-full w-[10%]"
          alt={channelName}
        />
        <div className="flex flex-col gap-2">
          <h2 className="text-xl">{title}</h2>
          <div className="flex gap-2">
            <h3 onClick={handleChannelClick} className="text-lg text-gray-800">
              {channelName}
            </h3>
            <h4 className="text-md text-gray-800">{views} Views</h4>
          </div>
        </div>
      </div>
      {isChangeable && (
        <div className="flex justify-center items-center">
          <button onClick={handleEditClick} className="text-lg rounded-md font-semibold font-white bg-sky-500 hover:bg-sky-700 transition-all duration-300">
            Edit
          </button>
          <button onClick={handleDeleteClick} className="text-lg rounded-md font-semibold font-white bg-red-500 hover:bg-white hover:text-red-600 transition-all duration-300">
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
