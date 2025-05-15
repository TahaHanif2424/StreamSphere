import { Form, useParams, useSearchParams, useSubmit } from "react-router-dom";
import useInput from "../../hooks/useInput";
import { validateTitle } from "../../utils/validation";
import Input from "../UI/Input";
import FileDropZone from "./FileDropZone";
import { useRef, useState, useEffect } from "react";

export default function UploadForm({ title, thumbnail, video }) {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  console.log(searchParams);
  const submit = useSubmit();
  const isEditing = !!params.videoId;
  const [files, setFiles] = useState({ image: null, video: null });

  const hiddenImageInput = useRef();
  const hiddenVideoInput = useRef();

  useEffect(() => {
    if (files.image && hiddenImageInput.current) {
      const dt = new DataTransfer();
      dt.items.add(files.image);
      hiddenImageInput.current.files = dt.files;
    }
    if (files.video && hiddenVideoInput.current) {
      const dt = new DataTransfer();
      dt.items.add(files.video);
      hiddenVideoInput.current.files = dt.files;
    }
  }, [files]);

  const [
    enteredTitle,
    setEnteredTitle,
    isTitleTouched,
    setIsTitleTouched,
    isTitleValid,
  ] = useInput(
    { isValidationOn: true, validationFunc: validateTitle },
    isEditing ? title : ""
  );

  const postURL = isEditing ? `/videos/${params.videoId}/edit` : "/upload";

  function handleSubmission(e) {
    e.preventDefault();

    const form = e.target.closest("form");
    submit(new FormData(form), {
      method: "POST",
      action: postURL,
      encType: "multipart/form-data",
    });
  }

  return (
    <Form
      method="POST"
      className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-xl space-y-6"
      encType="multipart/form-data"
    >
      <h1 className="text-2xl font-bold text-blue-600 text-center">
        {!isEditing ? "Upload a New Video" : "Edit Video"}
      </h1>

      <div>
        <Input
          type="text"
          label="Title"
          id="title"
          name="title"
          validation={true}
          isTouched={isTitleTouched}
          setIsTouched={setIsTitleTouched}
          value={enteredTitle}
          setValue={setEnteredTitle}
          isValid={isTitleValid}
        />
      </div>

      <FileDropZone setFiles={setFiles} files={files} />

      <input type="file" name="thumbnail" ref={hiddenImageInput} hidden />
      <input type="file" name="video" ref={hiddenVideoInput} hidden />

      <div className="text-center">
        <button
          onClick={handleSubmission}
          type="submit"
          className="bg-blue-500 text-white text-lg font-semibold rounded-md py-2 px-6 transition-colors duration-200 hover:bg-white hover:text-blue-600 border border-blue-500 cursor-pointer"
        >
          Submit
        </button>
      </div>
    </Form>
  );
}
