import { useEffect, useState } from "react";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

export default function CommentsList({
  comments: initialComments,
  channelName,
  channelImageURL,
  videoId,
}) {
  const [allComments, setAllComments] = useState([]);

  useEffect(() => {
    setAllComments(initialComments);
  })

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold text-gray-800">Comments</h2>
      <CommentForm
        channelName={channelName}
        channelImageURL={channelImageURL}
        setComments={setAllComments}
        videoId={videoId}
      />
      <div className="space-y-4">
        {allComments.map((c) => {
          console.log(c);
          return <CommentItem key = {c._id
        } { ...c } />;}
        )}
      </div>
    </div>
  );
}