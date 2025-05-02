import { useNavigate } from "react-router-dom";

export default function VideoItem({
  thumbnail,
  id,
  title,
  channelName,
  channelImg,
  views,
}) {

    const navigate = useNavigate();

    const handleVideoPlayClick = event => {navigate('videos/' + id)};

    const handleChannelClick = event => {navigate('channels/' + channelName)};

  return (
    <div className="flex flex-col items-center gap-2 justify-start p-3 rounded-lg">
      <div onClick={handleVideoPlayClick} className="relative rounded-md w-full">
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
            <h3 onClick={handleChannelClick} className="text-lg text-gray-800">{channelName}</h3>
            <h4 className="text-md text-gray-800">{views} Views</h4>
          </div>
        </div>
      </div>
    </div>
  );
}
