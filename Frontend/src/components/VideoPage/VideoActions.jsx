import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { apiFetch } from "../../utils/api";

export default function VideoActions({ videoId, channelId, initialLikes }) {
  const currentUser = useSelector((state) => state.user.user);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikes || 0);
  const [subscribed, setSubscribed] = useState(false);

  // Check like status
  useEffect(() => {
    apiFetch(`http://localhost:5000/like/${videoId}`)
      .then((res) => res.json())
      .then((data) => {
        const userLiked = data.some(
          (like) => like.user_id._id === currentUser._id
        );
        setLiked(userLiked);
        setLikeCount(data.length);
      })
      .catch(console.error);
  }, [videoId, currentUser._id]);

  // Check subscription status
  useEffect(() => {
    apiFetch(`http://localhost:5000/subscription/` + currentUser._id)
      .then((res) => {
        if (!res.ok) throw new Error("Not subscribed");
        return res.json();
      })
      .then((sub) => {
        setSubscribed(sub.subscribedChannel.includes(channelId));
      })
      .catch(() => setSubscribed(false));
  }, [channelId, currentUser._id]);

  const toggleLike = async () => {
    try {
      if (!liked) {
        await apiFetch(`http://localhost:5000/like/${videoId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: currentUser._id }),
        });
        setLikeCount((c) => c + 1);
      } else {
        await apiFetch(`http://localhost:5000/like/unlike/${videoId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: currentUser._id }),
        });
        setLikeCount((c) => Math.max(0, c - 1));
      }
      setLiked(!liked);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSubscribe = async () => {
    try {
      if (!subscribed) {
        ``;
        await apiFetch("http://localhost:5000/subscription/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: currentUser._id,
            channelId,
          }),
        });
      } else {
        await apiFetch(
          `http://localhost:5000/subscription/unsubscribe/${channelId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: currentUser._id }),
          }
        );
      }
      setSubscribed(!subscribed);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex items-center gap-6 mt-4">
      {/* Like Button */}
      <button
        onClick={toggleLike}
        className="flex items-center gap-2 text-white bg-black bg-opacity-60 hover:bg-opacity-80 px-3 py-1 rounded-md transition"
      >
        {liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
        <span>{likeCount}</span>
      </button>

      {/* Subscribe Button */}
      <button
        onClick={toggleSubscribe}
        className={`px-4 py-1 text-sm font-semibold rounded-md transition shadow-sm ${
          subscribed
            ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {subscribed ? "Subscribed" : "Subscribe"}
      </button>
    </div>
  );
}
