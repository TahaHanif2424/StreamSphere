import { useNavigate } from "react-router";

export default function VideoItem({ title, channelName, channelImageURL, views, _id, thumbnailURL }) {
  const navigate = useNavigate();

  function handleVideoPlayClick() {
    navigate("/videos/" + _id);
  }

  function handleChannelClick() {
    navigate("/channels/" + channelName);
  }

  return (
    <div
      onClick={handleVideoPlayClick}
      className="cursor-pointer flex flex-col w-full max-w-sm bg-white rounded-xl shadow-md overflow-hidden hover:scale-[1.01] transition-transform duration-200"
    >
      <div className="w-full aspect-video overflow-hidden">
        <img src={thumbnailURL} alt={title} className="w-full h-full object-cover" />
      </div>

      <div className="flex gap-3 p-3">
        <img
          onClick={(e) => {
            e.stopPropagation();
            handleChannelClick();
          }}
          src={channelImageURL}
          alt={channelName}
          className="w-10 h-10 rounded-full object-cover cursor-pointer"
        />
        <div className="flex flex-col gap-1">
          <h1 className="text-md font-semibold text-gray-900 line-clamp-2">{title}</h1>
          <div className="text-sm text-gray-600 flex flex-col">
            <span
              onClick={(e) => {
                e.stopPropagation();
                handleChannelClick();
              }}
              className="text-sky-600 hover:underline cursor-pointer"
            >
              {channelName}
            </span>
            <span className="text-gray-500">{views} views</span>
          </div>
        </div>
      </div>
    </div>
  );
}
