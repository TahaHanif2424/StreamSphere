import { useNavigate } from "react-router";
import defaultChannelPic from '../../../public/icon-7797704_640.png';

export default function CommentItem({ comment, date, user_id }) {
  const navigate = useNavigate();
  return (
    <article className="flex gap-4 p-4 bg-gray-50 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200">
      <img
        src={user_id.channelImageURL || defaultChannelPic}
        alt={user_id.channelName}
        onClick={() => navigate(`/channels/${user_id._id}?tab=videos`)}
        className="w-12 h-12 rounded-full object-cover cursor-pointer flex-shrink-0"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span
            onClick={() => navigate(`/channels/${user_id._id}?tab=videos`)}
            className="font-semibold hover:underline cursor-pointer"
          >
            {user_id.channelName}
          </span>
          <span className="text-gray-400">
            · {new Date(date).toLocaleDateString()}
          </span>
        </div>
        <p className="mt-1 text-gray-800">{comment}</p>
      </div>
    </article>
  );
}
