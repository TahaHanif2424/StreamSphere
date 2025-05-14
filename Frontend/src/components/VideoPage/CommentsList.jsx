export default function CommentsList({ comments }) {
  return (
    <div className="flex flex-col w-full gap-4 mt-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Comments</h2>
      {comments.map((comment) => (
        <CommentItem {...comment} key={comment._id} />
      ))}
    </div>
  );
};
