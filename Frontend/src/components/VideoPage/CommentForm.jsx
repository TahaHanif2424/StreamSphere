import useInput from "../../hooks/useInput";
import { validateTitle } from "../../utils/validation";
import Input from "../UI/Input";

export default function CommentForm({
  channelName,
  channelImageURL,
  setComments,
  videoId,
}) {
  const [
    enteredComment,
    setEnteredComment,
    isCommentTouched,
    setIsCommentTouched,
    isCommentValid,
  ] = useInput({ isValidationOn: true, validationFunc: validateTitle }, "");
  const isFormValid = isCommentValid;

  async function handleFormSubmission(event) {
    event.preventDefault();
    if (!isFormValid) return;

    const response = await fetch("http://localhost:5000/comment/" + videoId, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: "681e23ffb39582f66be5419d",
        comment: enteredComment,
      }),
    });

    if (!response.ok) {
      throw new Error("Unable to make the comment");
    }

    setComments((prevComments) => [
      ...prevComments,
      {
        channelName,
        channelImageURL,
        comment: enteredComment,
        date: Date.now(),
      },
    ]);

    setEnteredComment("");
    setIsCommentTouched(false);
  }

  return (
    <form
      onSubmit={handleFormSubmission}
      className="flex items-start gap-3 py-2 px-3 bg-gray-100 rounded-md shadow-sm"
    >
      <img
        src={channelImageURL}
        alt={channelName}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex flex-col gap-2 w-full">
        <Input
          type="text"
          id="comment"
          name="comment"
          label="Add a comment"
          validation={true}
          value={enteredComment}
          setValue={setEnteredComment}
          isTouched={isCommentTouched}
          setIsTouched={setIsCommentTouched}
          isValid={isCommentValid}
          className="w-full"
        />
        <button
          type="submit"
          className="self-end px-4 py-1.5 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
