import useInput from "../../hooks/useInput";
import { validateTitle } from "../../utils/validation";
import Input from "../UI/Input";
import { apiFetch } from "../../utils/api";
import { useSelector } from "react-redux";
import defaultChannelPic from '../../../public/icon-7797704_640.png';


export default function CommentForm({
  channelName,
  channelImageURL,
  setComments,
  videoId,
}) {
  const [
    enteredComment,
    setEnteredComment,
    isTouched,
    setIsTouched,
    isValid,
  ] = useInput({ isValidationOn: true, validationFunc: validateTitle }, "");
  const user = useSelector(state => state.user.user);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    const res = await apiFetch(`http://localhost:5000/comment/${videoId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user._id, comment: enteredComment }),
    });
    if (!res.ok) throw new Error("Unable to post comment");

    const resData = await res.json();

    setComments((prev) => [
      ...prev,
      resData
    ]);
    setEnteredComment("");
    setIsTouched(false);
  };

  return (
    <form onSubmit={submitHandler} className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm">
      <img
        src={channelImageURL || defaultChannelPic}
        alt={channelName}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex-1 flex flex-col gap-2">
        <Input
          type="text"
          id="comment"
          name="comment"
          label="Add a comment"
          validation
          value={enteredComment}
          setValue={setEnteredComment}
          isTouched={isTouched}
          setIsTouched={setIsTouched}
          isValid={isValid}
          className="w-full"
        />
        <button
          type="submit"
          disabled={!isValid}
          className="self-end px-4 py-1.5 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
