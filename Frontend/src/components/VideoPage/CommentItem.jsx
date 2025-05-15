import { useNavigate } from "react-router";

export default function CommentItem({
  comment,
  date,
  user_id
}) {
  const navigate = useNavigate();
  return (
    <div className="flex gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition">
      <img
        src={user_id.channelImageURL}
        alt={user_id.channelName}
        onClick={() => navigate(`/channels/${user_id._id}`)}
        className="w-10 h-10 rounded-full object-cover cursor-pointer"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2 text-sm">
          <span
            onClick={() => navigate(`/channels/${user_id._id}`)}
            className="font-semibold text-gray-800 hover:underline cursor-pointer"
          >
            {user_id.channelName}
          </span>
          <span className="text-gray-500">
            {new Date(date).toLocaleDateString()}
          </span>
        </div>
        <p className="mt-1 text-gray-700">{comment}</p>
      </div>
    </div>
  );
}
