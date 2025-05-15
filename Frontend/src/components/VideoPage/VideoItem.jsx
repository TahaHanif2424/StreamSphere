import { useNavigate } from "react-router";

export default function VideoItem({
  _id,
  title,
  user_id,
  views,
  thumbnailURL,
}) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/videos/${_id}`)}
      className="flex cursor-pointer gap-3 p-2 hover:bg-white hover:shadow-md rounded-lg transition"
    >
      <div className="w-32 flex-shrink-0 aspect-video overflow-hidden rounded-md bg-gray-200">
        <img
          src={thumbnailURL}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
          {title}
        </h3>
        <p
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/channels/${user_id._id}?tab=videos`);
          }}
          className="text-xs text-sky-600 hover:underline cursor-pointer mt-1"
        >
          {user_id.channelName}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">{views} views</p>
      </div>
    </div>
  );
}