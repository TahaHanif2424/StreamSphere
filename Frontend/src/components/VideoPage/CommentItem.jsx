import { useNavigate } from "react-router";

export default function CommentItem({
  channelImageURL,
  comment,
  date,
  channelName,
}) {
  const navigate = useNavigate();

  function handleChannelClick() {
    navigate("/channels/" + channelName);
  }

  return (
    <div className="flex gap-4 px-4 py-3 bg-white rounded-lg shadow-sm hover:shadow-md transition duration-200">
      <img
        onClick={handleChannelClick}
        src={channelImageURL}
        alt={channelName}
        className="w-10 h-10 rounded-full object-cover cursor-pointer"
      />
      <div className="flex flex-col gap-1 text-sm w-full">
        <div className="flex gap-2 items-center">
          <h3
            onClick={handleChannelClick}
            className="font-semibold text-gray-800 cursor-pointer hover:underline"
          >
            {channelName}
          </h3>
          <span className="text-gray-500 text-xs">
            {new Date(date).toLocaleDateString()}
          </span>
        </div>
        <p className="text-gray-700">{comment}</p>
      </div>
    </div>
  );
}
