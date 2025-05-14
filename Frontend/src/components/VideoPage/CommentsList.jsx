import { useState } from "react";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

export default function CommentsList({ comments, channelName, channelImageURL, videoId }) {
  console.log(comments);
  const [allComments, setAllComments] = useState(comments);

  return (
    <div className="flex flex-col w-full gap-4 mt-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Comments</h2>
      <CommentForm
        setComments={setAllComments}
        channelImageURL={channelImageURL}
        channelName={channelName}
        videoId={videoId}
      />
      {allComments.map((comment) => (
        <CommentItem {...comment} key={comment._id} />
      ))}
    </div>
  );
}
